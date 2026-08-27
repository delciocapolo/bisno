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
