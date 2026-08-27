import { z } from "zod";

export const formRechargePointSchema = z.object({
  identification: z.string().min(9, "BI completo ou 9 dígitos do telemóvel"),
  mixeiroId: z.uuid().min(1, "Mixeiro não identificado"),
  planId: z.uuid().min(1, "Escolha um plano"),
});

export type IFormRechargePointSchema = z.infer<typeof formRechargePointSchema>;
