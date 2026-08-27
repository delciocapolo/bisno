import type {
  VerificationCode,
  VerificationCodeAttributes,
} from "@src/infrastructure/sequelize/models/verification-code.model";
import type { FindOptions } from "sequelize";
import type { VerificationCodeTypes } from "../entities/verification-code.entity";
import type { IValidateVerificationCodePayload } from "@src/shared/events/verification-code-events";

export interface VerificationCodeRepository {
  list: (
    params?: FindOptions<VerificationCodeAttributes>,
  ) => Promise<VerificationCode[]>;
  verify: (payload: IValidateVerificationCodePayload) => Promise<boolean>;
  getVerificationCodeById: (id: string) => Promise<VerificationCode | null>;
  getVerificationCodeByMobile: (
    mobile: string,
  ) => Promise<VerificationCode | null>;
  save: (
    mobile: string,
    type?: VerificationCodeTypes,
  ) => Promise<VerificationCode | null>;
}
