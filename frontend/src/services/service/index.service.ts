import type { IApiResponse } from "@src/shared/@types/api";
import type { IService } from "./types";
import type { IFilter } from "@src/shared/@types/filter";
import { client } from "@src/lib/client";
import { handleResponseErrorMessage } from "../utils";

export const serviceService = {
  list: async (filters?: Partial<IFilter & { serviceName: string }>) => {
    try {
      const { data } = await client.get<IApiResponse<IService[]>>("/services", {
        params: { filters: filters },
      });
      return data;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
  getService: async ({ serviceId }: { serviceId: string }) => {
    try {
      const { data } = await client.get<IApiResponse<IService | undefined>>(
        `/services/${serviceId}`,
      );
      return data;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
};
