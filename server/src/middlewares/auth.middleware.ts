import { jwtSecret, jwtExpiry} from "@/env/env.import.js";
import { errorHandler } from "@/utils/errorHandler.util.js";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { AuthModel } from "@/moduels/auth/auth.models.js";

export const authMiddleware = async(req:Request, res:Response, next:NextFunction) => {
    try {
        let token;

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return errorHandler(res, 401, false, "Unauthorized", {});
        }

        

    } catch (error) {
        
    }
}