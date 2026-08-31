import type { CategoryService } from "@src/infrastructure/sequelize/models/category-service.model";
import type { SequelizeCategoryServiceRepository } from "@src/infrastructure/sequelize/repositories/category-service.repository.impl";
import type { UseCaseAbstract } from "@src/shared/@types/use-case.js";

export class GetCategoryServiceByIdUseCase implements UseCaseAbstract<CategoryService | null> {
  constructor(
    private readonly repository: SequelizeCategoryServiceRepository,
  ) {}

  async execute(id: string): Promise<CategoryService | null> {
    const service = await this.repository.getById(id);
    return service;
  }
}
