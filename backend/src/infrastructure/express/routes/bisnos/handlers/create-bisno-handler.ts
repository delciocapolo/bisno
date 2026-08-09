import z from "zod";
import type express from "express";
import { schemaFormCreateBisno } from "@src/shared/schemas/form-create-bisno.js";
import { publisher } from "@src/infrastructure/rabbit/adapters/amqp-event-publisher.js";
import type { IApiResponse } from "@src/shared/@types/api-response.js";
import { serverLogger } from "@src/infrastructure/express/server";

export const createBisnoHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const bisno = await schemaFormCreateBisno.parseAsync(req?.body || {});
    serverLogger.info({ bisno }, "Received bisno data");
    await publisher.publish({
      routingKey: "bisno.order.created",
      payload: bisno,
    });
    return res.status(201).json({
      data: bisno,
      meta: { errors: null },
    } satisfies IApiResponse);
  } catch (error) {
    serverLogger.error({ error }, "Error occurred while processing bisno data");
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((issue) => ({
        field: issue?.path?.at(0),
        error: issue.message,
      }));
      return res.status(422).json({
        data: null,
        meta: { errors: errors },
      } satisfies IApiResponse);
    }
    return res.status(500).json({
      data: null,
      meta: {
        errors: [
          {
            field: undefined,
            error: "An unexpected error occurred while processing bisno data",
          },
        ],
      },
    } satisfies IApiResponse);
  }
};
