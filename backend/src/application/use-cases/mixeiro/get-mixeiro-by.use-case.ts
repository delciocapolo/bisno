import type { UseCaseAbstract } from "@src/shared/@types/use-case.js";
import { Includeable } from "sequelize";
import type {
  Mixeiro,
  MixeiroAttributes,
} from "@src/infrastructure/sequelize/models/mixeiro.model";
import type { SequelizeMixeiroRepository } from "@src/infrastructure/sequelize/repositories/mixeiro.repository.impl";
import { CategoryService } from "@src/infrastructure/sequelize/models/category-service.model";
import { Zone } from "@src/infrastructure/sequelize/models/zone.model";

interface IParams {
  where: Partial<Pick<MixeiroAttributes, "id" | "bi" | "email" | "mobile">>;
  include?: Includeable[];
}

export class GetMixeiroByUseCase implements UseCaseAbstract<Mixeiro | null> {
  constructor(private readonly repository: SequelizeMixeiroRepository) {}

  async execute(params: IParams): Promise<Mixeiro | null> {
    const mixeiro = await this.repository.getMixeiro({
      where: params.where,
      include: [
        { model: CategoryService, attributes: ["name"] },
        { model: Zone, attributes: ["name"] },
        ...(params?.include || []),
      ],
    });
    return mixeiro;
  }
}
