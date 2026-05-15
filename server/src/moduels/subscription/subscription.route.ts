import { Router } from "express";
import { createSubscription } from "./subscription.controller.js";

export const subscriptionRouter = Router()

subscriptionRouter.post("/create-subscription", createSubscription)