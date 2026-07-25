import { authMiddleware, isAdmin } from "@/middlewares/auth.middleware.js";
import { Router } from "express";
import { 
  adminDashboard, getAdminProfile, updateAdminProfile,
  getUsers, createUser, updateUser, deleteUser,
  getModels, toggleModel,
  getSubscriptions,
  getLogs,
  getConfig, updateBranding
} from "./admin.controller.js";
import { upload } from "@/middlewares/multer.middleware.js";

export const adminRouter = Router();

adminRouter.use(authMiddleware, isAdmin);

// dashboard & profile
adminRouter.get("/dashboard", adminDashboard);
adminRouter.get("/profile", getAdminProfile);
adminRouter.put("/update-profile", upload.single("avatar"), updateAdminProfile);

// users management
adminRouter.get("/users", getUsers);
adminRouter.post("/users", createUser);
adminRouter.put("/users/:id", updateUser);
adminRouter.delete("/users/:id", deleteUser);

// ai models
adminRouter.get("/models", getModels);
adminRouter.put("/models/:id/toggle", toggleModel);

// subscriptions
adminRouter.get("/subscriptions", getSubscriptions);

// audit logs
adminRouter.get("/logs", getLogs);

// branding config
adminRouter.get("/config", getConfig);
adminRouter.put("/config/branding", updateBranding);
