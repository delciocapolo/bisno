"use strict";

const {
  dbNameTables,
} = require("../../../shared/constants/db-name-tables.cjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(dbNameTables.subscriptions, "price", {
      defaultValue: 0,
      allowNull: false,
      type: Sequelize.INTEGER,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
