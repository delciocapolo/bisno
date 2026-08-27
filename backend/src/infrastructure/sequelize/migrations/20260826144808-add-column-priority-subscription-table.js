"use strict";

const {
  dbNameTables,
} = require("../../../shared/constants/db-name-tables.cjs");
const {
  onConstraintCheckNonNegativeInteger,
  onDownConstraintCheckNonNegativeInteger,
} = require("../utils/migration-utils.cjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(dbNameTables.subscriptions, "priority", {
      defaultValue: 1,
      allowNull: false,
      type: Sequelize.INTEGER,
    });

    await onConstraintCheckNonNegativeInteger(
      queryInterface,
      dbNameTables.subscriptions,
      "priority",
    );
  },

  async down(queryInterface, Sequelize) {
    await onDownConstraintCheckNonNegativeInteger(
      queryInterface,
      dbNameTables.subscriptions,
      "priority",
    );
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
