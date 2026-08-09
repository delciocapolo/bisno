import type {
  CategoryService,
  CategoryServiceAttributes,
} from "@src/infrastructure/sequelize/models/category-service.model";
import type { FindOptions } from "sequelize";

export interface CategoryServiceRepository {
  list: (
    params?: FindOptions<CategoryServiceAttributes>,
  ) => Promise<CategoryService[]>;
  getById: (id: string) => Promise<CategoryService | null>;
  getBySlug: (slug: string) => Promise<CategoryService | null>;
  save: (name: string, slug: string) => Promise<CategoryService | null>;
}
