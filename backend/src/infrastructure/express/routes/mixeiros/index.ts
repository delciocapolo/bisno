import { Router } from "express";
import { createMixeiroHandler } from "./handlers/create-mixeiro-handler.js";
import { listMixeiroHandler } from "./handlers/list-mixeiro-handler.js";
import { getMixeiroHandler } from "./handlers/get-mixeiro-handler.js";

const mixeiroRoutes = Router();

mixeiroRoutes.get("/", listMixeiroHandler);
mixeiroRoutes.get("/mixeiro", getMixeiroHandler);
mixeiroRoutes.post("/create", createMixeiroHandler);

export { mixeiroRoutes };
