import { Router } from "express";
import { listSubscriptionHandler } from "./handlers/list-subscription-handler";

const subscriptionRoutes = Router();

subscriptionRoutes.get("/", listSubscriptionHandler);

export { subscriptionRoutes };
