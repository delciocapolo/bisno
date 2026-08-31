import type { FindOptions } from "sequelize";
import type { UseCaseAbstract } from "@src/shared/@types/use-case";
import {
  Subscription,
  SubscriptionAttributes,
} from "@src/infrastructure/sequelize/models/subscription.model";
import { SequelizeSubscriptionRepository } from "@src/infrastructure/sequelize/repositories/subscription.repository.impl";

export class ListSubscriptionUseCase implements UseCaseAbstract<
  Subscription[]
> {
  constructor(private readonly repository: SequelizeSubscriptionRepository) {}

  async execute(
    params?: FindOptions<SubscriptionAttributes>,
  ): Promise<Subscription[]> {
    const subscriptions = await this.repository.list(params);
    return subscriptions;
  }
}
