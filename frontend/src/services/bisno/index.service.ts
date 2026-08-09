import type { IApiResponse } from "@src/shared/@types/api";
import type { IBisno, IBisnoList } from "./types";
import type { IFormCreateBisno } from "@src/shared/schemas/bisno";
import { client } from "@src/lib/client";
import type { IFilter } from "@src/shared/@types/filter";

export const bisnoService = {
  create: async (payload: IFormCreateBisno) => {
    try {
      const { data } = await client.post<IApiResponse<IBisno | null>>(
        "/bisnos/create",
        payload,
      );
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro Desconhecido");
    }
  },
  list: async (filters?: Partial<IFilter & {}>) => {
    try {
      const { data } = await client.get<IApiResponse<IBisnoList[]>>("/bisnos", {
        params: { filters: filters },
      });
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro Desconhecido");
    }
  },
};
