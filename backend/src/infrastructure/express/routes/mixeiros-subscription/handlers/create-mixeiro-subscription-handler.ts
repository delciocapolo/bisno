import type express from "express";
import { isDefined } from "@src/shared/utils/index";
import { serverLogger } from "../../../server";
import {
  createMixeiroSubscriptionUseCase,
  getSubscriptionByMixeiroIdUseCase,
  incrementSubscriptionPointUseCase,
} from "@src/application/use-cases/composition";
import type { IApiResponse } from "@src/shared/@types/api-response";
import { schemaFormCreateMixeiroSubscription } from "@src/shared/schemas/form-create-mixeiro-subscription";
import z from "zod";

export const createMixeiroSubscriptionHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const payload = await schemaFormCreateMixeiroSubscription.parseAsync(
      req?.body || {},
    );
    serverLogger.info({ payload }, "Received mixeiro subscription data");
    const mixeiroHasSubscription =
      await getSubscriptionByMixeiroIdUseCase.execute(payload.mixeiroId);

    if (!isDefined(mixeiroHasSubscription)) {
      await createMixeiroSubscriptionUseCase.execute(payload);
    } else {
      await incrementSubscriptionPointUseCase.execute(
        mixeiroHasSubscription.id,
      );
    }

    return res.status(201).json({
      data: "Data processed",
      meta: { errors: null },
    } satisfies IApiResponse);
  } catch (error: any) {
    serverLogger.error(
      { error: error.message },
      "Error occurred while processing mixeiro subscription data",
    );

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

    if (error instanceof Error) {
      return res.status(400).json({
        data: null,
        meta: {
          errors: [{ field: undefined, error: error.message }],
        },
      } satisfies IApiResponse);
    }

    return res.status(500).json({
      data: null,
      meta: {
        errors: [
          {
            field: undefined,
            error:
              "An unexpected error occurred while processing mixeiro subscription data",
          },
        ],
      },
    } satisfies IApiResponse);
  }
};
