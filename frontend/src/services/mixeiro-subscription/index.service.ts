import { client } from "@src/lib/client";
import type { IMixeiroHasSubscription } from "./types";
import type { IApiResponse } from "@src/shared/@types/api";
import type { IFormCreateMixeiroSubscription } from "@src/shared/schemas/mixeiro-has-subscription";
import { handleResponseErrorMessage } from "../utils";

export const mixeiroSubscriptionService = {
  create: async (payload: IFormCreateMixeiroSubscription) => {
    try {
      const { data } = await client.post<
        IApiResponse<IMixeiroHasSubscription | null>
      >("/mixeiro-subscriptions/create", payload);
      return data;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
};
