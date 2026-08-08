import "dotenv/config";
import dbConnection from "./infrastructure/sequelize/connection";
import Logger from "./infrastructure/pino/logger";
import env from "./config/env";
import rabbitConnection from "./infrastructure/rabbit/connection";
import { server, serverLogger } from "./infrastructure/express/server";
import "@infrastructure/socketio/server";
import "@src/infrastructure/evolution-api/server";
import { registerConsumers } from "@src/infrastructure/rabbit/consumers/register-consumers";
import { registerSchedulers } from "./application/jobs/scheduler";

async function bootstrap() {
  await dbConnection.connect();
  await rabbitConnection.connect();
  await registerConsumers();
  await registerSchedulers();

  if (env("NODE_ENV") !== "production" && env("NODE_ENV") !== "prod") {
    process.on("unhandledRejection", (reason) => {
      Logger.error({ reason, message: "Unhandled Rejection" });
    });
  }

  server.listen(env("SERVER_PORT"), () =>
    serverLogger.info({
      port: env("SERVER_PORT"),
      host: env("SERVER_HOST"),
      message: `Server is running`,
    }),
  );
}

bootstrap().catch((error: unknown) => {
  if (error instanceof Error) {
    Logger.error({
      error: { name: error.name, message: error.message },
      message: "App initialization failed",
    });
  } else {
    Logger.error({ error, message: "App initialization failed" });
  }
  process.exit(1);
});
