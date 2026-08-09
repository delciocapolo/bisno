import { sequelizeLogger } from "@src/infrastructure/sequelize/connection";
import { Pagination } from "@src/shared/utils/pagination";
import type { IApiPaginationMeta } from "@src/shared/@types/api-response";
import type { SchemaValidatePaginationFilters } from "@src/shared/@types/pagination";
import type { UseCaseAbstract } from "@src/shared/@types/use-case.js";
import type { SequelizeMixeiroRepository } from "@src/infrastructure/sequelize/repositories/mixeiro.repository.impl";
import { Mixeiro } from "@src/infrastructure/sequelize/models/mixeiro.model";

type IListMixeiroPaginatedUseCase = IApiPaginationMeta & { data: Mixeiro[] };

export class ListMixeiroPaginatedUseCase implements UseCaseAbstract<IListMixeiroPaginatedUseCase> {
  constructor(private readonly repository: SequelizeMixeiroRepository) {}

  async execute(
    filters?: Partial<SchemaValidatePaginationFilters>,
  ): Promise<IListMixeiroPaginatedUseCase> {
    try {
      const pagination = new Pagination(Mixeiro);
      return await pagination.paginate(filters);
    } catch (error) {
      sequelizeLogger.error(
        { error: (error as Error).message },
        "Error listing mixeiros",
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
