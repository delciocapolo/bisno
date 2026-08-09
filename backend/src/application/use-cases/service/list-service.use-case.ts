import type {
  Service,
  ServiceAttributes,
} from "@src/infrastructure/sequelize/models/service.model";
import type { FindOptions } from "sequelize";
import type { UseCaseAbstract } from "@src/shared/@types/use-case";
import type { SequelizeServiceRepository } from "@src/infrastructure/sequelize/repositories/service.repository.impl";

export class ListServicesUseCase implements UseCaseAbstract<Service[] | null> {
  constructor(private readonly repository: SequelizeServiceRepository) {}

  async execute(
    params?: FindOptions<ServiceAttributes>,
  ): Promise<Service[] | null> {
    const services = await this.repository.list(params);
    return services;
  }
}
