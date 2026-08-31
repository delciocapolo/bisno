import z from "zod";
import type express from "express";
import { serverLogger } from "../../../server";
import type { IApiResponse } from "@src/shared/@types/api-response.js";
import { getZoneUseCase } from "@src/application/use-cases/composition";

export const getZoneHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const payload = await z.object({ zoneId: z.uuid() }).parseAsync(req.params);

    const data = await getZoneUseCase.execute(payload.zoneId);

    return res.status(200).json({
      data: data,
      meta: { errors: null },
    } satisfies IApiResponse);
  } catch (error: any) {
    serverLogger.error(
      { error: error.message },
      "Error occurred while processing zone data",
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
            error: "An unexpected error occurred while processing zone data",
          },
        ],
      },
    } satisfies IApiResponse);
  }
};
