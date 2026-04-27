import { jwtSecret, jwtExpiry } from "@/env/env.import.js";
import { errorHandler } from "@/utils/errorHandler.util.js";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthModel } from "@/moduels/auth/auth.models.js";

interface jwtPayload {
  id: string;
  role: string;
  email: string;
  username: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorHandler(res, 401, false, "Unauthorized", {});
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return errorHandler(res, 401, false, "Unauthorized", {});
    }

    const decode = jwt.verify(token, jwtSecret) as jwtPayload;

    const user = await AuthModel.findById(decode.id)
      .select("_id role email username")
      .lean();

    if (!user) {
      return errorHandler(res, 404, false, "Unauthorized Access", {});
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      username: user.username,
    };

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return errorHandler(res, 401, false, "Token expired", {});
    }
    return errorHandler(res, 401, false, "Invalid token", {});
  }
};

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    return errorHandler(res, 403, false, "Access denied. Admins only.", {});
  }
  next();
};