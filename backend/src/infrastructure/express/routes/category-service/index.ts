import { Router } from "express";
import { listCategoryServicesHandler } from "./handlers/list-category-service-handler";
import { getCategoryServicesHandler } from "./handlers/get-category-service-handler";

const categoryServiceRoutes = Router();

categoryServiceRoutes.get("/", listCategoryServicesHandler);
categoryServiceRoutes.get("/:categoryId", getCategoryServicesHandler);

export { categoryServiceRoutes };
