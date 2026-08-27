import type { IApiResponse } from "@src/shared/@types/api";
import type { IMixeiro } from "./types";
import { client } from "@src/lib/client";
import type {
  IFormCreateMixeiro,
  IFormGetMixeiro,
} from "@src/shared/schemas/mixeiro";
import { handleResponseErrorMessage } from "../utils";

export const mixeiroService = {
  createMixeiro: async (payload: IFormCreateMixeiro) => {
    try {
      const { data } = await client.post<IApiResponse<IMixeiro | null>>(
        "/mixeiros/create",
        payload,
      );
      return data;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
  getMixeiro: async (payload?: Partial<IFormGetMixeiro>) => {
    try {
      const { data } = await client.get<IApiResponse<IMixeiro | null>>(
        `/mixeiros/mixeiro`,
        { params: payload },
      );
      return data;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
};
