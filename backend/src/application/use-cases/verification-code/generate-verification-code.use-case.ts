import type { UseCaseAbstract } from "@src/shared/@types/use-case";
import { sequelizeLogger } from "@src/infrastructure/sequelize/connection";
import { VerificationCode } from "@src/infrastructure/sequelize/models/verification-code.model";
import { SequelizeVerificationCodeRepository } from "@src/infrastructure/sequelize/repositories/verification-code.repository.impl";
import { VerificationCodeTypes } from "@src/domain/entities/verification-code.entity";
import { publisher } from "@src/infrastructure/rabbitmq/adapters/amqp-event-publisher";

export class GenerateVerificationCodeUseCase implements UseCaseAbstract<VerificationCode | null> {
  constructor(
    private readonly repository: SequelizeVerificationCodeRepository,
  ) {}

  async execute(
    mobile: string,
    type?: VerificationCodeTypes,
  ): Promise<VerificationCode | null> {
    try {
      const verificationCode = await this.repository.save(mobile, type);

      await publisher.publish({
        routingKey: "validate.verification-code",
        payload: {
          code: verificationCode?.code,
          mobile: verificationCode?.mobile,
        },
      });

      return verificationCode;
    } catch (error) {
      if (error instanceof Error) {
        sequelizeLogger.error(
          { error: error.message },
          "Error while generate verification code",
        );
      } else {
        sequelizeLogger.error(
          { error },
          "Error while generate verification code",
        );
      }

      return null;
    }
  }
}
