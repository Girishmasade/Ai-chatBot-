import type { Request, Response, NextFunction } from "express";
import { AsyncHandler } from "@/utils/AsyncHandler.js";
import { successHandler } from "@/utils/successHandler.util.js";
import { errorHandler } from "@/utils/errorHandler.util.js";
import { AuthModel } from "../auth/auth.models.js";
import { ProviderApiKeyModel } from "../Provider-api-key/provider-api-key.model.js";
import { UserSubscriptionModel } from "../subscription/userSubscription.model.js";
import { emitAdminEntityUpdate, emitAdminLog } from "@/socket/socket.emitter.js";
import type { AuthUser } from "../auth/auth.payload.js";

// admin dashboard
export const adminDashboard = AsyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const totalUsers = await AuthModel.countDocuments();
  const activeSubscriptions = await UserSubscriptionModel.countDocuments({ status: "active" });
  const modelsCount = await ProviderApiKeyModel.countDocuments();
  
  console.log("admin dashboard stats fetched");

  successHandler(res, 200, true, "Dashboard stats fetched", {
    totalUsers,
    activeSubscriptions,
    modelsCount,
    revenue: 0
  });
});

// get admin profile
export const getAdminProfile = AsyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as AuthUser;
  successHandler(res, 200, true, "Admin profile fetched", { data: user });
});

// update admin profile
export const updateAdminProfile = AsyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as AuthUser;
  successHandler(res, 200, true, "Admin profile updated", { data: user });
});

// get users
export const getUsers = AsyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await AuthModel.find().lean();
  
  const mappedUsers = users.map(u => ({
    id: u._id.toString(),
    name: u.username,
    email: u.email,
    role: u.role,
    tier: "free",
    credits: 100,
    joined: u.createdAt,
    status: "active"
  }));

  successHandler(res, 200, true, "Users fetched", { data: mappedUsers });
});

// create user
export const createUser = AsyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await AuthModel.create(req.body);
  console.log("new admin user created : ", user);

  emitAdminEntityUpdate({ entityType: "user", action: "created", data: user });
  
  successHandler(res, 201, true, "User created", {data : user});
});

// update user
export const updateUser = AsyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await AuthModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
  if (user) {
    emitAdminEntityUpdate({ entityType: "user", action: "updated", data: user });
  }
  
  successHandler(res, 200, true, "User updated", { data: user });
});

// delete user
export const deleteUser = AsyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await AuthModel.findByIdAndDelete(req.params.id);
  
  emitAdminEntityUpdate({ entityType: "user", action: "deleted", data: { id: req.params.id } });
  
  successHandler(res, 200, true, "User deleted", {});
});

// get models
export const getModels = AsyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const models = await ProviderApiKeyModel.find().lean();
  
  const mappedModels = models.map(m => ({
    id: m._id.toString(),
    name: m.label,
    provider: m.provider,
    status: m.active ? "active" : "inactive"
  }));

  successHandler(res, 200, true, "Models fetched", { data: mappedModels });
});

// toggle model status
export const toggleModel = AsyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const model = await ProviderApiKeyModel.findById(req.params.id);
  
  if (!model) {
    return errorHandler(res, 404, false, "Model not found", {});
  }
  
  model.active = !model.active;
  await model.save();
  
  emitAdminEntityUpdate({ entityType: "model", action: "updated", data: model });
  
  successHandler(res, 200, true, "Model toggled", {data: model});
});

// get subscriptions
export const getSubscriptions = AsyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const subs = await UserSubscriptionModel.find().populate("user").lean();
  successHandler(res, 200, true, "Subscriptions fetched", { data: subs });
});

// get logs
export const getLogs = AsyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  successHandler(res, 200, true, "Logs fetched", { data: [] });
});

// global branding config
let brandingConfig = {
  appName: "GoChat AI",
  logoUrl: "",
  primaryColor: "#3B82F6",
  darkModeByDefault: true,
};

// get config
export const getConfig = AsyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  successHandler(res, 200, true, "Config fetched", { branding: brandingConfig, cookieConsents: [] });
});

// update branding
export const updateBranding = AsyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  brandingConfig = { ...brandingConfig, ...req.body };
  
  emitAdminEntityUpdate({ entityType: "config", action: "updated", data: brandingConfig });
  
  successHandler(res, 200, true, "Branding updated", brandingConfig);
});
