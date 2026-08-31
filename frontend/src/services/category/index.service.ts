import { client } from "@src/lib/client";
import { handleResponseErrorMessage } from "../utils";
import type { IFilter } from "@src/shared/@types/filter";
import type { IApiResponse } from "@src/shared/@types/api";
import type { ICategoryService } from "./types";

export const categoryService = {
  list: async (filters?: Partial<IFilter & { categoryName: string }>) => {
    try {
      const { data } = await client.get<IApiResponse<ICategoryService[]>>(
        "/category-services",
        { params: { filters: filters } },
      );
      return data;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
  getCategory: async ({ categoryId }: { categoryId: string }) => {
    try {
      const { data } = await client.get<
        IApiResponse<ICategoryService | undefined>
      >(`/category-services/${categoryId}`);
      return data;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
};
