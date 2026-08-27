import { z } from "zod";
import { schemaFormValidateVerificationCode } from "../schemas/form-validate-verification-code";

export type IValidateVerificationCodePayload = z.infer<
  typeof schemaFormValidateVerificationCode
>;
