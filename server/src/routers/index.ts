import { Router } from "express";
import { authRouter } from "../moduels/auth/auth.route.js";
import { otpRouter } from "../moduels/otp/otp.route.js";
import { userRouter } from "@/moduels/user/user.route.js";
import { adminRouter } from "@/moduels/admin/admin.route.js";
import { subscriptionRouter } from "@/moduels/subscription/subscription.route.js";
import { providerRouter } from "@/moduels/Provider/providder-config.route.js";
import { serviceConfigRoute } from "@/moduels/service-config/service-config.route.js";

export const RouterFile = Router()

RouterFile.use("/auth", authRouter)
RouterFile.use("/otp", otpRouter)
RouterFile.use("/user", userRouter)
RouterFile.use("/admin", adminRouter)
RouterFile.use("/service", serviceConfigRoute)
RouterFile.use("/subscription", subscriptionRouter)
RouterFile.use("/service/:service/provider", providerRouter)