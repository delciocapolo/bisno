import cron from "node-cron";
import { listExpiredLeadUseCase } from "@src/application/use-cases/composition";
import { publisher } from "@src/infrastructure/rabbitmq/adapters/amqp-event-publisher";
import { scheduleLogger } from "../scheduler";

async function expiredLeadTask() {
  const expiredLeads = await listExpiredLeadUseCase.execute();
  await publisher.publish({
    routingKey: "bisno.notification.timeout",
    payload: expiredLeads,
  });
}

const expiredLeadsTask = cron.schedule("*/1 * * * *", expiredLeadTask, {
  name: "expired-lead",
  timezone: "Africa/Luanda",
});

expiredLeadsTask.on("execution:started", (ctx) => {
  scheduleLogger.error(
    {
      schedule: {
        date: ctx.date,
        taskName: ctx.task?.name,
        triggeredAt: ctx.triggeredAt,
        dateLocalIso: ctx.dateLocalIso,
        taskStatus: ctx.task?.getStatus(),
        taskPattern: ctx.task?.getPattern(),
      },
    },
    "Schedule started",
  );
});

expiredLeadsTask.on("execution:failed", (ctx) => {
  scheduleLogger.error(
    { error: ctx.execution?.error?.message },
    "Error while run expired-lead task",
  );
});

export { expiredLeadsTask };
