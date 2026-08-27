import Logger from "@src/infrastructure/pino/logger.js";
import type { Channel, ChannelWrapper } from "amqp-connection-manager";
import type { ExchangeKey } from "../exchanges.js";
import { EXCHANGES } from "../exchanges.js";
import rabbitConnection from "../connection.js";

const eventPublisherLogger = Logger.publishTo({
  context: "amqp-event-publisher",
});

interface AmqpEventPublishArgs {
  exchange?: ExchangeKey;
  routingKey: string; // ex: "bisno.order.created"
  payload: unknown;
}

class AmqpEventPublisher {
  private channelWrapper: ChannelWrapper | null = null;

  private async bootstrap(): Promise<ChannelWrapper> {
    if (this.channelWrapper) return this.channelWrapper;

    if (!rabbitConnection.connection) {
      await rabbitConnection.connect();
    }

    const connection = rabbitConnection.connection;

    if (!connection) {
      throw new Error("RabbitMQ connection not available");
    }

    this.channelWrapper = connection.createChannel({
      json: true,
      setup: async (channel: Channel) => {
        await Promise.all(
          Object.values(EXCHANGES).map((ex) =>
            channel.assertExchange(ex.name, ex.type, { durable: true }),
          ),
        );
      },
    });

    return this.channelWrapper;
  }

  async publish({
    exchange = "topic",
    routingKey,
    payload,
  }: AmqpEventPublishArgs): Promise<void> {
    const channelWrapper = await this.bootstrap();
    const exchangeName = EXCHANGES[exchange].name;

    try {
      await channelWrapper.publish(exchangeName, routingKey, payload);
      eventPublisherLogger.info(
        { payload, routingKey, exchange: exchangeName },
        `Payload sent to ${routingKey}`,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      eventPublisherLogger.error(
        { payload, routingKey, exchange: exchangeName, error: message },
        `Failed to publish to ${routingKey}`,
      );
      throw error;
    }
  }
}

const publisher = new AmqpEventPublisher();

export {
  publisher,
  eventPublisherLogger,
  AmqpEventPublishArgs,
  AmqpEventPublisher,
};
