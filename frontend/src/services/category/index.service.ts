import type { IApiResponse } from "@src/shared/@types/api";
import type { IFilter } from "@src/shared/@types/filter";
import { client } from "@src/lib/client";
import type { ICategoryService } from "../service/types";

export const categoryService = {
  list: async (filters?: Partial<IFilter & { categoryName: string }>) => {
    try {
      const { data } = await client.get<IApiResponse<ICategoryService[]>>(
        "/service-categories",
        { params: { filters: filters } },
      );
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro Desconhecido");
    }
  },
  getCategory: async ({ categoryId }: { categoryId: string }) => {
    try {
      const { data } = await client.get<
        IApiResponse<ICategoryService | undefined>
      >(`/service-categories/${categoryId}`);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro Desconhecido");
    }
  },
};
