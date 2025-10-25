import { db } from '../db/index.js';
import { prompts, structuredPrompts, favorites, users } from '../db/schema.js';
import { eq, and, desc, asc, sql, isNull } from 'drizzle-orm';
import { AppError } from '../middleware/errorHandler.js';

/**
 * 创建新提示词
 */
export async function createPrompt(data: {
  title: string;
  description?: string;
  promptText: string;
  model: string;
  category?: string;
  style?: string;
  tags?: string[];
  previewImageUrl?: string;
  authorId: string;
  isPremium?: boolean;
  isPublished?: boolean;
  structured?: {
    subject?: string;
    action?: string;
    setting?: string;
    shotType?: string;
    lighting?: string;
    composition?: string;
    mood?: string[];
    parameters?: Record<string, any>;
  };
}) {
  try {
    // 插入提示词
    const [prompt] = await db
      .insert(prompts)
      .values({
        title: data.title,
        description: data.description,
        promptText: data.promptText,
        model: data.model,
        category: data.category,
        style: data.style,
        tags: data.tags || [],
        previewImageUrl: data.previewImageUrl,
        authorId: data.authorId,
        isPremium: data.isPremium ?? false,
        isPublished: data.isPublished ?? true,
      })
      .returning();

    // 如果有结构化数据,插入到 structured_prompts 表
    if (data.structured && prompt) {
      await db.insert(structuredPrompts).values({
        promptId: prompt.id,
        subject: data.structured.subject,
        action: data.structured.action,
        setting: data.structured.setting,
        shotType: data.structured.shotType,
        lighting: data.structured.lighting,
        composition: data.structured.composition,
        mood: data.structured.mood || [],
        parameters: data.structured.parameters,
      });
    }

    return prompt;
  } catch (error: any) {
    console.error('创建提示词失败:', error);
    throw new AppError(500, 'DATABASE_ERROR', '创建提示词失败');
  }
}

/**
 * 查询提示词列表（带分页和过滤）
 */
