import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "node:http";
import { setupSwagger } from "../swagger/setup.js";
import { userRoutes } from "./routes/users/index.js";
import { healthRoutes } from "./routes/health/index.js";
import { bisnoRoutes } from "./routes/bisnos/index.js";
import Logger from "../pino/logger.js";
import { mixeiroRoutes } from "./routes/mixeiros/index.js";
import { mixeiroSubscriptionRoutes } from "./routes/mixeiros-subscription/index.js";
import { serviceRoutes } from "./routes/services/index.js";
import { categoryServiceRoutes } from "./routes/category-service/index.js";
import { zonesRoutes } from "./routes/zones/index.js";
import { verificationCodeRoutes } from "./routes/verification-code/index.js";

const app = express();
const server = createServer(app);
const serverLogger = Logger.publishTo({ context: "server" });

app.use(cors());
app.use(helmet());
app.use(express.json());

// routes
setupSwagger(app);
app.use("/api/users", userRoutes);
app.use("/api/bisnos", bisnoRoutes);
app.use("/api/mixeiros", mixeiroRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/zones", zonesRoutes);
app.use("/api/category-services", categoryServiceRoutes);
app.use("/api/mixeiro-subscriptions", mixeiroSubscriptionRoutes);
app.use("/api/verification-code", verificationCodeRoutes);
app.use("/api/health", healthRoutes);

export { server, serverLogger };
