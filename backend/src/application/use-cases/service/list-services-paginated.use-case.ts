import { sequelizeLogger } from "@src/infrastructure/sequelize/connection";
import { Pagination } from "@src/shared/utils/pagination";
import type { IApiPaginationMeta } from "@src/shared/@types/api-response";
import type { SchemaValidatePaginationFilters } from "@src/shared/@types/pagination";
import type { UseCaseAbstract } from "@src/shared/@types/use-case.js";
import { Service } from "@src/infrastructure/sequelize/models/service.model";
import type { SequelizeServiceRepository } from "@src/infrastructure/sequelize/repositories/service.repository.impl";
import { Op } from "sequelize";

type IListServicePaginatedUseCase = IApiPaginationMeta & { data: Service[] };

export class ListServicePaginatedUseCase implements UseCaseAbstract<IListServicePaginatedUseCase> {
  constructor(private readonly repository: SequelizeServiceRepository) {}

  async execute(
    filters?: Partial<
      SchemaValidatePaginationFilters & { serviceName: string }
    >,
  ): Promise<IListServicePaginatedUseCase> {
    try {
      const pagination = new Pagination(Service);
      return await pagination.paginate(filters, {
        attributes: [
          "id",
          "name",
          "slug",
          "icon",
          "isActive",
          "createdAt",
          "categoryId",
        ],
        where: filters?.serviceName
          ? { name: { [Op.like]: `%${filters?.serviceName}%` } }
          : undefined,
      });
    } catch (error) {
      sequelizeLogger.error(
        { error: (error as Error).message },
        "Error listing services",
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
