import type express from "express";
import { isDefined } from "@src/shared/utils/index";
import { serverLogger } from "../../../server";
import { createMixeiroSubscriptionUseCase } from "@src/application/use-cases/composition";
import { schemaFormCreateMixeiroSubscription } from "@src/shared/schemas/form-create-mixeiro-subscription";
import type { IApiResponse } from "@src/shared/@types/api-response";

export const createMixeiroSubscriptionHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const payload = await schemaFormCreateMixeiroSubscription.parseAsync({
      planId: req?.body?.planId,
      mixeiroId: req?.body?.mixeiroId,
    });

    serverLogger.info({ payload }, "Received mixeiro subscription data");

    const mixeiroSubscription =
      await createMixeiroSubscriptionUseCase.execute(payload);

    if (!isDefined(mixeiroSubscription)) {
      throw new Error("Failed to create mixeiro subscription");
    }

    return res.status(201).json({
      data: mixeiroSubscription,
      meta: { errors: null },
    } satisfies IApiResponse);
  } catch (error) {
    serverLogger.error(
      { error },
      "Error occurred while processing mixeiro subscription data",
    );

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
