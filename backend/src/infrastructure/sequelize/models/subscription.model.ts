import { Optional, DataTypes } from "sequelize";
import { Table, Model, Column } from "sequelize-typescript";
import { dbNameTables } from "@src/shared/constants/db-name-tables";

interface SubscriptionAttributes {
  id: string;
  name: string;
  slug: string;
  points: number;
  priority: number;
  isActive: boolean;
}

type SubscriptionCreationAttributes = Optional<
  SubscriptionAttributes,
  "id" | "priority" | "isActive"
>;

@Table({
  timestamps: false,
  underscored: true,
  tableName: dbNameTables.subscriptions,
})
class Subscription extends Model<
  SubscriptionAttributes,
  SubscriptionCreationAttributes
> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: "idxname",
  })
  declare name: string;

  @Column({
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: "idxslug",
  })
  declare slug: string;

  @Column({
    defaultValue: 0,
    allowNull: false,
    validate: { min: 0 },
    type: DataTypes.INTEGER,
  })
  declare points: number;

  @Column({
    defaultValue: 1,
    allowNull: false,
    validate: { min: 0 },
    type: DataTypes.INTEGER,
  })
  declare priority: number;

  @Column({
    allowNull: false,
    defaultValue: true,
    type: DataTypes.BOOLEAN,
  })
  declare isActive: boolean;
}

export { SubscriptionAttributes, Subscription };
