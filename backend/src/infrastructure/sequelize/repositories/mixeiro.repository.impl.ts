import { Mixeiro } from "../models/mixeiro.model.js";
import type { FindOptions } from "sequelize";
import type { MixeiroAttributes } from "../models/mixeiro.model.js";
import type { RequiredNonNullable } from "@src/shared/@types/custom.js";
import type { ICreateMixeiroPayload } from "@src/shared/events/mixeiro-events.js";
import type { MixeiroRepository } from "@src/domain/repositories/mixeiro.repository.js";

const MIXEIRO_ATTRIBUTES = [
  "id",
  "customName",
  "mobile",
  "isActive",
  "verifiedAt",
];

export class SequelizeMixeiroRepository implements MixeiroRepository {
  async list(options?: FindOptions<MixeiroAttributes>): Promise<Mixeiro[]> {
    return await Mixeiro.findAll({
      attributes: MIXEIRO_ATTRIBUTES,
      where: options?.where,
      include: options?.include,
    });
  }

  async getMixeiroById(id: string): Promise<Mixeiro | null> {
    return await Mixeiro.findByPk(id, {
      attributes: MIXEIRO_ATTRIBUTES,
    });
  }

  async getMixeiroByMobile(mobile: string): Promise<Mixeiro | null> {
    return await Mixeiro.findOne({
      where: { mobile },
      attributes: MIXEIRO_ATTRIBUTES,
    });
  }

  async getMixeiroByEmail(email: string): Promise<Mixeiro | null> {
    return await Mixeiro.findOne({
      where: { email },
      attributes: MIXEIRO_ATTRIBUTES,
    });
  }

  async getMixeiro(
    params: RequiredNonNullable<FindOptions<MixeiroAttributes>, "where">,
  ): Promise<Mixeiro | null> {
    return await Mixeiro.findOne({
      where: params.where,
      include: params?.include,
      order: params?.order,
      limit: params?.limit,
      attributes: params?.attributes || MIXEIRO_ATTRIBUTES,
    });
  }

  async save(params: ICreateMixeiroPayload): Promise<Mixeiro | null> {
    return await Mixeiro.create(params);
  }
}
