import { jwtAccessSecret} from "@/env/env.import.js";
import { errorHandler } from "@/utils/errorHandler.util.js";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthModel } from "@/moduels/auth/auth.models.js";
import { deleteRefreshToken, generateAccessToken, generateRefreshToken, keys, setTokenCookies, validateRefreshToken } from "@/utils/token.utils.js";
import redisClient from "@/config/redis.config.js";

interface jwtPayload {
  userId: string;
  role: string;
  email: string;
  username: string;
}

// it's used for refresh if token expired

const silentRefresh = async (
  req: Request,
  res: Response,
): Promise<{ payload: jwtPayload; newAccessToken: string } | null> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return null;

    const userId = await validateRefreshToken(refreshToken);
    if (!userId) return null;

    const user = await AuthModel.findById(userId)
      .select("_id role email username isBlocked")
      .lean();

    if (!user ) return null;

    // rotate tokens
    await deleteRefreshToken(refreshToken);
    const newAccessToken  = await generateAccessToken(user as any);
    const newRefreshToken = await generateRefreshToken(userId);

    //  new refresh token → cookie
    setTokenCookies(res, newRefreshToken);

    //  new access token → response header (frontend reads and stores it)
    res.setHeader("x-access-token", newAccessToken);

    return {
      payload: {
        userId: user._id.toString(),
        role: user.role,
        email: user.email,
        username: user.username,
      },
      newAccessToken,
    };
  } catch {
    return null;
  }
};


export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    //  No token → try silent refresh via cookie 
    if (!token) {
      const result = await silentRefresh(req, res);
      if (!result) return errorHandler(res, 401, false, "Unauthorized", {});

      req.user = {
        id: result.payload.userId,
        role: result.payload.role,
        email: result.payload.email,
        username: result.payload.username,
      };
      return next();
    }

    try {
      // verify JWT 
      const decoded = jwt.verify(token, jwtAccessSecret) as jwtPayload;

      // check Redis — not revoked 

      const storedToken = await redisClient.get(keys.accessToken(decoded.userId));
      if (!storedToken || storedToken !== token) {
        const result = await silentRefresh(req, res);
        if (!result) return errorHandler(res, 401, false, "Unauthorized", {});

        req.user = {
          id: result.payload.userId,
          role: result.payload.role,
          email: result.payload.email,
          username: result.payload.username,
        };
        return next();
      }

      // fetch user 
      const user = await AuthModel.findById(decoded.userId)
        .select("_id role email username isBlocked")
        .lean();

      if (!user) return errorHandler(res, 404, false, "User not found", {});
    
      req.user = {
        id: user._id.toString(),
        role: user.role,
        email: user.email,
        username: user.username,
      };

      return next();

    } catch (error: any) {
      // Access Token expired → silent refresh via cookie 
      if (error.name === "TokenExpiredError") {
        const result = await silentRefresh(req, res);

        if (!result) {
          return errorHandler(res, 401, false, "Session expired, please login again", {});
        }

        req.user = {
          id: result.payload.userId,
          role: result.payload.role,
          email: result.payload.email,
          username: result.payload.username,
        };
        return next();
      }

      return errorHandler(res, 401, false, "Invalid token", {});
    }

  } catch (error) {
    next(error);
  }
};
// only for admin

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return errorHandler(res, 403, false, "Access denied. Admins only.", {});
  }
  next();
};