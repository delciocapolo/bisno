import { getSafeInteger } from "../shared/utils/index";
import type { IEnvironment } from "../shared/@types/environment";

type IEnvironmentKeys = keyof IEnvironment;

const envDefault: Partial<IEnvironment> = {
  SERVER_PORT: getSafeInteger(process.env.SERVER_PORT) || 3333,
  SERVER_HOST: process.env.SERVER_HOST || "localhost",
  NODE_ENV: (process.env.NODE_ENV as IEnvironment["NODE_ENV"]) || "dev",
  TIMEZONE: process.env.TIMEZONE || "Africa/Luanda",
  RABBITMQ_URI: process.env.RABBITMQ_URI || "",
  DB_NAME: process.env.DB_NAME || "bisno",
  DB_DIALECT: process.env.DB_DIALECT || "postgres",
  DB_PORT: getSafeInteger(process.env.DB_PORT) || 5432,
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "root",
  EVOLUTION_SERVER_HOST: process.env.EVOLUTION_SERVER_HOST || "localhost",
  EVOLUTION_SERVER_URL:
    process.env.EVOLUTION_SERVER_URL || "http://localhost:8080",
};

function env(name: IEnvironmentKeys): string {
  const value = envDefault[name] || process.env[name];

  if (value === undefined || value === "" || value === null) {
    throw new Error(`Environment variable "${name}" is not defined.`);
  }

  return String(value);
}

env.parseInt = (name: IEnvironmentKeys): number => {
  const value = Number(env(name));

  if (isNaN(value)) {
    throw new Error(`Environment variable "${name}" is not a valid number.`);
  }

  return value;
};

env.optional = (name: IEnvironmentKeys): string | undefined => {
  const value = envDefault[name] || process.env[name];
  return value !== undefined ? String(value) : undefined;
};

env.bool = (name: IEnvironmentKeys): boolean => {
  return env(name).toLowerCase() === "true";
};

export default env;
