import { Optional, DataTypes, Sequelize } from "sequelize";
import { Table, Model, Column } from "sequelize-typescript";
import { dbNameTables } from "@src/shared/constants/db-name-tables";
import { VerificationCodeTypes } from "@src/domain/entities/verification-code.entity.js";

interface VerificationCodeAttributes {
  id: string;
  code: string;
  mobile: string;
  expiresAt: Date;
  createdAt: Date;
  usedAt: Date | null;
  updatedAt: Date | null;
  type: VerificationCodeTypes;
}

type VerificationCodeCreationAttributes = Optional<
  VerificationCodeAttributes,
  "id" | "createdAt" | "updatedAt" | "usedAt" | "type"
>;

@Table({
  timestamps: false,
  underscored: true,
  tableName: dbNameTables.verificationCode,
})
class VerificationCode extends Model<
  VerificationCodeAttributes,
  VerificationCodeCreationAttributes
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
    type: DataTypes.STRING(5),
  })
  declare code: string;

  @Column({
    allowNull: false,
    type: DataTypes.STRING(20),
  })
  declare mobile: string;

  @Column({
    allowNull: false,
    type: DataTypes.ENUM(
      "login",
      "password_reset",
      "phone_verification",
      "email_verification",
      "identity_verification",
      "transaction_confirmation",
    ),
    defaultValue: "identity_verification",
  })
  declare type: VerificationCodeTypes;

  @Column({
    allowNull: false,
    type: DataTypes.DATE,
  })
  declare expiresAt: Date;

  @Column({
    allowNull: true,
    type: DataTypes.DATE,
  })
  declare usedAt: Date;

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
}

export { VerificationCodeAttributes, VerificationCode };
