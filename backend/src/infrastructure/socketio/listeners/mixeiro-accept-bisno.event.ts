import { isDefined } from "@src/shared/utils";
import { publisher } from "@src/infrastructure/rabbit/adapters/amqp-event-publisher";
import type { IMessageUpsertEvent } from "@src/shared/events/evolution-events";
import { normalizeJid } from "@src/infrastructure/evolution-api/utils";
import { EVOLUTION_INSTANCE_NAMES } from "@src/infrastructure/evolution-api/instances/names";
import Logger from "@src/infrastructure/pino/logger";
import { Mixeiro } from "@src/infrastructure/sequelize/models/mixeiro.model";
import { Op } from "sequelize";
import { Lead } from "@src/infrastructure/sequelize/models/lead.model";

const messagesUpsertLogger = Logger.publishTo({
  context: "messages-upsert-event",
});

export async function mixeiroAcceptBisnoEvent(payload: IMessageUpsertEvent) {
  messagesUpsertLogger.info({ payload }, "Mixeiro's message received");

  const { data, instance } = payload;
  const messageText =
    data?.message?.conversation?.trim().toLowerCase() ||
    data?.message?.extendedTextMessage?.text?.trim().toLowerCase();

  if (
    data?.key?.fromMe === true ||
    instance !== EVOLUTION_INSTANCE_NAMES.mainInstance.name ||
    messageText !== "sim"
  ) {
    messagesUpsertLogger.debug("Message ignored debug:", {
      fromMe: data?.key?.fromMe,
      fromMeType: typeof data?.key?.fromMe,
      instance,
      instanceType: typeof instance,
      instanceLength: instance?.length,
      expected: EVOLUTION_INSTANCE_NAMES.mainInstance.name,
      expectedLength: EVOLUTION_INSTANCE_NAMES.mainInstance.name.length,
      instanceEquals: instance === EVOLUTION_INSTANCE_NAMES.mainInstance.name,
      messageText,
      messageTextType: typeof messageText,
      messageTextLength: messageText?.length,
      messageTextEquals: messageText === "sim",
      rawMessage: data?.message,
    });
    return;
  }

  const jidMixeiroMobile = normalizeJid(data?.key?.remoteJid);
  const lead = await Lead.findOne({
    where: { status: "sent" },
    include: [
      {
        model: Mixeiro,
        required: true,
        where: {
          mobile: { [Op.like]: `%${jidMixeiroMobile.withCode}%` },
        },
      },
    ],
    order: [["createdAt", "DESC"]],
    limit: 1,
  });

  if (!isDefined(lead)) {
    return messagesUpsertLogger.error(
      { data: data?.key },
      "Lead not found by mixeiro mobile",
    );
  }

  messagesUpsertLogger.debug({ lead }, "Lead found by mixeiro mobile");

  await lead.update({ respondedAt: new Date() });
  await publisher.publish({
    routingKey: "bisno.order.accepted",
    payload: {
      leadId: lead.id,
      bisnoId: lead.bisnoId,
      mixeiroId: lead.mixeiroId,
    },
  });
}
