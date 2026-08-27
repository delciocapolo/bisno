import { z } from "zod";
import {
  OBJECT_BI_VALIDATOR,
  OBJECT_ID_VALIDATOR,
  OBJECT_MOBILE_VALIDATOR,
} from "./commons";

export const schemaFormCreateMixeiro = z.object({
  categoryId: OBJECT_ID_VALIDATOR,
  zoneId: OBJECT_ID_VALIDATOR,
  customName: z.string().min(1, { error: "Name is required" }),
  fullName: z.string().optional(),
  bi: OBJECT_BI_VALIDATOR,
  email: z.email({ error: "Invalid email" }).optional(),
  password: z.string().optional(),
  channel: z.enum(["whatsapp", "mobile", "email"]).default("mobile"),
  mobile: OBJECT_MOBILE_VALIDATOR,
  hasWhatsapp: z.boolean().optional().default(false),
  verifiedAt: z.date().optional(),
});
