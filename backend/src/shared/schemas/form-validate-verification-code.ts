import { z } from "zod";
import { OBJECT_MOBILE_VALIDATOR } from "./commons";

export const schemaFormValidateVerificationCode = z.object({
  mobile: OBJECT_MOBILE_VALIDATOR,
  code: z.string().min(1),
});
