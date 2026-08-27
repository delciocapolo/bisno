import { Optional, DataTypes, Sequelize } from "sequelize";
import {
  Table,
  Model,
  Column,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { dbNameTables } from "@src/shared/constants/db-name-tables";
import { Subscription } from "./subscription.model.js";
import { Mixeiro } from "./mixeiro.model.js";

interface MixeiroHasSubscriptionAttributes {
  id: string;
  points: number;
  mixeiroId: string;
  subscriptionId: string;
  activatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

type MixeiroHasSubscriptionCreationAttributes = Optional<
  MixeiroHasSubscriptionAttributes,
  "id" | "createdAt" | "updatedAt" | "deletedAt" | "activatedAt"
>;

@Table({
  timestamps: false,
  underscored: true,
  tableName: dbNameTables.mixeiroHasSubscription,
})
class MixeiroHasSubscription extends Model<
  MixeiroHasSubscriptionAttributes,
  MixeiroHasSubscriptionCreationAttributes
> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  declare id: string;

  @Column({
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 },
    type: DataTypes.INTEGER,
  })
  declare points: number;

  @Column({
    allowNull: true,
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  })
  declare activatedAt: Date | null;

  @Column({
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  })
  declare createdAt: Date;

  @Column({
    allowNull: true,
    type: DataTypes.DATE,
  })
  declare updatedAt: Date | null;

  @Column({
    allowNull: true,
    type: DataTypes.DATE,
  })
  declare deletedAt: Date | null;

  @ForeignKey(() => Subscription)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  declare subscriptionId: string;

  @BelongsTo(() => Subscription)
  declare subscription: Subscription;

  @ForeignKey(() => Mixeiro)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  declare mixeiroId: string;

  @BelongsTo(() => Mixeiro)
  declare mixeiro: Mixeiro;
}

export { MixeiroHasSubscriptionAttributes, MixeiroHasSubscription };
