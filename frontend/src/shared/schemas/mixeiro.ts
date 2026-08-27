import { z } from "zod";
import { OBJECT_BI_VALIDATOR, OBJECT_ID_VALIDATOR } from "./commons";

export const schemaFormCreateMixeiro = z.object({
  customName: z.string().min(3, "Nome muito curto"),
  bi: OBJECT_BI_VALIDATOR,
  mobile: z.string().regex(/^9\d{8}$/, "Número inválido"),
  hasWhatsapp: z.boolean(),
  channel: z.enum(["whatsapp", "mobile"]),
  categoryId: z.uuid().min(1, "Escolhe um serviço"),
  zoneId: z.uuid().min(1, "Escolhe uma zona"),
});

export type IFormCreateMixeiro = z.infer<typeof schemaFormCreateMixeiro>;

export const schemaFormGetMixeiro = z.object({
  mixeiroId: OBJECT_ID_VALIDATOR.optional(),
  mobile: OBJECT_ID_VALIDATOR.optional(),
});

export type IFormGetMixeiro = z.infer<typeof schemaFormGetMixeiro>;
