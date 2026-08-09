import { sequelizeLogger } from "@src/infrastructure/sequelize/connection";
import { Pagination } from "@src/shared/utils/pagination";
import type { IApiPaginationMeta } from "@src/shared/@types/api-response";
import type { SchemaValidatePaginationFilters } from "@src/shared/@types/pagination";
import type { UseCaseAbstract } from "@src/shared/@types/use-case.js";
import { CategoryService } from "@src/infrastructure/sequelize/models/category-service.model";
import type { SequelizeCategoryServiceRepository } from "@src/infrastructure/sequelize/repositories/category-service.repository.impl";

type IListCategoryServicePaginatedUseCase = IApiPaginationMeta & {
  data: CategoryService[];
};

export class ListCategoryServicesPaginatedUseCase implements UseCaseAbstract<IListCategoryServicePaginatedUseCase> {
  constructor(
    private readonly repository: SequelizeCategoryServiceRepository,
  ) {}

  async execute(
    filters?: Partial<SchemaValidatePaginationFilters>,
  ): Promise<IListCategoryServicePaginatedUseCase> {
    try {
      const pagination = new Pagination(CategoryService);
      return await pagination.paginate(filters);
    } catch (error) {
      sequelizeLogger.error(
        { error: (error as Error).message },
        "Error listing category services",
      );
      return {
        data: [],
        page: 1,
        pageSize: 0,
        pageCount: 0,
        total: 0,
      };
    }
  }
}
