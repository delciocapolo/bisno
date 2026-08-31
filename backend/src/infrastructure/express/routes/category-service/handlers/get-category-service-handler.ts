import z from "zod";
import type express from "express";
import { serverLogger } from "../../../server";
import { OBJECT_ID_VALIDATOR } from "@src/shared/schemas/commons";
import type { IApiResponse } from "@src/shared/@types/api-response.js";
import { getCategoryServiceByIdUseCase } from "@src/application/use-cases/composition";

export const getCategoryServicesHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const payload = await z
      .object({ categoryId: OBJECT_ID_VALIDATOR })
      .parseAsync(req.params || {});

    const categoryService = await getCategoryServiceByIdUseCase.execute(
      payload.categoryId,
    );

    return res.status(200).json({
      data: categoryService,
      meta: { errors: null },
    } satisfies IApiResponse);
  } catch (error: any) {
    serverLogger.error(
      { error: error.message },
      "Error occurred while processing category service list",
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
            error:
              "An unexpected error occurred while processing category service list",
          },
        ],
      },
    } satisfies IApiResponse);
  }
};
