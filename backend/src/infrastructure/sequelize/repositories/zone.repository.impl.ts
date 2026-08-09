import type { FindOptions } from "sequelize";
import type { ZoneRepository } from "@src/domain/repositories/zone.repository";
import type { ZoneAttributes } from "../models/zone.model";
import { Zone } from "../models/zone.model";

const ZONE_ATTRIBUTES = ["id", "name", "slug", "isActive"];

export class SequelizeZoneRepository implements ZoneRepository {
  async list(params?: FindOptions<ZoneAttributes>): Promise<Zone[]> {
    return await Zone.findAll({
      where: params?.where,
      include: params?.include,
      limit: params?.limit,
      order: params?.order,
      attributes: ZONE_ATTRIBUTES,
    });
  }

  async getById(id: string): Promise<Zone | null> {
    return await Zone.findByPk(id, {
      attributes: ZONE_ATTRIBUTES,
    });
  }

  async getBySlug(slug: string): Promise<Zone | null> {
    return await Zone.findOne({
      where: { slug: slug },
      attributes: ZONE_ATTRIBUTES,
    });
  }

  async save(name: string, slug: string): Promise<Zone | null> {
    return await Zone.create({
      name: name,
      slug: slug,
    });
  }
}
