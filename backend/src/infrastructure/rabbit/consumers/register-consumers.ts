import type { BisnoCreatedPayload } from "@src/shared/events/bisno-events.js";
import {
  consumer,
  eventConsumerLogger,
} from "../adapters/amqp-event-consumer.js";
import { publisher } from "../adapters/amqp-event-publisher.js";
import {
  createBisnoUseCase,
  createLeadUseCase,
  decrementSubscriptionPointUseCase,
  getBisnoUseCase,
  getLeadByBisnoIdUseCase,
  getLeadByIdUseCase,
  getMixeiroByIdUseCase,
  getNextEligibleMixeiroUseCase,
  getServiceUseCase,
  getSubscriptionByMixeiroIdUseCase,
  listMixeirosUseCase,
} from "@src/application/use-cases/composition.js";
import { isDefined } from "@src/shared/utils/index.js";
import {
  Lead,
  type LeadAttributes,
} from "@src/infrastructure/sequelize/models/lead.model.js";
import {
  Bisno,
  type BisnoAttributes,
} from "@src/infrastructure/sequelize/models/bisno.model.js";
import { Service } from "@src/infrastructure/sequelize/models/service.model.js";
import { Zone } from "@src/infrastructure/sequelize/models/zone.model.js";
import {
  sendTextMessageAboutBisno,
  sendTextMessageBisnoClosedToClient,
  sendTextMessageBisnoClosedToMixeiro,
} from "@src/infrastructure/evolution-api/http/send-text-message.js";
import { EVOLUTION_INSTANCE_NAMES } from "@src/infrastructure/evolution-api/instances/names.js";
import { Mixeiro } from "@src/infrastructure/sequelize/models/mixeiro.model.js";
import { MixeiroDecrementRules } from "@src/domain/enums/mixeiro-decrement.enum.js";

