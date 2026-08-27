import type { UseCaseAbstract } from "@src/shared/@types/use-case";
import { sequelizeLogger } from "@src/infrastructure/sequelize/connection";
import { IValidateVerificationCodePayload } from "@src/shared/events/verification-code-events";
import { SequelizeVerificationCodeRepository } from "@src/infrastructure/sequelize/repositories/verification-code.repository.impl";

export class ValidateVerificationCodeUseCase implements UseCaseAbstract<boolean> {
  constructor(
    private readonly repository: SequelizeVerificationCodeRepository,
  ) {}

  async execute(payload: IValidateVerificationCodePayload): Promise<boolean> {
    try {
      return await this.repository.verify(payload);
    } catch (error) {
      if (error instanceof Error) {
        sequelizeLogger.error(
          { error: error.message },
          "Error while verify verification code",
        );
      } else {
        sequelizeLogger.error(
          { error },
          "Error while verify verification code",
        );
      }

      return false;
    }
  }
}
