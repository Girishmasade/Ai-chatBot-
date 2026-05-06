import { authMiddleware, isAdmin } from "@/middlewares/auth.middleware.js";
import { Router } from "express";
import { adminDashboard, getAdminProfile, updateAdminProfile } from "./admin.controller.js";
import { upload } from "@/middlewares/multer.middleware.js";

export const adminRouter = Router()


// admin dashboard
adminRouter.get("/dashboard", authMiddleware, isAdmin, adminDashboard)

// admin profile
adminRouter.get("/profile", authMiddleware, isAdmin, getAdminProfile)

// admin update profile
adminRouter.put("/update-profile", authMiddleware, isAdmin, upload.single("avatar"), updateAdminProfile)
