export interface IEnvironment {
  TIMEZONE: string;
  JWT_SECRET: string;
  SERVER_HOST: string;
  SERVER_PORT: number;
  NODE_ENV: "development" | "production";

  // Evolution
  EVOLUTION_SERVER_URL: string;
  EVOLUTION_SERVER_HOST: string;
  EVOLUTION_AUTHENTICATION_API_KEY: string;

  // RabbitMQ
  RABBITMQ_URI: string;

  // Database
  DB_NAME: string;
  DB_DIALECT: string;
  DB_PORT: number;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
}
