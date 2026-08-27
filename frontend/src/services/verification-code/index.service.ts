import { client } from "@src/lib/client";
import type { IApiResponse } from "@src/shared/@types/api";
import type {
  IFormGenerateVerificationCode,
  IFormValidateVerificationCode,
} from "@src/shared/schemas/verification-code";
import { handleResponseErrorMessage } from "../utils";

export const verificationCodeService = {
  generate: async (payload: IFormGenerateVerificationCode) => {
    try {
      const { data } = await client.post<IApiResponse<boolean>>(
        "/verification-code/generate",
        payload,
      );
      return data;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
  validate: async (payload: IFormValidateVerificationCode) => {
    try {
      const { data } = await client.get<IApiResponse<boolean>>(
        "/verification-code/validate",
        { params: payload },
      );
      return data;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
};
