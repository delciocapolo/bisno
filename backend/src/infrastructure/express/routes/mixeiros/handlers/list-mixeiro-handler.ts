import z from "zod";
import type express from "express";
import type { IApiResponse } from "@src/shared/@types/api-response";
import { listMixeirosPaginatedUseCase } from "@src/application/use-cases/composition";
import { serverLogger } from "@src/infrastructure/express/server";
import { validatePaginationFilters } from "@src/shared/schemas/validate-pagination-filters";

export const listMixeiroHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const filters = await validatePaginationFilters.parseAsync(
      req.query?.filters || {},
    );

    const { data, ...paginated } =
      await listMixeirosPaginatedUseCase.execute(filters);

    return res.status(200).json({
      data: data,
      meta: { errors: null, pagination: paginated },
    } satisfies IApiResponse);
  } catch (error: any) {
    serverLogger.error(
      { error: error.message },
      "Error occurred while processing mixeiro list",
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
            error: "An unexpected error occurred while processing mixeiro list",
          },
        ],
      },
    } satisfies IApiResponse);
  }
};
