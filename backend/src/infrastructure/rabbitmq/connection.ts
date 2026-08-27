import env from "@src/config/env.js";
import Logger from "@src/infrastructure/pino/logger.js";
import type { AmqpConnectionManager } from "amqp-connection-manager";
import { connect } from "amqp-connection-manager";

const log = Logger.publishTo({ context: "amqp" });

class RabbitConnection {
  private static instance: RabbitConnection;
  public connection: AmqpConnectionManager | null = null;
  private readonly CONNECT_TIMEOUT_MS = 15000;

  private constructor() {
    const shutdown = async () => {
      await this.close();
      process.exit(0);
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  }

  public static getInstance(): RabbitConnection {
    if (!RabbitConnection.instance) {
      RabbitConnection.instance = new RabbitConnection();
    }
    return RabbitConnection.instance;
  }

  public async connect(): Promise<AmqpConnectionManager> {
    const connection = connect(env("RABBITMQ_URI"), {
      reconnectTimeInSeconds: 2,
    });

    connection.on("connect", ({ url }) => {
      log.info({ message: `Connected to RabbitMQ at ${url}` });
    });

    connection.on("disconnect", ({ err }) => {
      log.warn({ message: "Disconnected from RabbitMQ", error: err?.message });
    });

    connection.on("connectFailed", ({ err, url }) => {
      log.error({
        message: `Connection attempt to RabbitMQ failed at ${url}`,
        error: err?.message,
      });
    });

    connection.on("blocked", ({ reason }) => {
      log.warn({ message: "RabbitMQ connection blocked", reason });
    });

    try {
      await connection.connect({ timeout: this.CONNECT_TIMEOUT_MS });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      await connection.close().catch(() => {});
      throw new Error(
        `Failed to connect to RabbitMQ within ${this.CONNECT_TIMEOUT_MS}ms: ${message}`,
      );
    }

    this.connection = connection;
    return connection;
  }

  public async close(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
      log.info({ message: "RabbitMQ connection closed." });
    }
  }
}

const rabbitConnection = RabbitConnection.getInstance();

export default rabbitConnection;
