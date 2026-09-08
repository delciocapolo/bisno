import type {
  MixeiroHasSubscription,
  MixeiroHasSubscriptionAttributes,
} from "@src/infrastructure/sequelize/models/mixeiro-has-subscription.model";
import type { FindOptions } from "sequelize";

export interface MixeiroHasSubscriptionRepository {
  list: (
    params?: FindOptions<MixeiroHasSubscriptionAttributes>,
  ) => Promise<MixeiroHasSubscription[]>;
  getSubscriptionById: (id: string) => Promise<MixeiroHasSubscription | null>;
  getCurrentPoints: (id: string) => Promise<number | null>;
  getSubscriptionByMixeiroId: (
    mixeiroId: string,
  ) => Promise<MixeiroHasSubscription | null>;
  incrementPoints: (id: string) => Promise<boolean>;
  decrementPoints: (id: string) => Promise<boolean>;
  save: (
    planId: string,
    mixeiroId: string,
  ) => Promise<MixeiroHasSubscription | null>;
  upsert: (planId: string, mixeiroId: string) => Promise<boolean>;
}
