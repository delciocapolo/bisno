import Logger from "@src/infrastructure/pino/logger.js";
import type { Channel, ChannelWrapper } from "amqp-connection-manager";
import type { ExchangeKey } from "../exchanges.js";
import { EXCHANGES } from "../exchanges.js";
import rabbitConnection from "../connection.js";

const eventConsumerLogger = Logger.publishTo({
  context: "amqp-event-consumer",
});

interface AmqpEventConsumerArgs<T = unknown> {
  exchange?: ExchangeKey;
  routingKey: string; // ex: "bisno.order.created", ou wildcard "bisno.order.*"
  queue: string;
  onMessage(payload: T): void | Promise<void>;
}

class AmqpEventConsumer {
  private channelWrappers: ChannelWrapper[] = [];

  constructor() {
    const shutdown = async () => {
      try {
        eventConsumerLogger.info({ message: "Closing consumers..." });
        await Promise.all(this.channelWrappers.map((cw) => cw.close()));
        eventConsumerLogger.info({ message: "All channels have been closed" });
        process.exit(0);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        eventConsumerLogger.error({
          error: message,
          message: "Error closing channels",
        });
        process.exit(1);
      }
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  }

  async consume<T = unknown>({
    exchange = "topic",
    routingKey,
    queue,
    onMessage,
  }: AmqpEventConsumerArgs<T>): Promise<void> {
    if (!rabbitConnection.connection) {
      await rabbitConnection.connect();
    }

    const connection = rabbitConnection.connection;
    if (!connection) {
      throw new Error("RabbitMQ connection not available");
    }

    const exchangeConfig = EXCHANGES[exchange];

    const channelWrapper = connection.createChannel({
      json: true,
      setup: async (channel: Channel) => {
        await channel.assertExchange(exchangeConfig.name, exchangeConfig.type, {
          durable: true,
        });

        const assertedQueue = await channel.assertQueue(queue, {
          durable: true,
          arguments: {
            "x-dead-letter-exchange": EXCHANGES.dlx.name,
          },
        });

        await channel.bindQueue(
          assertedQueue.queue,
          exchangeConfig.name,
          routingKey,
        );

        await channel.consume(assertedQueue.queue, async (msg) => {
          if (!msg) return;

          try {
            const payload = JSON.parse(msg.content.toString()) as T;
            eventConsumerLogger.info(
              { payload, queue, routingKey },
              `Message received in ${queue}`,
            );

            await onMessage(payload);
            channel.ack(msg);
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : String(error);
            eventConsumerLogger.error(
              { queue, routingKey, error: message },
              `Failed to process message from ${queue}`,
            );
            channel.nack(msg, false, false); // não recoloca na mesma queue — vai para a dlx
          }
        });

        eventConsumerLogger.info({ message: `Listening queue: ${queue}` });
      },
    });

    this.channelWrappers.push(channelWrapper);
  }
}

const consumer = new AmqpEventConsumer();

export {
  consumer,
  eventConsumerLogger,
  AmqpEventConsumerArgs,
  AmqpEventConsumer,
};
