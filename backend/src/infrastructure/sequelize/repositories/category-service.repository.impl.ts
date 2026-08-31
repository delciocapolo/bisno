import type { CategoryServiceRepository } from "@src/domain/repositories/category-service.repository";
import type { FindOptions } from "sequelize";
import type { CategoryServiceAttributes } from "../models/category-service.model";
import { CategoryService } from "../models/category-service.model";

const CATEGORY_SERVICE_ATTRIBUTES = ["id", "name", "slug", "isActive"];

export class SequelizeCategoryServiceRepository implements CategoryServiceRepository {
  async list(
    params?: FindOptions<CategoryServiceAttributes>,
  ): Promise<CategoryService[]> {
    return await CategoryService.findAll({
      where: params?.where,
      include: params?.include,
      limit: params?.limit,
      order: params?.order,
      attributes: CATEGORY_SERVICE_ATTRIBUTES,
    });
  }

  async getById(id: string): Promise<CategoryService | null> {
    return await CategoryService.findByPk(id, {
      attributes: CATEGORY_SERVICE_ATTRIBUTES,
    });
  }

  async getBySlug(slug: string): Promise<CategoryService | null> {
    return await CategoryService.findOne({
      where: {
        slug: slug,
      },
      attributes: CATEGORY_SERVICE_ATTRIBUTES,
    });
  }

  async save(name: string, slug: string): Promise<CategoryService | null> {
    return await CategoryService.create({
      name: name,
      slug: slug,
    });
  }
}
