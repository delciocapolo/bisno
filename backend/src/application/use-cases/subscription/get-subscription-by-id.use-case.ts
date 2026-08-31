import type { UseCaseAbstract } from "@src/shared/@types/use-case.js";
import { Subscription } from "@src/infrastructure/sequelize/models/subscription.model";
import { SequelizeSubscriptionRepository } from "@src/infrastructure/sequelize/repositories/subscription.repository.impl";

export class GetSubscriptionByIdUseCase implements UseCaseAbstract<Subscription | null> {
  constructor(private readonly repository: SequelizeSubscriptionRepository) {}

  async execute(id: string): Promise<Subscription | null> {
    const service = await this.repository.getById(id);
    return service;
  }
}
