import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/index.js';
import { AppError } from './errorHandler.js';

interface JwtPayload {
  sub: string;
  email: string;
  subscription: 'free' | 'pro';
}

/**
 * JWT认证中间件
 * 验证请求头中的Bearer token并将用户信息附加到request对象
 */
export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    // 从Authorization头部获取token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'UNAUTHORIZED', 'Authentication token is required');
    }

    const token = authHeader.substring(7); // 移除 "Bearer " 前缀

    // 验证token
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // 将用户信息附加到request对象
    req.user = {
      id: payload.sub,
      email: payload.email,
      subscription: payload.subscription,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, 'INVALID_TOKEN', 'Invalid authentication token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError(401, 'TOKEN_EXPIRED', 'Authentication token has expired'));
    } else {
      next(error);
    }
  }
};

/**
 * 可选认证中间件
 * 如果提供了token则验证,但不强制要求
 */
export const optionalAuth = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const JWT_SECRET = process.env.JWT_SECRET;
      if (JWT_SECRET) {
        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.user = {
          id: payload.sub,
          email: payload.email,
          subscription: payload.subscription,
        };
      }
    }
    next();
  } catch (_error) {
    // 可选认证失败时不报错,继续执行
    next();
  }
};

