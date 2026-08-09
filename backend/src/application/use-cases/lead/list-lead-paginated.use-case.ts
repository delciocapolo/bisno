import { sequelizeLogger } from "@src/infrastructure/sequelize/connection";
import { Lead } from "@src/infrastructure/sequelize/models/lead.model";
import { Pagination } from "@src/shared/utils/pagination";
import type { SequelizeLeadRepository } from "@src/infrastructure/sequelize/repositories/lead.repository.impl";
import type { IApiPaginationMeta } from "@src/shared/@types/api-response";
import type { SchemaValidatePaginationFilters } from "@src/shared/@types/pagination";
import type { UseCaseAbstract } from "@src/shared/@types/use-case.js";

type IListLeadPaginatedUseCase = IApiPaginationMeta & { data: Lead[] };

export class ListLeadPaginatedUseCase implements UseCaseAbstract<IListLeadPaginatedUseCase> {
  constructor(private readonly repository: SequelizeLeadRepository) {}

  async execute(
    filters?: Partial<SchemaValidatePaginationFilters>,
  ): Promise<IListLeadPaginatedUseCase> {
    try {
      const pagination = new Pagination(Lead);
      return await pagination.paginate(filters);
    } catch (error) {
      sequelizeLogger.error(
        { error: (error as Error).message },
        "Error listing leads",
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
