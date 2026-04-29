import type { NextFunction, Request, Response } from "express";
import passport from "passport";
import { jwtSecret, jwtExpiry } from "../../env/env.import.js";
import jwt, { type SignOptions } from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  email?: string;
  username?: string;
  avatar?: string;
}


const generateToken = (user: any): string => {
  const payload: JwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    username: user.username,
    avatar: user.avatar,
  };

  const options: SignOptions = {
    expiresIn: jwtExpiry as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, jwtSecret as string, options);
};

const oauthCallback =
  (strategy: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      strategy,
      { failureRedirect: "/signin" },
      (err: any, user: any) => {
        if (err || !user) return res.redirect("/signin");

        const token = generateToken(user);

        return res.redirect(
          `${process.env.FRONTEND_URL}/oauth-success?token=${token}`,
        );
      },
    )(req, res, next);
  };

// ─── Google ──────────────────────────────────────────────────────────────────

export const googleLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })(req, res, next);
};

export const googleCallback = oauthCallback("google");

// ─── GitHub ──────────────────────────────────────────────────────────────────

export const githubLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate("github", {
    scope: ["user:email"],  // correct GitHub scope
  })(req, res, next);
};

export const githubCallback = oauthCallback("github");

// ─── Facebook ────────────────────────────────────────────────────────────────

export const facebookLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"],  // correct Facebook scopes, no prompt
  })(req, res, next);
};

export const facebookCallback = oauthCallback("facebook");