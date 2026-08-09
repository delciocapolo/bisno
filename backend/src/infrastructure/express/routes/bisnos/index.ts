import { Router } from "express";
import { createBisnoHandler } from "./handlers/create-bisno-handler.js";
import { listBisnosHandler } from "./handlers/list-bisnos-handler.js";

const bisnoRoutes = Router();

bisnoRoutes.get("/", listBisnosHandler);
bisnoRoutes.post("/create", createBisnoHandler);

export { bisnoRoutes };
