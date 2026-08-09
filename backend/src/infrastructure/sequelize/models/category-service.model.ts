import { Optional, DataTypes } from "sequelize";
import { Table, Model, Column } from "sequelize-typescript";
import { dbNameTables } from "@src/shared/constants/db-name-tables";

interface CategoryServiceAttributes {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

type CategoryServiceCreationAttributes = Optional<
  CategoryServiceAttributes,
  "id" | "isActive"
>;

@Table({
  timestamps: false,
  underscored: true,
  tableName: dbNameTables.categoryServices,
})
class CategoryService extends Model<
  CategoryServiceAttributes,
  CategoryServiceCreationAttributes
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
    allowNull: false,
    defaultValue: true,
    type: DataTypes.BOOLEAN,
  })
  declare isActive: boolean;
}

export { CategoryService, CategoryServiceAttributes };
