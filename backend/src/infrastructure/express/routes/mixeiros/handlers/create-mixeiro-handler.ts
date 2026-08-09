import z from "zod";
import type express from "express";
import { isDefined } from "@src/shared/utils/index.js";
import { createMixeiroUseCase } from "@src/application/use-cases/composition.js";
import { schemaFormCreateMixeiro } from "@src/shared/schemas/form-create-mixeiro.js";
import type { IApiResponse } from "@src/shared/@types/api-response.js";
import { getMixeiroVerifiedInformation } from "../utils.js";
import { serverLogger } from "@src/infrastructure/express/server.js";

const createMixeiroHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const mixeiroVerifiedData = await getMixeiroVerifiedInformation(
      req?.body?.bi,
    );

    const payload = await schemaFormCreateMixeiro.parseAsync({
      categoryId: req?.body?.categoryId,
      zoneId: req?.body?.zoneId,
      customName: req?.body?.customName,
      fullName: mixeiroVerifiedData?.nome,
      bi: mixeiroVerifiedData?.numero,
      email: req?.body?.email,
      password: req?.body?.password,
      channel: req?.body?.channel,
      mobile: req?.body?.mobile,
      hasWhatsapp: req?.body?.hasWhatsapp,
      verifiedAt: isDefined(mixeiroVerifiedData) ? new Date() : null,
    });

    serverLogger.info({ payload }, "Received mixeiro data");

    const mixeiro = await createMixeiroUseCase.execute(payload);

    if (!isDefined(mixeiro)) {
      throw new Error("Failed to create mixeiro");
    }

    return res.status(201).json({
      data: mixeiro,
      meta: { errors: null },
    } satisfies IApiResponse);
  } catch (error) {
    serverLogger.error(
      { error: (error as Error).message },
      "Error occurred while processing mixeiro data",
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
            error: "An unexpected error occurred while processing mixeiro data",
          },
        ],
      },
    } satisfies IApiResponse);
  }
};

export { createMixeiroHandler };
