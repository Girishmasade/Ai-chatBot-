import type { NextFunction, Request, Response } from "express";
import passport from "passport";
import {
  generateAccessToken,
  generateRefreshToken,
  setTokenCookies,
} from "../../utils/token.utils.js";

const oauthCallback =
  (strategy: string) => (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      strategy,
      { failureRedirect: "/signin" },
      async (err: any, user: any) => {
        if (err || !user) return res.redirect("/signin");

        const accessToken = await generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user._id.toString()) as string;

        // store both in HttpOnly cookies

        setTokenCookies(res, accessToken, refreshToken);

        return res.redirect(`${process.env.FRONTEND_URL}/oauth-success`);
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
    session: false
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
    scope: ["user:email"], // correct GitHub scope
    session: false
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
    scope: ["public_profile", "email"], // correct Facebook scopes, no prompt
    session: false
  })(req, res, next);
};

export const facebookCallback = oauthCallback("facebook");
