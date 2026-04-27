// src/types/express.d.ts

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "user" | "admin";
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