import { Router } from "express";
import { listZonesHandler } from "./handlers/list-zones-handler";
import { getZoneHandler } from "./handlers/get-zone-handler";

const zonesRoutes = Router();

zonesRoutes.get("/", listZonesHandler);
zonesRoutes.get("/:zoneId", getZoneHandler);

export { zonesRoutes };
