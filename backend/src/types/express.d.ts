import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        subscription: 'free' | 'pro';
        role: 'user' | 'admin';
      };
      subscription?: {
        tier: string;
        isPro: boolean;
        subscription: any;
      };
    }
  }
}

export {};

