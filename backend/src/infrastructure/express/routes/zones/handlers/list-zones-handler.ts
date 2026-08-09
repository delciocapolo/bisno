import z from "zod";
import type express from "express";
import { serverLogger } from "../../../server";
import { validatePaginationFilters } from "@src/shared/schemas/validate-pagination-filters.js";
import type { IApiResponse } from "@src/shared/@types/api-response.js";
import { listZonesPaginatedUseCase } from "@src/application/use-cases/composition";

export const listZonesHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const filters = await validatePaginationFilters
      .extend({ zoneName: z.string().optional() })
      .parseAsync(req.query?.filters || {});

    const { data, ...paginated } =
      await listZonesPaginatedUseCase.execute(filters);

    return res.status(200).json({
      data: data,
      meta: { errors: null, pagination: paginated },
    } satisfies IApiResponse);
  } catch (error) {
    serverLogger.error({ error }, "Error occurred while processing zone list");
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
            error: "An unexpected error occurred while processing zone list",
          },
        ],
      },
    } satisfies IApiResponse);
  }
};
