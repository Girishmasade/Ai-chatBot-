// src/types/express.d.ts

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        email: string;
        username: string;
        googleId?: string;
        githubId?: string;
        facebookId?: string;
      };
    }
  }
}

export {};