export async function getPrompts(filters: {
  page: number;
  limit: number;
  model?: string;
  category?: string;
  style?: string;
  tags?: string[];
  search?: string;
  isPremium?: boolean;
  authorId?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}) {
  try {
    const offset = (filters.page - 1) * filters.limit;
    const conditions: any[] = [isNull(prompts.deletedAt), eq(prompts.isPublished, true)];

    // 应用过滤条件
    if (filters.model) {
      conditions.push(eq(prompts.model, filters.model));
    }
    if (filters.category) {
      conditions.push(eq(prompts.category, filters.category));
    }
    if (filters.style) {
      conditions.push(eq(prompts.style, filters.style));
    }
    if (filters.isPremium !== undefined) {
      conditions.push(eq(prompts.isPremium, filters.isPremium));
    }
    if (filters.authorId) {
      conditions.push(eq(prompts.authorId, filters.authorId));
    }
    if (filters.search) {
      conditions.push(
        sql`(${prompts.title} ILIKE ${`%${filters.search}%`} OR ${prompts.description} ILIKE ${`%${filters.search}%`})`
      );
    }
    if (filters.tags && filters.tags.length > 0) {
      conditions.push(sql`${prompts.tags} && ARRAY[${sql.join(
        filters.tags.map((tag) => sql`${tag}`),
        sql`, `
      )}]::text[]`);
    }

    // 排序
    let orderBy;
    
    // 根据排序字段选择对应的列
    switch (filters.sortBy) {
      case 'title':
        orderBy = filters.sortOrder === 'desc' ? desc(prompts.title) : asc(prompts.title);
        break;
      case 'viewsCount':
        orderBy = filters.sortOrder === 'desc' ? desc(prompts.viewsCount) : asc(prompts.viewsCount);
        break;
      case 'favoritesCount':
        orderBy = filters.sortOrder === 'desc' ? desc(prompts.favoritesCount) : asc(prompts.favoritesCount);
        break;
      case 'updatedAt':
        orderBy = filters.sortOrder === 'desc' ? desc(prompts.updatedAt) : asc(prompts.updatedAt);
        break;
      case 'createdAt':
      default:
        orderBy = filters.sortOrder === 'desc' ? desc(prompts.createdAt) : asc(prompts.createdAt);
        break;
    }

    // 查询提示词列表
    const promptsList = await db
      .select({
        id: prompts.id,
        title: prompts.title,
        description: prompts.description,
        promptText: prompts.promptText,
        model: prompts.model,
        category: prompts.category,
        style: prompts.style,
        tags: prompts.tags,
        previewImageUrl: prompts.previewImageUrl,
        authorId: prompts.authorId,
        isPremium: prompts.isPremium,
        isPublished: prompts.isPublished,
        viewsCount: prompts.viewsCount,
        favoritesCount: prompts.favoritesCount,
        createdAt: prompts.createdAt,
        updatedAt: prompts.updatedAt,
        // 关联作者信息
        author: {
          id: users.id,
          username: users.username,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(prompts)
      .leftJoin(users, eq(prompts.authorId, users.id))
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(filters.limit)
      .offset(offset);

    // 查询总数
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(prompts)
      .where(and(...conditions));

    return {
      data: promptsList,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: count,
        totalPages: Math.ceil(count / filters.limit),
      },
    };
  } catch (error: any) {
    console.error('查询提示词列表失败:', error);
    throw new AppError(500, 'DATABASE_ERROR', '查询提示词列表失败');
  }
}

/**
 * 根据ID获取单个提示词详情
 */
export async function getPromptById(promptId: string, userId?: string) {
  try {
    // 增加浏览次数
    await db
      .update(prompts)
      .set({ viewsCount: sql`${prompts.viewsCount} + 1` })
      .where(eq(prompts.id, promptId));

    // 查询提示词详情
    const [prompt] = await db
      .select({
        id: prompts.id,
        title: prompts.title,
        description: prompts.description,
        promptText: prompts.promptText,
        model: prompts.model,
        category: prompts.category,
        style: prompts.style,
        tags: prompts.tags,
        previewImageUrl: prompts.previewImageUrl,
        authorId: prompts.authorId,
        isPremium: prompts.isPremium,
        isPublished: prompts.isPublished,
        viewsCount: prompts.viewsCount,
        favoritesCount: prompts.favoritesCount,
        createdAt: prompts.createdAt,
        updatedAt: prompts.updatedAt,
        // 关联作者信息
        author: {
          id: users.id,
          username: users.username,
          avatarUrl: users.avatarUrl,
          bio: users.bio,
        },
      })
      .from(prompts)
      .leftJoin(users, eq(prompts.authorId, users.id))
      .where(and(eq(prompts.id, promptId), isNull(prompts.deletedAt)));

    if (!prompt) {
      throw new AppError(404, 'PROMPT_NOT_FOUND', '提示词不存在');
    }

    // 查询结构化数据
    const [structured] = await db
      .select()
      .from(structuredPrompts)
      .where(eq(structuredPrompts.promptId, promptId))
      .limit(1);

    // 检查当前用户是否收藏了这个提示词
    let isFavorited = false;
    if (userId) {
      const [favorite] = await db
        .select()
        .from(favorites)
        .where(and(eq(favorites.promptId, promptId), eq(favorites.userId, userId)))
        .limit(1);
      isFavorited = !!favorite;
    }

    return {
      ...prompt,
      structured: structured || null,
      isFavorited,
    };
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    console.error('查询提示词详情失败:', error);
    throw new AppError(500, 'DATABASE_ERROR', '查询提示词详情失败');
  }
}

/**
 * 更新提示词
 */
export async function updatePrompt(
  promptId: string,
  authorId: string,
  data: Partial<{
    title: string;
    description: string;
    promptText: string;
    model: string;
    category: string;
    style: string;
    tags: string[];
    previewImageUrl: string;
    isPremium: boolean;
    isPublished: boolean;
    structured: any;
  }>
) {
  try {
    // 检查提示词是否存在且属于当前用户
    const [existing] = await db
      .select()
      .from(prompts)
      .where(and(eq(prompts.id, promptId), eq(prompts.authorId, authorId), isNull(prompts.deletedAt)));

    if (!existing) {
      throw new AppError(404, 'PROMPT_NOT_FOUND', '提示词不存在或无权限');
    }

    // 提取结构化数据
    const { structured, ...promptData } = data;

    // 更新提示词
    const [updated] = await db
      .update(prompts)
      .set({
        ...promptData,
        updatedAt: new Date(),
      })
      .where(eq(prompts.id, promptId))
      .returning();

    // 更新结构化数据
    if (structured) {
      const [existingStructured] = await db
        .select()
        .from(structuredPrompts)
        .where(eq(structuredPrompts.promptId, promptId))
        .limit(1);

      if (existingStructured) {
        await db
          .update(structuredPrompts)
          .set(structured)
          .where(eq(structuredPrompts.promptId, promptId));
      } else {
        await db.insert(structuredPrompts).values({
          promptId,
          ...structured,
        });
      }
    }

    return updated;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    console.error('更新提示词失败:', error);
    throw new AppError(500, 'DATABASE_ERROR', '更新提示词失败');
  }
}

/**
 * 删除提示词（软删除）
 */
export async function deletePrompt(promptId: string, authorId: string) {
  try {
    // 检查提示词是否存在且属于当前用户
    const [existing] = await db
      .select()
      .from(prompts)
      .where(and(eq(prompts.id, promptId), eq(prompts.authorId, authorId), isNull(prompts.deletedAt)));

    if (!existing) {
      throw new AppError(404, 'PROMPT_NOT_FOUND', '提示词不存在或无权限');
    }

    // 软删除
    await db
      .update(prompts)
      .set({
        deletedAt: new Date(),
        isPublished: false,
      })
      .where(eq(prompts.id, promptId));

    return { message: '提示词已删除' };
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    console.error('删除提示词失败:', error);
    throw new AppError(500, 'DATABASE_ERROR', '删除提示词失败');
  }
}

/**
 * 添加/取消收藏
 */
export async function toggleFavorite(promptId: string, userId: string) {
  try {
    // 检查提示词是否存在
    const [prompt] = await db.select().from(prompts).where(eq(prompts.id, promptId)).limit(1);

    if (!prompt) {
      throw new AppError(404, 'PROMPT_NOT_FOUND', '提示词不存在');
    }

    // 检查是否已收藏
    const [existing] = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.promptId, promptId), eq(favorites.userId, userId)))
      .limit(1);

    if (existing) {
      // 取消收藏
      await db.delete(favorites).where(and(eq(favorites.promptId, promptId), eq(favorites.userId, userId)));

      // 减少收藏数
      await db
        .update(prompts)
        .set({ favoritesCount: sql`${prompts.favoritesCount} - 1` })
        .where(eq(prompts.id, promptId));

      return { isFavorited: false, message: '已取消收藏' };
    } else {
      // 添加收藏
      await db.insert(favorites).values({
        promptId,
        userId,
      });

      // 增加收藏数
      await db
        .update(prompts)
        .set({ favoritesCount: sql`${prompts.favoritesCount} + 1` })
        .where(eq(prompts.id, promptId));

      return { isFavorited: true, message: '已添加收藏' };
    }
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    console.error('收藏操作失败:', error);
    throw new AppError(500, 'DATABASE_ERROR', '收藏操作失败');
  }
}

