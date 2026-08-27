import { z } from "zod";

export const OBJECT_ID_VALIDATOR = z
  .uuid()
  .min(1, { error: "ID é obrigatório" });

export const OBJECT_BI_VALIDATOR = z
  .string()
  .min(1, { error: "BI é obrigatório" })
  .regex(/^\d{9}[A-Z]{2}\d{3}$/, "BI mal formatado (ex: 123456789LA042).");

export const OBJECT_MOBILE_VALIDATOR = z
  .e164()
  .min(9, { error: "O campo é obrigatório" })
  .max(13, { error: "O valor é muito longo" });
// .refine(
//   (val) => /^9\d{8}$/.test(val.replace(/\s/g, "")),
//   "Digit a valid phone number (e.g. 9XX XXX XXX).",
// );

export const OBJECT_EMAIL_VALIDATOR = z
  .email({ error: "Email inváldido" })
  .min(1, { error: "Email é obrigatório" });
