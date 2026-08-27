import env from "@src/config/env";
import { Sequelize } from "sequelize-typescript";
import Logger from "@src/infrastructure/pino/logger";
import * as models from "@infrastructure/sequelize/models/index";

const sequelizeLogger = Logger.publishTo({ context: "sequelize" });

class Database {
  private static instance: Sequelize;

  public static getInstance(): Sequelize {
    if (!Database.instance) {
      try {
        Database.instance = new Sequelize({
          dialect: "postgres",
          database: env("DB_NAME"),
          username: env("DB_USER"),
          password: env("DB_PASSWORD"),
          host: env("DB_HOST"),
          port: env.parseInt("DB_PORT"),
          logging: false,
          define: {
            underscored: true,
          },
          pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
          },
          models: models.allModels,
          // models: [path.resolve(__dirname, "models/**/*.model.ts")],
          // modelMatch: (filename, member) => {
          //   const normalize = (str: string) =>
          //     str.toLowerCase().replace(/[^a-z0-9]/g, "");
          //   const base = filename.substring(0, filename.indexOf(".model"));
          //   return normalize(base) === normalize(member);
          // },
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        sequelizeLogger.error(
          { error: message },
          "Error configuring Sequelize instance",
        );
        throw new Error("Database configuration error");
      }

      const shutdown = async () => {
        await Database.instance?.close();
        process.exit(0);
      };

      process.on("SIGINT", shutdown);
      process.on("SIGTERM", shutdown);
    }

    return Database.instance;
  }

  public static async connect(): Promise<void> {
    await Database.getInstance().authenticate();
    sequelizeLogger.info({ message: "Database connection established" });
  }
}

const dbConnection = Database;

export { sequelizeLogger };
export default dbConnection;