/**
 * 获取用户收藏的提示词列表
 */
export async function getUserFavorites(userId: string, page: number = 1, limit: number = 12) {
  try {
    const offset = (page - 1) * limit;

    // 查询收藏列表
    const favoritesList = await db
      .select({
        id: prompts.id,
        title: prompts.title,
        description: prompts.description,
        promptText: prompts.promptText,
        model: prompts.model,
        category: prompts.category,
        style: prompts.style,
        tags: prompts.tags,
        previewImageUrl: prompts.previewImageUrl,
        authorId: prompts.authorId,
        isPremium: prompts.isPremium,
        viewsCount: prompts.viewsCount,
        favoritesCount: prompts.favoritesCount,
        createdAt: prompts.createdAt,
        favoritedAt: favorites.createdAt,
        author: {
          id: users.id,
          username: users.username,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(favorites)
      .innerJoin(prompts, eq(favorites.promptId, prompts.id))
      .leftJoin(users, eq(prompts.authorId, users.id))
      .where(and(eq(favorites.userId, userId), isNull(prompts.deletedAt)))
      .orderBy(desc(favorites.createdAt))
      .limit(limit)
      .offset(offset);

    // 查询总数
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(favorites)
      .innerJoin(prompts, eq(favorites.promptId, prompts.id))
      .where(and(eq(favorites.userId, userId), isNull(prompts.deletedAt)));

    return {
      data: favoritesList,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  } catch (error: any) {
    console.error('查询收藏列表失败:', error);
    throw new AppError(500, 'DATABASE_ERROR', '查询收藏列表失败');
  }
}

