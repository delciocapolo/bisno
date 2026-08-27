"use strict";

const {
  dbNameTables,
} = require("../../../shared/constants/db-name-tables.cjs");
const {
  onUpdateRowTrigger,
  onDownUpdateRowTrigger,
} = require("../utils/migration-utils.cjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(dbNameTables.verificationCode, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      mixeiro_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: dbNameTables.mixeiros,
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      code: {
        allowNull: false,
        type: Sequelize.STRING(5),
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM(
          "login",
          "password_reset",
          "phone_verification",
          "email_verification",
          "identity_verification",
          "transaction_confirmation",
        ),
        defaultValue: "identity_verification",
      },
      expires_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      used_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });

    await onUpdateRowTrigger(queryInterface, dbNameTables.verificationCode);
  },

  async down(queryInterface, Sequelize) {
    await onDownUpdateRowTrigger(queryInterface, dbNameTables.verificationCode);
    await queryInterface.dropTable(dbNameTables.verificationCode);
  },
};
