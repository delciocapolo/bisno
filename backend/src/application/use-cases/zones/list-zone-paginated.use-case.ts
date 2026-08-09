import { sequelizeLogger } from "@src/infrastructure/sequelize/connection";
import { Pagination } from "@src/shared/utils/pagination";
import type { IApiPaginationMeta } from "@src/shared/@types/api-response";
import type { SchemaValidatePaginationFilters } from "@src/shared/@types/pagination";
import type { UseCaseAbstract } from "@src/shared/@types/use-case.js";
import { Zone } from "@src/infrastructure/sequelize/models/zone.model";
import type { SequelizeZoneRepository } from "@src/infrastructure/sequelize/repositories/zone.repository.impl";
import { Op } from "sequelize";

type IListZonePaginatedUseCase = IApiPaginationMeta & { data: Zone[] };

export class ListZonePaginatedUseCase implements UseCaseAbstract<IListZonePaginatedUseCase> {
  constructor(private readonly repository: SequelizeZoneRepository) {}

  async execute(
    filters?: Partial<SchemaValidatePaginationFilters & { zoneName: string }>,
  ): Promise<IListZonePaginatedUseCase> {
    try {
      const pagination = new Pagination(Zone);
      return await pagination.paginate(filters, {
        attributes: ["id", "name", "slug", "isActive"],
        where: filters?.zoneName
          ? { name: { [Op.like]: `%${filters?.zoneName}%` } }
          : undefined,
      });
    } catch (error) {
      sequelizeLogger.error(
        { error: (error as Error).message },
        "Error listing zones",
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
