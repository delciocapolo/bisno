import type { IApiResponse } from "@src/shared/@types/api";
import type { IZone } from "./types";
import type { IFilter } from "@src/shared/@types/filter";
import { client } from "@src/lib/client";
import { handleResponseErrorMessage } from "../utils";

export const ZONES: IZone[] = [
  {
    id: "viana",
    name: "Viana",
    slug: "viana",
    isActive: true,
  },
  {
    id: "cazenga",
    name: "Cazenga",
    slug: "cazenga",
    isActive: true,
  },
  {
    id: "maianga",
    name: "Maianga",
    slug: "maianga",
    isActive: true,
  },
  {
    id: "capolo",
    name: "Capolo",
    slug: "capolo",
    isActive: true,
  },
  {
    id: "kilamba",
    name: "Kilamba",
    slug: "kilamba",
    isActive: true,
  },
  {
    id: "talatona",
    name: "Talatona",
    slug: "talatona",
    isActive: true,
  },
  {
    id: "ingombota",
    name: "Ingombota",
    slug: "ingombota",
    isActive: true,
  },
  {
    id: "cacuaco",
    name: "Cacuaco",
    slug: "cacuaco",
    isActive: true,
  },
  {
    id: "rangel",
    name: "Rangel",
    slug: "rangel",
    isActive: true,
  },
  {
    id: "samba",
    name: "Samba",
    slug: "samba",
    isActive: true,
  },
  {
    id: "benfica",
    name: "Benfica",
    slug: "benfica",
    isActive: true,
  },
  {
    id: "mutamba",
    name: "Mutamba",
    slug: "mutamba",
    isActive: true,
  },
  {
    id: "sambizanga",
    name: "Sambizanga",
    slug: "sambizanga",
    isActive: true,
  },
  {
    id: "mussulo",
    name: "Mussulo",
    slug: "mussulo",
    isActive: true,
  },
];

export const zoneService = {
  list: async (filters?: Partial<IFilter & { zoneName: string }>) => {
    try {
      const { data } = await client.get<IApiResponse<IZone[]>>("/zones", {
        params: { filters: filters },
      });
      return data;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
  getZone: async ({ zoneId }: { zoneId: string }) => {
    try {
      const { data } = await client.get<IApiResponse<IZone | undefined>>(
        `/zones/${zoneId}`,
      );
      return data;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
};
