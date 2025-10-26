import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
        subscriptionTier?: string;
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

