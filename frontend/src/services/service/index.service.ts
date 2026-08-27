import type { IApiResponse } from "@src/shared/@types/api";
import type { ICategoryService } from "./types";
import type { IFilter } from "@src/shared/@types/filter";
import { client } from "@src/lib/client";
import { handleResponseErrorMessage } from "../utils";

export const CATEGORIES = [
  {
    id: "canalizador",
    name: "Canalizador",
    icon: "fa6-solid:screwdriver-wrench",
    slug: "canalizador",
    isActive: true,
  },
  {
    id: "electricista",
    name: "Electricista",
    icon: "fa6-solid:bolt",
    slug: "electricista",
    isActive: true,
  },
  {
    id: "cozinheira",
    name: "Cozinheira",
    icon: "fa6-solid:kitchen-set",
    slug: "cozinheira",
    isActive: true,
  },
  {
    id: "motorista",
    name: "Motorista",
    icon: "fa6-solid:car",
    slug: "motorista",
    isActive: true,
  },
  {
    id: "tec-telemoveis",
    name: "Téc. Telemóveis",
    icon: "mdi:cellphone-cog",
    slug: "tec-telemoveis",
    isActive: true,
  },
  {
    id: "cabeleireira",
    name: "Cabeleireira",
    icon: "fa6-solid:scissors",
    slug: "cabeleireira",
    isActive: true,
  },
  {
    id: "pedreiro",
    name: "Pedreiro",
    icon: "fa6-solid:trowel-bricks",
    slug: "pedreiro",
    isActive: true,
  },
  {
    id: "costureira",
    name: "Costureira",
    icon: "fa6-solid:syringe",
    slug: "costureira",
    isActive: true,
  },
  {
    id: "limpeza",
    name: "Limpeza",
    icon: "fa6-solid:broom",
    slug: "limpeza",
    isActive: true,
  },
  {
    id: "jardineiro",
    name: "Jardineiro",
    icon: "fa6-solid:seedling",
    slug: "jardineiro",
    isActive: true,
  },
  {
    id: "pintor",
    name: "Pintor",
    icon: "fa6-solid:paint-roller",
    slug: "pintor",
    isActive: true,
  },
  {
    id: "frio-ac",
    name: "Frio & AC",
    icon: "fa6-solid:snowflake",
    slug: "frio",
    isActive: true,
  },
  {
    id: "explicador",
    name: "Explciador",
    icon: "fa6-solid:screwdriver-wrench",
    slug: "explicador",
    isActive: true,
  },
];

export const serviceService = {
  list: async (filters?: Partial<IFilter & { serviceName: string }>) => {
    try {
      const { data } = await client.get<IApiResponse<ICategoryService[]>>(
        "/services",
        { params: { filters: filters } },
      );
      return data;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
  getService: async ({ serviceId }: { serviceId: string }) => {
    try {
      const { data } = await client.get<
        IApiResponse<ICategoryService | undefined>
      >(`/services/${serviceId}`);
      return data;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
};
