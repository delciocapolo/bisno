import { sequelizeLogger } from "@src/infrastructure/sequelize/connection";
import { Pagination } from "@src/shared/utils/pagination";
import type { IApiPaginationMeta } from "@src/shared/@types/api-response";
import type { SchemaValidatePaginationFilters } from "@src/shared/@types/pagination";
import type { UseCaseAbstract } from "@src/shared/@types/use-case.js";
import type { SequelizeBisnoRepository } from "@src/infrastructure/sequelize/repositories/bisno.repository.impl";
import { Bisno } from "@src/infrastructure/sequelize/models/bisno.model";
import { Service } from "@src/infrastructure/sequelize/models/service.model";
import { Zone } from "@src/infrastructure/sequelize/models/zone.model";
import { Op } from "sequelize";

type IListBisnoPaginatedUseCase = IApiPaginationMeta & { data: Bisno[] };

export class ListBisnoPaginatedUseCase implements UseCaseAbstract<IListBisnoPaginatedUseCase> {
  constructor(private readonly repository: SequelizeBisnoRepository) {}

  async execute(
    filters?: Partial<SchemaValidatePaginationFilters>,
  ): Promise<IListBisnoPaginatedUseCase> {
    try {
      const pagination = new Pagination(Bisno);
      return await pagination.paginate(filters, {
        where: {
          status: {
            [Op.in]: ["pending", "exhausted"],
          },
        },
        attributes: ["id", "status", "createdAt"],
        include: [
          { model: Zone, attributes: ["id", "name"] },
          { model: Service, attributes: ["id", "name"] },
        ],
      });
    } catch (error) {
      sequelizeLogger.error(
        { error: (error as Error).message },
        "Error listing bisnos",
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
