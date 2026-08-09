import { Router } from "express";
import { listServicesHandler } from "./handlers/list-service-handler";
import { getServicesHandler } from "./handlers/get-service-handler";

const serviceRoutes = Router();

serviceRoutes.get("/", listServicesHandler);
serviceRoutes.get("/:serviceId", getServicesHandler);

export { serviceRoutes };
