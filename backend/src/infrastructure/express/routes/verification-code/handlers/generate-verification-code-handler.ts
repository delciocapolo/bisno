import z from "zod";
import type express from "express";
import { serverLogger } from "@src/infrastructure/express/server";
import { OBJECT_MOBILE_VALIDATOR } from "@src/shared/schemas/commons";
import type { IApiResponse } from "@src/shared/@types/api-response";
import { generateVerificationCodeUseCase } from "@src/application/use-cases/composition";
import { Mixeiro } from "@src/infrastructure/sequelize/models/mixeiro.model";
import { Op } from "sequelize";
import { isDefined } from "@src/shared/utils";

export const generateVerificationCodeHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const payload = await z
      .object({ mobile: OBJECT_MOBILE_VALIDATOR })
      .parseAsync(req.body || {});

    serverLogger.error({ payload }, "Verification code payload");

    const mixeiro = await Mixeiro.findOne({
      where: {
        mobile: { [Op.like]: `%${payload.mobile}%` },
      },
    });

    if (!isDefined(mixeiro)) {
      throw new Error("Mixeiro not found");
    }

    await generateVerificationCodeUseCase.execute(payload.mobile);

    return res.status(200).json({
      data: true,
      meta: { errors: null },
    } satisfies IApiResponse);
  } catch (error: any) {
    serverLogger.error(
      { error: error.message },
      "Error occurred while generating verification code",
    );
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((issue) => ({
        field: issue?.path?.at(0),
        error: issue.message,
      }));
      return res.status(422).json({
        data: false,
        meta: { errors: errors },
      } satisfies IApiResponse);
    }
    return res.status(500).json({
      data: false,
      meta: {
        errors: [
          {
            field: "mobile",
            error: error?.message,
          },
        ],
      },
    } satisfies IApiResponse);
  }
};
