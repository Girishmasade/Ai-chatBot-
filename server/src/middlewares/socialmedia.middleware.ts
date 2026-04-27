import { jwtSecret } from "@/env/env.import.js";
import { AuthModel } from "@/moduels/auth/auth.models.js";
import { errorHandler } from "@/utils/errorHandler.util.js";
import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Types } from "mongoose";


export const socialMediaMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token;

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorHandler(res, 401, false, "Unauthorized", {});
    }

    token = authHeader.split(" ")[1];

    if (!token) {
      return errorHandler(res, 401, false, "Unauthorized", {});
    }

    const decode = jwt.verify(token, jwtSecret) as JwtPayload;

    const user = await AuthModel.findById(decode.id);

    if (!user) {
      return errorHandler(res, 404, false, "User not found", {});
    }

    req.user = {
      id: (user._id as Types.ObjectId).toString(),
      role: user.role,
      email: user.email,
      username: user.username,
      googleId: user.googleId,
      githubId: user.githubId,
      facebookId: user.facebookId,
    };

    next();
  } catch (error) {
    console.log("error to socialMediaMiddleware :", error);
    next(error);
  }
};
