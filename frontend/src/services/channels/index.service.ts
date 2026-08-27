import type { IFilter } from "@src/shared/@types/filter";
import type { IChannel } from "./types";
import { handleResponseErrorMessage } from "../utils";

export const CHANNELS: IChannel[] = [
  {
    id: "whatsapp",
    slug: "whatsapp",
    name: "WhatsApp",
    icon: "ic:baseline-whatsapp",
  },
  { id: "mobile", slug: "mobile", name: "Telefone", icon: "mdi:phone" },
];

export const channelService = {
  list: async (filters?: Partial<IFilter>) => {
    try {
      return CHANNELS.slice(0, filters?.pageSize);
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
};
