import type { Zone } from "@src/infrastructure/sequelize/models/zone.model";
import type { SequelizeZoneRepository } from "@src/infrastructure/sequelize/repositories/zone.repository.impl";
import type { UseCaseAbstract } from "@src/shared/@types/use-case.js";

export class GetZoneUseCase implements UseCaseAbstract<Zone | null> {
  constructor(private readonly repository: SequelizeZoneRepository) {}

  async execute(id: string): Promise<Zone | null> {
    const zone = await this.repository.getById(id);
    return zone;
  }
}
