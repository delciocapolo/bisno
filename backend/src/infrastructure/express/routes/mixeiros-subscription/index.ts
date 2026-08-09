import { Router } from "express";
import { createMixeiroSubscriptionHandler } from "./handlers/create-mixeiro-subscription-handler";

const mixeiroSubscriptionRoutes = Router();

mixeiroSubscriptionRoutes.post("/create", createMixeiroSubscriptionHandler);

export { mixeiroSubscriptionRoutes };
