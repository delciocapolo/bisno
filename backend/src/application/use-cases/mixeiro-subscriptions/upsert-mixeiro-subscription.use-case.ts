import { sequelizeLogger } from "@src/infrastructure/sequelize/connection";
import type { UseCaseAbstract } from "@src/shared/@types/use-case";
import type { ICreateMixeiroHasSubscriptionPayload } from "@src/shared/events/mixeiro-has-subscription-events";
import type { SequelizeMixeiroHasSubscriptionRepository } from "@src/infrastructure/sequelize/repositories/mixeiro-has-subscription.repository.impl";

export class UpsertMixeiroSubscriptionUseCase implements UseCaseAbstract<boolean> {
  constructor(
    private readonly repository: SequelizeMixeiroHasSubscriptionRepository,
  ) {}

  async execute({
    planId,
    mixeiroId,
  }: ICreateMixeiroHasSubscriptionPayload): Promise<boolean> {
    try {
      // TODO: implementar o sistema da EMIS para pagamento express
      return await this.repository.upsert(planId, mixeiroId);
    } catch (error) {
      if (error instanceof Error) {
        sequelizeLogger.error(
          { error: error.message },
          "Error while associating mixeiro to subscription",
        );
      } else {
        sequelizeLogger.error(
          { error },
          "Error while associating mixeiro to subscription",
        );
      }

      return false;
    }
  }
}
