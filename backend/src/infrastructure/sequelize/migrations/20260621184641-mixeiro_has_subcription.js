"use strict";

const {
  dbNameTables,
} = require("../../../shared/constants/db-name-tables.cjs");
const {
  onUpdateRowTrigger,
  onDownUpdateRowTrigger,
  onConstraintCheckNonNegativeInteger,
  onDownConstraintCheckNonNegativeInteger,
} = require("../utils/migration-utils.cjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(dbNameTables.mixeiroHasSubscription, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      subscription_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: dbNameTables.subscriptions,
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
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
      points: {
        defaultValue: 0,
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      activated_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex(dbNameTables.mixeiroHasSubscription, [
      "subscription_id",
      "mixeiro_id",
    ]);
    await onConstraintCheckNonNegativeInteger(
      queryInterface,
      dbNameTables.mixeiroHasSubscription,
      "points",
    );
    await onUpdateRowTrigger(
      queryInterface,
      dbNameTables.mixeiroHasSubscription,
    );
  },

  async down(queryInterface, Sequelize) {
    await onDownConstraintCheckNonNegativeInteger(
      queryInterface,
      dbNameTables.mixeiroHasSubscription,
      "points",
    );
    await onDownUpdateRowTrigger(
      queryInterface,
      dbNameTables.mixeiroHasSubscription,
    );
    await queryInterface.dropTable(dbNameTables.mixeiroHasSubscription);
  },
};
