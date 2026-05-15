import { AsyncHandler } from "@/utils/AsyncHandler.js";
import type { AuthUser } from "../auth/auth.payload.js";
import { errorHandler } from "@/utils/errorHandler.util.js";
import { successHandler } from "@/utils/successHandler.util.js";
import { subscriptionModel } from "./subscription.model.js";

export const viewAllAvilableSubscription = AsyncHandler(
    async (req, res, next) => {
        try {
            const userId = (req.user as AuthUser).id

            if (!userId) {
                return errorHandler(res, 404, false, "user id not found :", {})
            }

            const subscription = await subscriptionModel.find({ 
                $and: [
                    {user: userId},
                    {status: "active"},
                ]
             })

             console.log("subscription :", subscription)

            if (!subscription) {
                return errorHandler(res, 404, false, "subscription not found :", {})
            }

            return successHandler(res, 200, true, "subscription found :", { subscription })


        } catch (error) {
            console.error("Error to get the avilable subscription :", error);
            next(error)
        }
    }
)

export const createSubscription = AsyncHandler(
    async(req, res, next) => {
        try {
            const { plan, services, amount, currency, status, startDate, endDate, autoRenew, payuTxnId, payuSubId } = req.body
            
            const userId = (req.user as AuthUser).id

            if (!userId) {
                return errorHandler(res, 404, false, "user id not found :", {})
            }
            
            if (!plan || !services || !amount || !currency || !status || !startDate || !endDate || !autoRenew || !payuTxnId || !payuSubId) {
                return errorHandler(res, 404, false, "All the fields are required :", {})
            }

            const subscription = await subscriptionModel.create({
                user: userId,
                plan,
                services,
                amount,
                currency,
                status,
                startDate,
                endDate,
                autoRenew,
                payuTxnId,
                payuSubId
            })

            console.log("subscription :", subscription)

            return successHandler(res, 200, true, "subscription created successfully :", { subscription })

        } catch (error) {
            console.error("Error to create the subscription :", error);
            next(error)
        }
    }
)