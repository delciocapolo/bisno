import type { FindOptions } from "sequelize";
import type { UseCaseAbstract } from "@src/shared/@types/use-case";
import type { SequelizeZoneRepository } from "@src/infrastructure/sequelize/repositories/zone.repository.impl";
import type {
  Zone,
  ZoneAttributes,
} from "@src/infrastructure/sequelize/models/zone.model";

export class ListZoneUseCase implements UseCaseAbstract<Zone[] | null> {
  constructor(private readonly repository: SequelizeZoneRepository) {}

  async execute(params?: FindOptions<ZoneAttributes>): Promise<Zone[] | null> {
    const zones = await this.repository.list(params);
    return zones;
  }
}
