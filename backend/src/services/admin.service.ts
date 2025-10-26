import { db, users, prompts, subscriptions, aiUsageLogs, adminActionLogs, favorites } from '../db/index.js';
import { eq, desc, sql, and, gte, lte, count, or, ilike } from 'drizzle-orm';
import { AppError } from '../middleware/errorHandler.js';
import bcrypt from 'bcrypt';
import { cache, CacheKeys } from '../utils/cache.js';

const SALT_ROUNDS = 12;

/**
 * 获取平台统计数据
 * 缓存60秒
 */
export async function getDashboardStats() {
  return cache.getOrSet(CacheKeys.DASHBOARD_STATS, async () => {
    try {
    // 获取总用户数
    const [totalUsersResult] = await db
      .select({ count: count() })
      .from(users);
    const totalUsers = totalUsersResult.count;

    // 获取活跃用户数
    const [activeUsersResult] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.isActive, true));
    const activeUsers = activeUsersResult.count;

    // 获取总提示词数
    const [totalPromptsResult] = await db
      .select({ count: count() })
      .from(prompts)
      .where(eq(prompts.isPublished, true));
    const totalPrompts = totalPromptsResult.count;

    // 获取 Pro 订阅数
    const [activeSubscriptionsResult] = await db
      .select({ count: count() })
      .from(subscriptions)
      .where(eq(subscriptions.status, 'active'));
    const activeSubscriptions = activeSubscriptionsResult.count;

    // 获取本月新增用户数
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const [newUsersThisMonthResult] = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, firstDayOfMonth));
    const newUsersThisMonth = newUsersThisMonthResult.count;

    // 获取本月新增提示词数
    const [newPromptsThisMonthResult] = await db
      .select({ count: count() })
      .from(prompts)
      .where(gte(prompts.createdAt, firstDayOfMonth));
    const newPromptsThisMonth = newPromptsThisMonthResult.count;

    // 计算订阅转化率
    const conversionRate = totalUsers > 0 
      ? ((activeSubscriptions / totalUsers) * 100).toFixed(2) 
      : '0.00';

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      totalPrompts,
      activeSubscriptions,
      freeUsers: totalUsers - activeSubscriptions,
      newUsersThisMonth,
      newPromptsThisMonth,
      conversionRate: `${conversionRate}%`,
    };
  } catch (error) {
    console.error('获取统计数据失败:', error);
    throw new AppError(500, 'DATABASE_ERROR', '获取统计数据失败');
  }
  }, 60); // 缓存60秒
}

/**
 * 获取用户增长数据（最近30天）
 * 缓存5分钟
 */
export async function getUserGrowthData() {
  return cache.getOrSet(CacheKeys.USER_GROWTH, async () => {
    try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const growthData = await db
      .select({
        date: sql<string>`DATE(${users.createdAt})`,
        count: count(),
      })
      .from(users)
      .where(gte(users.createdAt, thirtyDaysAgo))
      .groupBy(sql`DATE(${users.createdAt})`)
      .orderBy(sql`DATE(${users.createdAt})`);

    return growthData;
  } catch (error) {
    console.error('获取用户增长数据失败:', error);
    throw new AppError(500, 'DATABASE_ERROR', '获取用户增长数据失败');
  }
  }, 300); // 缓存5分钟
}

/**
 * 获取热门提示词
 * 缓存2分钟
 */
export async function getTopPrompts(limit: number = 10) {
  return cache.getOrSet(CacheKeys.TOP_PROMPTS(limit), async () => {
    try {
    const topPrompts = await db
      .select({
        id: prompts.id,
        title: prompts.title,
        model: prompts.model,
        viewsCount: prompts.viewsCount,
        favoritesCount: prompts.favoritesCount,
        createdAt: prompts.createdAt,
        authorUsername: users.username,
      })
      .from(prompts)
      .leftJoin(users, eq(prompts.authorId, users.id))
      .where(eq(prompts.isPublished, true))
      .orderBy(desc(prompts.viewsCount))
      .limit(limit);

    return topPrompts;
  } catch (error) {
    console.error('获取热门提示词失败:', error);
    throw new AppError(500, 'DATABASE_ERROR', '获取热门提示词失败');
  }
  }, 120); // 缓存2分钟
}

/**
 * 获取用户列表（分页、搜索、筛选）
 */
