import { authMiddleware, isAdmin } from "@/middlewares/auth.middleware.js";
import { Router } from "express";
import { createSubscription, deleteSubscriptionForUser, getSubscriptionForUser, updateSubscriptionForUser } from "./subscription.controller.js";
import { validate } from "@/middlewares/zod.middleware.js";
import { createSub, updateSub } from "./subscription.validator.js";

export const subscriptionRouter = Router();

subscriptionRouter.post(
  "/create-subscription",
  authMiddleware,
  isAdmin,
  validate(createSub),
  createSubscription,
);

subscriptionRouter.get(
  "/get-subscription",
  authMiddleware,
  isAdmin,
  getSubscriptionForUser,
);

subscriptionRouter.put(
  "/update-subscription",
  authMiddleware,
  isAdmin,
  validate(updateSub),
  updateSubscriptionForUser,
);

subscriptionRouter.delete(
  "/delete-subscription",
  authMiddleware,
  isAdmin,
  deleteSubscriptionForUser,
);
