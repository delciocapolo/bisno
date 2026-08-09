import type { FindOptions } from "sequelize";
import type { UseCaseAbstract } from "@src/shared/@types/use-case";
import type { SequelizeCategoryServiceRepository } from "@src/infrastructure/sequelize/repositories/category-service.repository.impl";
import type {
  CategoryService,
  CategoryServiceAttributes,
} from "@src/infrastructure/sequelize/models/category-service.model";

export class ListCategoryServicesUseCase implements UseCaseAbstract<
  CategoryService[] | null
> {
  constructor(
    private readonly repository: SequelizeCategoryServiceRepository,
  ) {}

  async execute(
    params?: FindOptions<CategoryServiceAttributes>,
  ): Promise<CategoryService[] | null> {
    const services = await this.repository.list(params);
    return services;
  }
}
