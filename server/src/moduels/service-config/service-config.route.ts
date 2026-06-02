import { Router } from "express";
import {
  createServiceConfig,
  updateServiceConfig,
  getListOfServices,
  getSingleService,
  deleteService,
  toggleServiceStatus,
  toggleFallbackStatus,
  updateRateLimit,
} from "./service-config.controller.js";
import { authMiddleware, isAdmin } from "@/middlewares/auth.middleware.js";
import {
  createServiceSchema,
  toggleFallbackSchema,
  toggleServiceSchema,
  updateRateLimitSchema,
  updateServiceSchema,
} from "./service-config.validator.js";
import { validate } from "@/middlewares/zod.middleware.js";

export const serviceConfigRoute = Router();

// for only un auth users

serviceConfigRoute.use(authMiddleware, isAdmin);

// create service config

serviceConfigRoute.post(
  "/create-service",
  validate(createServiceSchema),
  createServiceConfig,
);

// update service config

serviceConfigRoute.patch(
  "/:serviceId",
  validate(updateServiceSchema),
  updateServiceConfig,
);

// get list of services

serviceConfigRoute.get("/get-all-services", getListOfServices);

// get single service

serviceConfigRoute.get("/:serviceId", getSingleService);

// toggle service status

serviceConfigRoute.patch(
  "/toggle-service/:serviceId",
  validate(toggleServiceSchema),
  toggleServiceStatus,
);

// toggle fallback status

serviceConfigRoute.patch(
  "/serviceId/fallback",
  validate(toggleFallbackSchema),
  toggleFallbackStatus,
);

// update rate limit

serviceConfigRoute.patch(
  "/serviceId/rate-limit",
  validate(updateRateLimitSchema),
  updateRateLimit,
);

// delete service config

serviceConfigRoute.delete(
  "/:serviceId", 
  deleteService
);
