import { client } from "@src/lib/client";
import type { ISubscription } from "./types";
import { handleResponseErrorMessage } from "../utils";
import type { IApiPaginatedResponse } from "@src/shared/@types/api";

export const subscriptionService = {
  list: async () => {
    try {
      const { data } =
        await client.get<IApiPaginatedResponse<ISubscription>>(
          "/subscriptions",
        );
      return data;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
};
