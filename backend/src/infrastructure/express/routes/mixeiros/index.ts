import { Router } from "express";
import { createMixeiroHandler } from "./handlers/create-mixeiro-handler.js";
import { listMixeiroHandler } from "./handlers/list-mixeiro-handler.js";

const mixeiroRoutes = Router();

mixeiroRoutes.get("/", listMixeiroHandler);
mixeiroRoutes.post("/create", createMixeiroHandler);

export { mixeiroRoutes };
