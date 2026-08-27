import { z } from "zod";
import { OBJECT_ID_VALIDATOR } from "./commons";

export const schemaFormCreateMixeiroSubscription = z.object({
  planId: OBJECT_ID_VALIDATOR,
  mixeiroId: OBJECT_ID_VALIDATOR,
});

export type IFormCreateMixeiroSubscription = z.infer<
  typeof schemaFormCreateMixeiroSubscription
>;
