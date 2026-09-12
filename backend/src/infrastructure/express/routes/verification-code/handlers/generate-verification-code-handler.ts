import z from "zod";
import { Op } from "sequelize";
import type express from "express";
import { isDefined } from "@src/shared/utils";
import { serverLogger } from "@src/infrastructure/express/server";
import { OBJECT_MOBILE_VALIDATOR } from "@src/shared/schemas/commons";
import type { IApiResponse } from "@src/shared/@types/api-response";
import {
  generateVerificationCodeUseCase,
  getMixeiroByUseCase,
} from "@src/application/use-cases/composition";

export const generateVerificationCodeHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const payload = await z
      .object({ mobile: OBJECT_MOBILE_VALIDATOR })
      .parseAsync(req.body || {});

    serverLogger.error({ payload }, "Verification code payload");

    const mixeiro = await getMixeiroByUseCase.execute({
      where: {
        mobile: { [Op.like]: `%${payload.mobile}%` } as any,
      },
    });

    if (!isDefined(mixeiro)) {
      throw new Error("Mixeiro não encontrado");
    }

    if (!isDefined(mixeiro?.verifiedAt)) {
      throw new Error("Mixeiro não verificado");
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
