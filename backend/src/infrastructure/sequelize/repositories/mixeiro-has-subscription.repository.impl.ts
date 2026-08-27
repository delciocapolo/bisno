import type { FindOptions } from "sequelize";
import type { MixeiroHasSubscriptionRepository } from "@src/domain/repositories/mixeiro-has-subcription.repository.js";
import type { MixeiroHasSubscriptionAttributes } from "../models/mixeiro-has-subscription.model.js";
import { MixeiroHasSubscription } from "../models/mixeiro-has-subscription.model.js";
import { isDefined } from "@src/shared/utils/index.js";
import { sequelizeLogger } from "../connection.js";
import { Subscription } from "../models/subscription.model.js";
import { Rules } from "@src/domain/enums/mixeiro-has-subscription.enum.js";

const MIXEIRO_HAS_SUBSCRIPTION_ATTRIBUTES = [
  "id",
  "points",
  "mixeiroId",
  "subscriptionId",
  "activatedAt",
  "createdAt",
];

export class SequelizeMixeiroHasSubscriptionRepository implements MixeiroHasSubscriptionRepository {
  async list(
    params?: FindOptions<MixeiroHasSubscriptionAttributes>,
  ): Promise<MixeiroHasSubscription[]> {
    return await MixeiroHasSubscription.findAll({
      where: params?.where,
      include: params?.include,
      order: params?.order,
      limit: params?.limit,
      offset: params?.offset,
      attributes: MIXEIRO_HAS_SUBSCRIPTION_ATTRIBUTES,
    });
  }

  async getSubscriptionById(
    id: string,
  ): Promise<MixeiroHasSubscription | null> {
    return await MixeiroHasSubscription.findByPk(id, {
      attributes: MIXEIRO_HAS_SUBSCRIPTION_ATTRIBUTES,
    });
  }

  async getCurrentPoints(id: string): Promise<number | null> {
    const subscription = await MixeiroHasSubscription.findByPk(id, {
      attributes: MIXEIRO_HAS_SUBSCRIPTION_ATTRIBUTES,
    });

    return subscription?.points || null;
  }

  async getSubscriptionByMixeiroId(
    mixeiroId: string,
  ): Promise<MixeiroHasSubscription | null> {
    return await MixeiroHasSubscription.findOne({
      where: { mixeiroId: mixeiroId },
      order: [["createdAt", "DESC"]],
    });
  }

  async incrementPoints(id: string): Promise<boolean> {
    const subscription = await MixeiroHasSubscription.findByPk(id);

    if (!isDefined(subscription) || !isDefined(subscription?.activatedAt)) {
      sequelizeLogger.error(
        { subscriptionId: id },
        "Mixeiro has not active subscription",
      );
      return false;
    }

    const plan = await Subscription.findByPk(subscription.subscriptionId);

    if (!isDefined(plan)) {
      sequelizeLogger.error(
        { planId: subscription.subscriptionId },
        "Plan does not exists",
      );
      return false;
    }

    await subscription.update({
      points: plan.points,
      subscriptionId: plan.get("id"),
    });

    return true;
  }

  async decrementPoints(id: string): Promise<boolean> {
    const subscription = await MixeiroHasSubscription.findByPk(id);

    if (!isDefined(subscription) || !isDefined(subscription?.activatedAt)) {
      sequelizeLogger.error(
        { subscriptionId: id },
        "Mixeiro has not active subscription",
      );
      return false;
    }

    if (subscription.points < Rules.DecrementPoints) {
      sequelizeLogger.error(
        { subscriptionId: id },
        "Mixeiro has insufficient points",
      );
      return false;
    }

    await subscription.update({
      points: subscription.points - Rules.DecrementPoints,
    });

    return true;
  }

  async save(
    planId: string,
    mixeiroId: string,
  ): Promise<MixeiroHasSubscription | null> {
    const plan = await Subscription.findByPk(planId);

    if (!isDefined(plan)) {
      sequelizeLogger.error({ planId: planId }, "Plan does not exists");
      return null;
    }

    return await MixeiroHasSubscription.create({
      points: plan.points,
      mixeiroId: mixeiroId,
      subscriptionId: planId,
      activatedAt: new Date(),
    });
  }
}
