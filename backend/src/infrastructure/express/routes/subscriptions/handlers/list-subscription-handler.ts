import type express from "express";
import { serverLogger } from "../../../server";
import type { IApiResponse } from "@src/shared/@types/api-response";
import { listSubscriptionPaginatedUseCase } from "@src/application/use-cases/composition";
import z from "zod";
import { validatePaginationFilters } from "@src/shared/schemas/validate-pagination-filters";

export const listSubscriptionHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const filters = await validatePaginationFilters
      .extend({ subscriptionName: z.string().optional() })
      .parseAsync(req.query?.filters || {});

    const { data, ...paginated } =
      await listSubscriptionPaginatedUseCase.execute(filters);

    return res.status(200).json({
      data: data,
      meta: { errors: null, pagination: paginated },
    } satisfies IApiResponse);
  } catch (error: any) {
    serverLogger.error(
      { error: error.message },
      "Error occurred while processing subscription list",
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
            error:
              "An unexpected error occurred while processing subscription list",
          },
        ],
      },
    } satisfies IApiResponse);
  }
};
