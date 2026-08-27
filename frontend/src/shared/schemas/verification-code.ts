import { z } from "zod";
import { OBJECT_MOBILE_VALIDATOR } from "./commons";

export const schemaFormGenerateVerificationCode = z.object({
  mobile: OBJECT_MOBILE_VALIDATOR,
});

export const schemaFormValidateVerificationCode = z.object({
  mobile: OBJECT_MOBILE_VALIDATOR,
  code: z.string().min(1),
});

export type IFormGenerateVerificationCode = z.infer<
  typeof schemaFormGenerateVerificationCode
>;

export type IFormValidateVerificationCode = z.infer<
  typeof schemaFormValidateVerificationCode
>;
