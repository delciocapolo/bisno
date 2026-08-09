import type {
  Zone,
  ZoneAttributes,
} from "@src/infrastructure/sequelize/models/zone.model";
import type { FindOptions } from "sequelize";

export interface ZoneRepository {
  list: (params?: FindOptions<ZoneAttributes>) => Promise<Zone[]>;
  getById: (id: string) => Promise<Zone | null>;
  getBySlug: (slug: string) => Promise<Zone | null>;
  save: (name: string, slug: string) => Promise<Zone | null>;
}