export async function getUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
  subscriptionTier?: 'free' | 'pro';
}) {
  try {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    // 构建查询条件
    const conditions = [];
    
    if (params.search) {
      conditions.push(
        or(
          ilike(users.username, `%${params.search}%`),
          ilike(users.email, `%${params.search}%`)
        )
      );
    }

    if (params.role) {
      conditions.push(eq(users.role, params.role));
    }

    if (params.isActive !== undefined) {
      conditions.push(eq(users.isActive, params.isActive));
    }

    if (params.subscriptionTier) {
      conditions.push(eq(users.subscriptionTier, params.subscriptionTier));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 获取用户列表
    const userList = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        subscriptionTier: users.subscriptionTier,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    // 获取总数
    const [totalResult] = await db
      .select({ count: count() })
      .from(users)
      .where(whereClause);

    const total = totalResult.count;
    const totalPages = Math.ceil(total / limit);

    return {
      users: userList,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.error('获取用户列表失败:', error);
    throw new AppError(500, 'DATABASE_ERROR', '获取用户列表失败');
  }
}

/**
 * 获取用户详情
 */
export async function getUserDetail(userId: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
    }

    // 获取用户的提示词统计
    const [promptStats] = await db
      .select({ count: count() })
      .from(prompts)
      .where(eq(prompts.authorId, userId));

    // 获取用户的收藏统计
    const [favoriteStats] = await db
      .select({ count: count() })
      .from(favorites)
      .where(eq(favorites.userId, userId));

    // 获取用户的订阅信息
    const subscription = await db.query.subscriptions.findFirst({
      where: and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, 'active')
      ),
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
      isActive: user.isActive,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      stats: {
        promptsCount: promptStats.count,
        favoritesCount: favoriteStats.count,
      },
      subscription: subscription || null,
    };
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    console.error('获取用户详情失败:', error);
    throw new AppError(500, 'DATABASE_ERROR', '获取用户详情失败');
  }
}

/**
 * 更新用户信息（管理员操作）
 */
export async function updateUser(
  adminId: string,
  userId: string,
  data: {
    username?: string;
    email?: string;
    role?: 'user' | 'admin';
    subscriptionTier?: 'free' | 'pro';
    isActive?: boolean;
  },
  ipAddress?: string,
  userAgent?: string
) {
  try {
    // 更新用户
    const [updatedUser] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        subscriptionTier: users.subscriptionTier,
        isActive: users.isActive,
      });

    if (!updatedUser) {
      throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
    }

    // 记录管理员操作日志
    await logAdminAction({
      adminId,
      action: 'update_user',
      targetType: 'user',
      targetId: userId,
      details: data,
      ipAddress,
      userAgent,
    });

    return updatedUser;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    console.error('更新用户失败:', error);
    throw new AppError(500, 'DATABASE_ERROR', '更新用户失败');
  }
}

/**
 * 重置用户密码（管理员操作）
 */
export async function resetUserPassword(
  adminId: string,
  userId: string,
  newPassword: string,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    // 加密新密码
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // 更新密码
    await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // 记录管理员操作日志
    await logAdminAction({
      adminId,
      action: 'reset_password',
      targetType: 'user',
      targetId: userId,
      details: { message: 'Password reset by admin' },
      ipAddress,
      userAgent,
    });

    return { message: 'Password reset successfully' };
  } catch (error) {
    console.error('重置密码失败:', error);
    throw new AppError(500, 'DATABASE_ERROR', '重置密码失败');
  }
}

/**
 * 删除用户（软删除 - 禁用账户）
 */
export async function deleteUser(
  adminId: string,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    // 禁用用户账户
    await db
      .update(users)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // 记录管理员操作日志
    await logAdminAction({
      adminId,
      action: 'delete_user',
      targetType: 'user',
      targetId: userId,
      details: { message: 'User account disabled' },
      ipAddress,
      userAgent,
    });

    return { message: 'User deleted successfully' };
  } catch (error) {
    console.error('删除用户失败:', error);
    throw new AppError(500, 'DATABASE_ERROR', '删除用户失败');
  }
}

/**
 * 获取提示词列表（管理员视图 - 包括未发布的）
 */
