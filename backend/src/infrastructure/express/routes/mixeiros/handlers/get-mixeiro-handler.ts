import z from "zod";
import type express from "express";
import type { IApiResponse } from "@src/shared/@types/api-response";
import { serverLogger } from "@src/infrastructure/express/server";
import { OBJECT_ID_VALIDATOR } from "@src/shared/schemas/commons";
import { Op } from "sequelize";
import { isDefined } from "@src/shared/utils";
import {
  getMixeiroByUseCase,
  getSubscriptionByMixeiroIdUseCase,
} from "@src/application/use-cases/composition";
import { MixeiroHasSubscription } from "@src/infrastructure/sequelize/models/mixeiro-has-subscription.model";

export const getMixeiroHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const payload = await z
      .object({
        mixeiroId: OBJECT_ID_VALIDATOR.optional(),
        mobile: z.string().min(9, "Mobile is required").optional(),
      })
      .parseAsync(req.query || {});
    const mixeiro_ = await getMixeiroByUseCase.execute({
      where: {
        [Op.or]: [
          isDefined(payload?.mixeiroId) ? { id: payload.mixeiroId } : {},
          isDefined(payload?.mobile)
            ? { mobile: { [Op.like]: `%${payload.mobile}%` } }
            : {},
        ],
      } as any,
    });
    let mixeiro = null;

    if (isDefined(mixeiro_)) {
      mixeiro = {
        ...mixeiro_.get({ plain: true }),
        subscription: await getSubscriptionByMixeiroIdUseCase.execute(
          mixeiro_.id,
        ),
      };
    }

    return res.status(200).json({
      data: mixeiro,
      meta: { errors: null },
    } satisfies IApiResponse);
  } catch (error: any) {
    serverLogger.error(
      { error: error.message },
      "Error occurred while getting mixeiro data",
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
    return res.status(500).json({
      data: null,
      meta: {
        errors: [
          {
            field: undefined,
            error: "An unexpected error occurred while getting mixeiro data",
          },
        ],
      },
    } satisfies IApiResponse);
  }
};
