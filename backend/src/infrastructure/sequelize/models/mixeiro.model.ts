import { Optional, DataTypes, Sequelize } from "sequelize";
import {
  Table,
  Model,
  Column,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { dbNameTables } from "@src/shared/constants/db-name-tables";
import { IMixeiroChannel } from "@src/domain/entities/mixeiro.entity.js";
import { CategoryService } from "./category-service.model.js";
import { Zone } from "./zone.model.js";
import { MixeiroHasSubscription } from "./mixeiro-has-subscription.model.js";

interface MixeiroAttributes {
  id: string;
  zoneId: string;
  categoryId: string;
  customName: string;
  fullName: string | null;
  email: string;
  password: string;
  bi: string | null;
  mobile: string;
  hasWhatsapp: boolean;
  isActive: boolean;
  isLocked: boolean;
  channel: IMixeiroChannel;
  verifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

type MixeiroCreationAttributes = Optional<
  MixeiroAttributes,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "fullName"
  | "verifiedAt"
  | "email"
  | "password"
  | "isLocked"
  | "isActive"
  | "hasWhatsapp"
  | "channel"
>;

@Table({
  timestamps: false,
  underscored: true,
  tableName: dbNameTables.mixeiros,
})
class Mixeiro extends Model<MixeiroAttributes, MixeiroCreationAttributes> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  declare customName: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
  })
  declare fullName: string | null;

  @Column({
    unique: true,
    allowNull: true,
    type: DataTypes.STRING,
  })
  declare email: string | null;

  @Column({
    allowNull: true,
    type: DataTypes.STRING,
  })
  declare password: string | null;

  @Column({
    unique: true,
    allowNull: true,
    type: DataTypes.STRING,
  })
  declare bi: string | null;

  @Column({
    unique: true,
    allowNull: false,
    type: DataTypes.STRING(15),
  })
  declare mobile: string;

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  declare hasWhatsapp: boolean;

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  })
  declare isActive: boolean;

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  declare isLocked: boolean;

  @Column({
    type: DataTypes.ENUM("whatsapp", "mobile", "email"),
    defaultValue: "mobile",
    allowNull: false,
  })
  declare channel: IMixeiroChannel;

  @Column({
    allowNull: true,
    type: DataTypes.DATE,
  })
  declare verifiedAt: Date | null;

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

  @HasMany(() => MixeiroHasSubscription, { foreignKey: "mixeiroId" })
  declare mixeiroHasSubscriptions: MixeiroHasSubscription[];

  @ForeignKey(() => Zone)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  declare zoneId: string;

  @BelongsTo(() => Zone)
  declare zone: Zone;

  @ForeignKey(() => CategoryService)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  declare categoryId: string;

  @BelongsTo(() => CategoryService)
  declare categoryService: CategoryService;
}

export { Mixeiro, IMixeiroChannel, MixeiroAttributes };