export async function registerConsumers(): Promise<void> {
  await consumer.consume<BisnoCreatedPayload>({
    routingKey: "bisno.order.created",
    queue: "bisno.order.created.queue",
    onMessage: async (payload) => {
      const bisno = await createBisnoUseCase.execute(payload);

      if (!isDefined(bisno)) {
        return eventConsumerLogger.error({ payload }, "Failed to create bisno");
      }

      await publisher.publish({
        routingKey: "bisno.distribution.start",
        payload: [bisno.get({ plain: true })],
      });
    },
  });

  await consumer.consume<BisnoAttributes[]>({
    routingKey: "bisno.distribution.start",
    queue: "bisno.distribution.start.queue",
    onMessage: async (payload) => {
      for (const bisno of payload) {
        const service = await getServiceUseCase.execute(bisno.serviceId);
        const mixeiro = await getNextEligibleMixeiroUseCase.execute({
          serviceId: bisno.serviceId,
          zoneId: bisno.zoneId,
        });

        if (isDefined(mixeiro)) {
          let lead = await getLeadByBisnoIdUseCase.execute(bisno.id);

          if (isDefined(lead)) {
            await lead.update({ mixeiroId: mixeiro.id, status: "sent" });
          } else {
            lead = await createLeadUseCase.execute({
              mixeiroId: mixeiro.id,
              bisnoId: bisno.id,
            });
          }

          if (isDefined(lead)) {
            await publisher.publish({
              routingKey: "bisno.notification.send",
              payload: [lead.get({ plain: true })],
            });

            await publisher.publish({
              routingKey: "bisno.mixeiro.locked",
              payload: [mixeiro.get({ plain: true })],
            });

            await mixeiro.update({ isLocked: true });
          }
        } else {
          eventConsumerLogger.error({ bisno }, "No eligible mixeiro found");

          const originalBisno = await getBisnoUseCase.execute(bisno.id);
          const nextRound = Number(originalBisno?.distributionRound || 0) + 1;

          await originalBisno?.update({ distributionRound: nextRound });

          if (nextRound >= MixeiroDecrementRules.DEFAULT) {
            const lead = await getLeadByBisnoIdUseCase.execute(bisno.id);
            await publisher.publish({
              routingKey: "bisno.order.exhausted",
              payload: isDefined(lead) ? [lead.get({ plain: true })] : [],
            });
          } else {
            const bisnoHandled = {
              ...bisno,
              categoryId: service?.categoryId,
            };
            await publisher.publish({
              routingKey: "bisno.distribution.reset",
              payload: [bisnoHandled],
            });
          }
        }
      }
    },
  });

  await consumer.consume<LeadAttributes[]>({
    routingKey: "bisno.notification.send",
    queue: "bisno.notification.send.queue",
    onMessage: async (payload) => {
      for (const lead of payload) {
        const leadFound = await getLeadByIdUseCase.execute(lead.id);
        const bisno = await Bisno.findByPk(lead.bisnoId, {
          include: [Service, Zone],
        });
        const mixeiro = await getMixeiroByIdUseCase.execute(lead?.mixeiroId);

        if (isDefined(leadFound) && isDefined(bisno) && isDefined(mixeiro)) {
          await sendTextMessageAboutBisno(
            mixeiro?.mobile,
            EVOLUTION_INSTANCE_NAMES.mainInstance.name,
            {
              zoneName: bisno?.zone?.name,
              description: bisno?.description,
              serviceName: bisno?.service?.name,
              mixeiroName: mixeiro?.customName || mixeiro?.fullName,
            },
          );
          await leadFound.update({ notifiedAt: new Date() });
          await publisher.publish({
            routingKey: "bisno.order.distributed",
            payload: [lead],
          });
        }
      }
    },
  });

  await consumer.consume<(BisnoAttributes & { categoryId: string })[]>({
    routingKey: "bisno.distribution.reset",
    queue: "bisno.distribution.reset.queue",
    onMessage: async (payload) => {
      for (const bisno of payload) {
        const current = await getBisnoUseCase.execute(bisno.id);

        if (
          (current?.distributionRound || 0) >= MixeiroDecrementRules.DEFAULT
        ) {
          const lead = await getLeadByBisnoIdUseCase.execute(bisno.id);
          await publisher.publish({
            routingKey: "bisno.order.exhausted",
            payload: isDefined(lead) ? [lead.get({ plain: true })] : [],
          });
          continue;
        }

        const mixeirosUnlocked = await listMixeirosUseCase.execute({
          where: {
            isLocked: false,
            zoneId: bisno.zoneId,
            categoryId: bisno.categoryId,
          },
        });
        const mixeirosLocked = await listMixeirosUseCase.execute({
          where: {
            isLocked: true,
            zoneId: bisno.zoneId,
            categoryId: bisno.categoryId,
          },
        });

        if (mixeirosLocked?.length >= mixeirosUnlocked?.length) {
          for (const mixeiro of mixeirosLocked) {
            await mixeiro.update({ isLocked: false });
          }
        }

        await publisher.publish({
          routingKey: "bisno.distribution.start",
          payload: [bisno],
        });
      }
    },
  });

  await consumer.consume<LeadAttributes[]>({
    routingKey: "bisno.order.distributed",
    queue: "bisno.order.distributed.queue",
    onMessage: async (payload) => {
      for (const lead of payload) {
        const bisno = await getBisnoUseCase.execute(lead.bisnoId);
        const leadFound = await getLeadByIdUseCase.execute(lead.id);

        if (!isDefined(bisno)) {
          return eventConsumerLogger.error(
            { lead },
            "Bisno not found for lead",
          );
        }

        await bisno.update({ status: "matched" });
        await leadFound?.update({ status: "sent" });
      }
    },
  });

  await consumer.consume<LeadAttributes[]>({
    routingKey: "bisno.notification.timeout",
    queue: "bisno.notification.timeout.queue",
    onMessage: async (payload) => {
      for (const lead of payload) {
        const bisno = await getBisnoUseCase.execute(lead.bisnoId);

        if (!isDefined(bisno)) {
          return eventConsumerLogger.error(
            { lead },
            `Bisno for lead #${lead.id} does not exists`,
          );
        }

        if (bisno.distributionRound >= MixeiroDecrementRules.DEFAULT) {
          await publisher.publish({
            routingKey: "bisno.order.exhausted",
            payload: [lead],
          });
        } else {
          await publisher.publish({
            routingKey: "bisno.distribution.next",
            payload: [bisno.get({ plain: true })],
          });
        }
      }
    },
  });

  await consumer.consume<LeadAttributes[]>({
    routingKey: "bisno.order.exhausted",
    queue: "bisno.order.exhausted.queue",
    onMessage: async (payload) => {
      for (const lead of payload) {
        const bisno = await getBisnoUseCase.execute(lead.bisnoId);

        if (!isDefined(bisno)) {
          return eventConsumerLogger.error(
            { lead },
            `Bisno for lead #${lead.id} does not exists`,
          );
        }

        await bisno.update({ status: "exhausted" });
        const leadFound = await getLeadByIdUseCase.execute(lead.id);

        if (!isDefined(leadFound)) {
          return eventConsumerLogger.error({ lead }, `Lead not found`);
        }

        await leadFound.update({ status: "expired" });
      }
    },
  });

  await consumer.consume<BisnoAttributes[]>({
    routingKey: "bisno.distribution.next",
    queue: "bisno.distribution.next.queue",
    onMessage: async (payload) => {
      for (const bisno of payload) {
        const service = await getServiceUseCase.execute(bisno.serviceId);
        const bisnoFound = await getBisnoUseCase.execute(bisno.id);

        if (!isDefined(service) || !isDefined(bisnoFound)) {
          return eventConsumerLogger.error(
            { bisno },
            "Bisno's service not found",
          );
        }

        const lead = await getLeadByBisnoIdUseCase.execute(bisno.id);
        const mixeiro = await getNextEligibleMixeiroUseCase.execute({
          serviceId: service.id,
          zoneId: bisno.zoneId,
        });

        if (isDefined(mixeiro)) {
          await lead?.update({ mixeiroId: mixeiro.id });
          await publisher.publish({
            routingKey: "bisno.notification.send",
            payload: [lead?.get({ plain: true })],
          });
        } else {
          eventConsumerLogger.error({ bisno }, "No eligible mixeiro found");

          const nextRound = Number(bisnoFound?.distributionRound || 0) + 1;
          await bisnoFound?.update({ distributionRound: nextRound });

          if (nextRound >= MixeiroDecrementRules.DEFAULT) {
            await publisher.publish({
              routingKey: "bisno.order.exhausted",
              payload: isDefined(lead) ? [lead.get({ plain: true })] : [],
            });
          } else {
            const bisnoHandled = {
              ...bisno,
              categoryId: service?.categoryId,
            };
            await publisher.publish({
              routingKey: "bisno.distribution.reset",
              payload: [bisnoHandled],
            });
          }
        }
      }
    },
  });

  await consumer.consume<{
    leadId: string;
    bisnoId: string;
    mixeiroId: string;
  }>({
    routingKey: "bisno.order.accepted",
    queue: "bisno.order.accepted.queue",
    onMessage: async (payload) => {
      try {
        const lead = await Lead.findByPk(payload.leadId, {
          include: [
            { model: Mixeiro },
            { model: Bisno, include: [Service, Zone] },
          ],
        });

        if (!isDefined(lead)) {
          return eventConsumerLogger.error({ payload }, "Lead not found");
        }

        await lead.bisno.update({ status: "done" });
        await lead.update({ status: "accepted" });
        await publisher.publish({
          routingKey: "bisno.points.decrement",
          payload: { mixeiroId: payload.mixeiroId },
        });

        await Promise.all([
          sendTextMessageBisnoClosedToMixeiro(
            lead.mixeiro.mobile,
            EVOLUTION_INSTANCE_NAMES.mainInstance.name,
            {
              mixeiroName: lead.mixeiro.customName,
              customerName: lead.bisno.customerName,
              customerMobile: lead.bisno.customerMobile,
              serviceName: lead.bisno.service.name,
              zoneName: lead.bisno.zone.name,
            },
          ),
          sendTextMessageBisnoClosedToClient(
            lead.bisno.customerMobile,
            EVOLUTION_INSTANCE_NAMES.mainInstance.name,
            {
              customerName: lead.bisno.customerName,
              mixeiroName: lead.mixeiro.customName,
              serviceName: lead.bisno.service.name,
            },
          ),
        ]);
      } catch (error: any) {
        eventConsumerLogger.error(
          { error: error.message, payload },
          "Failed to process bisno.order.accepted message",
        );
      }
    },
  });

  await consumer.consume<{ mixeiroId: string }>({
    routingKey: "bisno.points.decrement",
    queue: "bisno.points.decrement.queue",
    onMessage: async (payload) => {
      const mixeiro = await getMixeiroByIdUseCase.execute(payload?.mixeiroId);

      if (!isDefined(mixeiro)) {
        return eventConsumerLogger.error({ payload }, "Mixeiro not found");
      }

      const subscription = await getSubscriptionByMixeiroIdUseCase.execute(
        mixeiro.id,
      );

      if (!isDefined(subscription)) {
        return eventConsumerLogger.error(
          { mixeiro },
          "Error while processing Mixeiro's subscription",
        );
      }

      await decrementSubscriptionPointUseCase.execute(subscription.id);
    },
  });
}