export async function getPrompts(params: {
  page?: number;
  limit?: number;
  search?: string;
  model?: string;
  isPublished?: boolean;
}) {
  try {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    // 构建查询条件
    const conditions = [];
    
    if (params.search) {
      conditions.push(
        or(
          ilike(prompts.title, `%${params.search}%`),
          ilike(prompts.description, `%${params.search}%`)
        )
      );
    }

    if (params.model) {
      conditions.push(eq(prompts.model, params.model));
    }

    if (params.isPublished !== undefined) {
      conditions.push(eq(prompts.isPublished, params.isPublished));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 获取提示词列表
    const promptList = await db
      .select({
        id: prompts.id,
        title: prompts.title,
        description: prompts.description,
        model: prompts.model,
        category: prompts.category,
        isPublished: prompts.isPublished,
        isPremium: prompts.isPremium,
        viewsCount: prompts.viewsCount,
        favoritesCount: prompts.favoritesCount,
        createdAt: prompts.createdAt,
        authorUsername: users.username,
        authorId: users.id,
      })
      .from(prompts)
      .leftJoin(users, eq(prompts.authorId, users.id))
      .where(whereClause)
      .orderBy(desc(prompts.createdAt))
      .limit(limit)
      .offset(offset);

    // 获取总数
    const [totalResult] = await db
      .select({ count: count() })
      .from(prompts)
      .where(whereClause);

    const total = totalResult.count;
    const totalPages = Math.ceil(total / limit);

    return {
      prompts: promptList,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.error('获取提示词列表失败:', error);
    throw new AppError(500, 'DATABASE_ERROR', '获取提示词列表失败');
  }
}

/**
 * 更新提示词（管理员操作）
 */
export async function updatePrompt(
  adminId: string,
  promptId: string,
  data: {
    title?: string;
    description?: string;
    isPublished?: boolean;
    isPremium?: boolean;
  },
  ipAddress?: string,
  userAgent?: string
) {
  try {
    const [updatedPrompt] = await db
      .update(prompts)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(prompts.id, promptId))
      .returning({
        id: prompts.id,
        title: prompts.title,
        isPublished: prompts.isPublished,
        isPremium: prompts.isPremium,
      });

    if (!updatedPrompt) {
      throw new AppError(404, 'PROMPT_NOT_FOUND', 'Prompt not found');
    }

    // 记录管理员操作日志
    await logAdminAction({
      adminId,
      action: 'update_prompt',
      targetType: 'prompt',
      targetId: promptId,
      details: data,
      ipAddress,
      userAgent,
    });

    return updatedPrompt;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    console.error('更新提示词失败:', error);
    throw new AppError(500, 'DATABASE_ERROR', '更新提示词失败');
  }
}

/**
 * 删除提示词（管理员操作）
 */
export async function deletePrompt(
  adminId: string,
  promptId: string,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    // 软删除 - 设置 deletedAt
    await db
      .update(prompts)
      .set({
        deletedAt: new Date(),
        isPublished: false,
      })
      .where(eq(prompts.id, promptId));

    // 记录管理员操作日志
    await logAdminAction({
      adminId,
      action: 'delete_prompt',
      targetType: 'prompt',
      targetId: promptId,
      details: { message: 'Prompt soft deleted' },
      ipAddress,
      userAgent,
    });

    return { message: 'Prompt deleted successfully' };
  } catch (error) {
    console.error('删除提示词失败:', error);
    throw new AppError(500, 'DATABASE_ERROR', '删除提示词失败');
  }
}

/**
 * 记录管理员操作日志
 */
async function logAdminAction(data: {
  adminId: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    await db.insert(adminActionLogs).values({
      adminId: data.adminId,
      action: data.action,
      targetType: data.targetType || null,
      targetId: data.targetId || null,
      details: data.details || null,
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
    });
  } catch (error) {
    console.error('记录管理员操作日志失败:', error);
    // 不抛出错误，避免影响主要操作
  }
}

/**
 * 获取管理员操作日志
 */
export async function getAdminLogs(params: {
  page?: number;
  limit?: number;
  adminId?: string;
  action?: string;
}) {
  try {
    const page = params.page || 1;
    const limit = params.limit || 50;
    const offset = (page - 1) * limit;

    const conditions = [];
    
    if (params.adminId) {
      conditions.push(eq(adminActionLogs.adminId, params.adminId));
    }

    if (params.action) {
      conditions.push(eq(adminActionLogs.action, params.action));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const logs = await db
      .select({
        id: adminActionLogs.id,
        action: adminActionLogs.action,
        targetType: adminActionLogs.targetType,
        targetId: adminActionLogs.targetId,
        details: adminActionLogs.details,
        ipAddress: adminActionLogs.ipAddress,
        createdAt: adminActionLogs.createdAt,
        adminUsername: users.username,
      })
      .from(adminActionLogs)
      .leftJoin(users, eq(adminActionLogs.adminId, users.id))
      .where(whereClause)
      .orderBy(desc(adminActionLogs.createdAt))
      .limit(limit)
      .offset(offset);

    const [totalResult] = await db
      .select({ count: count() })
      .from(adminActionLogs)
      .where(whereClause);

    const total = totalResult.count;
    const totalPages = Math.ceil(total / limit);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.error('获取管理员日志失败:', error);
    throw new AppError(500, 'DATABASE_ERROR', '获取管理员日志失败');
  }
}

