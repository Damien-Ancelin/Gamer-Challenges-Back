import { Request } from 'express';

// Add optionnal user property to the Request interface
  // user come from verified token
// This is useful to avoid TypeScript errors when accessing req.user in the middleware

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: Role;
        username: string;
        jti: string;
        ttlToken: number;
      };
    }
  }
}