import { Op } from "sequelize";
import { Pagination } from "@src/shared/utils/pagination";
import type { UseCaseAbstract } from "@src/shared/@types/use-case.js";
import type { IApiPaginationMeta } from "@src/shared/@types/api-response";
import { sequelizeLogger } from "@src/infrastructure/sequelize/connection";
import type { SchemaValidatePaginationFilters } from "@src/shared/@types/pagination";
import { Subscription } from "@src/infrastructure/sequelize/models/subscription.model";
import { SequelizeSubscriptionRepository } from "@src/infrastructure/sequelize/repositories/subscription.repository.impl";

type IListSubscriptionPaginatedUseCase = IApiPaginationMeta & {
  data: Subscription[];
};

export class ListSubscriptionPaginatedUseCase implements UseCaseAbstract<IListSubscriptionPaginatedUseCase> {
  constructor(private readonly repository: SequelizeSubscriptionRepository) {}

  async execute(
    filters?: Partial<
      SchemaValidatePaginationFilters & { subscriptionName: string }
    >,
  ): Promise<IListSubscriptionPaginatedUseCase> {
    try {
      const pagination = new Pagination(Subscription);
      return await pagination.paginate(filters, {
        attributes: ["id", "name", "slug", "price", "points", "isActive"],
        where: filters?.subscriptionName
          ? { name: { [Op.like]: `%${filters?.subscriptionName}%` } }
          : undefined,
      });
    } catch (error) {
      sequelizeLogger.error(
        { error: (error as Error).message },
        "Error listing subscriptions",
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
