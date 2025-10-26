import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db, users } from '../db/index.js';
import { eq, and, sql } from 'drizzle-orm';
import { AppError } from '../middleware/errorHandler.js';

const SALT_ROUNDS = 12;

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * 用户注册服务
 * 创建新用户账户,密码使用bcrypt加密
 */
export async function register(data: RegisterData) {
  // 检查用户名是否已存在
  const existingUsername = await db.query.users.findFirst({
    where: eq(users.username, data.username),
  });

  if (existingUsername) {
    throw new AppError(409, 'USERNAME_EXISTS', 'Username is already taken');
  }

  // 检查邮箱是否已存在
  const existingEmail = await db.query.users.findFirst({
    where: eq(users.email, data.email),
  });

  if (existingEmail) {
    throw new AppError(409, 'EMAIL_EXISTS', 'Email is already registered');
  }

  // 加密密码
  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  // 创建用户
  const [newUser] = await db
    .insert(users)
    .values({
      username: data.username,
      email: data.email,
      passwordHash,
    })
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
      subscriptionTier: users.subscriptionTier,
      createdAt: users.createdAt,
    });

  // 生成JWT tokens
  const tokens = generateTokens(newUser.id, newUser.email, newUser.subscriptionTier);

  return {
    user: newUser,
    ...tokens,
  };
}

/**
 * 用户登录服务
 * 验证用户凭据并返回JWT tokens
 */
export async function login(data: LoginData) {
  // 查找用户
  const user = await db.query.users.findFirst({
    where: eq(users.email, data.email),
  });

  if (!user) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  // 验证密码
  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  // 生成JWT tokens
  const tokens = generateTokens(user.id, user.email, user.subscriptionTier);

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      subscriptionTier: user.subscriptionTier,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
    },
    ...tokens,
  };
}

/**
 * 刷新访问令牌
 * 使用refresh token获取新的access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
  
  if (!JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET is not configured');
  }

  try {
    // 验证refresh token
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
      sub: string;
      email: string;
      subscription: string;
    };

    // 生成新的access token
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const accessToken = jwt.sign(
      {
        sub: payload.sub,
        email: payload.email,
        subscription: payload.subscription,
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    return { accessToken };
  } catch (error) {
    throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Invalid or expired refresh token');
  }
}

/**
 * 生成JWT token对
 * Access token: 15分钟过期
 * Refresh token: 7天过期
 */
function generateTokens(userId: string, email: string, subscription: string): TokenPair {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

  if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('JWT secrets are not configured');
  }

  const accessToken = jwt.sign(
    {
      sub: userId,
      email,
      subscription,
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    {
      sub: userId,
      email,
      subscription,
      tokenType: 'refresh',
    },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

/**
 * 更新用户资料
 */
export async function updateProfile(userId: string, data: {
  username?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
}) {
  try {
    // 检查用户名是否已被其他用户使用
    if (data.username) {
      const existingUsername = await db.query.users.findFirst({
        where: and(eq(users.username, data.username), sql`${users.id} != ${userId}`),
      });

      if (existingUsername) {
        throw new AppError(409, 'USERNAME_EXISTS', 'Username is already taken');
      }
    }

    // 检查邮箱是否已被其他用户使用
    if (data.email) {
      const existingEmail = await db.query.users.findFirst({
        where: and(eq(users.email, data.email), sql`${users.id} != ${userId}`),
      });

      if (existingEmail) {
        throw new AppError(409, 'EMAIL_EXISTS', 'Email is already registered');
      }
    }

    // 更新用户资料
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
        bio: users.bio,
        avatarUrl: users.avatarUrl,
        subscriptionTier: users.subscriptionTier,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return updatedUser;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    console.error('更新用户资料失败:', error);
    throw new AppError(500, 'DATABASE_ERROR', '更新用户资料失败');
  }
}

/**
 * 更改用户密码
 */
export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  try {
    // 查找用户
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
    }

    // 验证当前密码
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new AppError(400, 'INVALID_PASSWORD', 'Current password is incorrect');
    }

    // 加密新密码
    const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // 更新密码
    await db
      .update(users)
      .set({
        passwordHash: newPasswordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return { message: 'Password changed successfully' };
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    console.error('更改密码失败:', error);
    throw new AppError(500, 'DATABASE_ERROR', '更改密码失败');
  }
}

