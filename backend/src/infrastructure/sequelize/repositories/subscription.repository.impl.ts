import { Subscription } from "../models/subscription.model.js";
import { Op, type FindOptions } from "sequelize";
import type { SubscriptionRepository } from "@src/domain/repositories/subscription.repository.js";
import type { SubscriptionAttributes } from "../models/subscription.model.js";

const SUBSCRIPTION_ATTRIBUTES = [
  "id",
  "name",
  "slug",
  "price",
  "points",
  // "priority",
  "isActive",
];

export class SequelizeSubscriptionRepository implements SubscriptionRepository {
  async list(
    params?: FindOptions<SubscriptionAttributes>,
  ): Promise<Subscription[]> {
    return await Subscription.findAll({
      where: params?.where,
      include: params?.include,
      order: params?.order,
      limit: params?.limit,
      attributes: params?.attributes || SUBSCRIPTION_ATTRIBUTES,
    });
  }

  async getById(id: string): Promise<Subscription | null> {
    return await Subscription.findByPk(id, {
      attributes: SUBSCRIPTION_ATTRIBUTES,
    });
  }

  async getPoints(id: string): Promise<number | null> {
    const subscription = await this.getById(id);
    return subscription?.points || null;
  }

  async getBySlug(slug: string): Promise<Subscription | null> {
    const subscription = await Subscription.findOne({
      where: { slug: { [Op.like]: `%${slug}%` } },
      attributes: SUBSCRIPTION_ATTRIBUTES,
    });

    return subscription;
  }

  async save(
    name: string,
    slug: string,
    points: number,
  ): Promise<Subscription | null> {
    return await Subscription.create({
      name: name,
      slug: slug,
      points: points,
    });
  }
}
