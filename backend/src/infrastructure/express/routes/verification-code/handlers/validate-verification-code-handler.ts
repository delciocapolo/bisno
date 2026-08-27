import z from "zod";
import type express from "express";
import { serverLogger } from "@src/infrastructure/express/server";
import type { IApiResponse } from "@src/shared/@types/api-response.js";
import { schemaFormValidateVerificationCode } from "@src/shared/schemas/form-validate-verification-code";
import { validateVerificationCodeUseCase } from "@src/application/use-cases/composition";

export const validateVerificationCodeHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const payload = await schemaFormValidateVerificationCode.parseAsync(
      req?.query || {},
    );
    serverLogger.info({ payload }, "Received verification code data");
    const verificationCode =
      await validateVerificationCodeUseCase.execute(payload);
    return res.status(200).json({
      data: verificationCode,
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
            error:
              "An unexpected error occurred while validating verification code data",
          },
        ],
      },
    } satisfies IApiResponse);
  }
};
