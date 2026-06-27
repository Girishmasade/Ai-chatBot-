import { Router } from "express";
import { authRouter } from "../moduels/auth/auth.route.js";
import { otpRouter } from "../moduels/otp/otp.route.js";
import { userRouter } from "@/moduels/user/user.route.js";
import { adminRouter } from "@/moduels/admin/admin.route.js";
import { subscriptionRouter } from "@/moduels/subscription/subscription.route.js";
import { providerRouter } from "@/moduels/Provider/providder-config.route.js";
import { serviceConfigRoute } from "@/moduels/service-config/service-config.route.js";
import { tokenPackageRoute } from "@/moduels/token/token.route.js";
import { adminTransactionRouter, userTransactionRouter } from "@/moduels/token/tokenTransaction/tokenTransaction.route.js";
import { adminWalletRouter, userWalletRouter } from "@/moduels/token/tokenWallet/tokenWallet.route.js";
import { aiRequestRouter } from "@/moduels/AIRequest/aiRequest.route.js";

export const RouterFile = Router()

RouterFile.use("/auth", authRouter)
RouterFile.use("/otp", otpRouter)
RouterFile.use("/user", userRouter)
RouterFile.use("/admin", adminRouter)
RouterFile.use("/service", serviceConfigRoute)
RouterFile.use("/subscription", subscriptionRouter)
RouterFile.use("/:service/provider", providerRouter)
RouterFile.use("/token-package", tokenPackageRoute)
RouterFile.use("/token-transaction", userTransactionRouter)
RouterFile.use("/admin/token-transaction", adminTransactionRouter)
RouterFile.use("/token-wallet", userWalletRouter)
RouterFile.use("/admin/token-wallet", adminWalletRouter)
RouterFile.use("/ai-request", aiRequestRouter)