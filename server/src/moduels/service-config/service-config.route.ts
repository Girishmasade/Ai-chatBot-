import { Router } from "express";
import { createServiceConfig, updateServiceConfig, getListOfServices, getSingleService, deleteService } from "./service-config.controller.js";
import { authMiddleware, isAdmin } from "@/middlewares/auth.middleware.js";

export const serviceConfigRoute = Router();

serviceConfigRoute.post(
  "/create-service",
  authMiddleware,
  isAdmin,
  createServiceConfig,
);

serviceConfigRoute.put(
  "/:serviceId",
  authMiddleware,
  isAdmin,
  updateServiceConfig
)

serviceConfigRoute.get(
  "/get-all-services",
  authMiddleware,
  isAdmin,
  getListOfServices
)

serviceConfigRoute.get(
  "/:serviceId",
  authMiddleware,
  isAdmin,
  getSingleService
)

serviceConfigRoute.delete(
  "/:serviceId",
  authMiddleware,
  isAdmin,
  deleteService
)