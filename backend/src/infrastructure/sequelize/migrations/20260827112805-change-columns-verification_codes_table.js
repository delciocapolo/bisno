"use strict";

const {
  dbNameTables,
} = require("../../../shared/constants/db-name-tables.cjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      dbNameTables.verificationCode,
      "mixeiro_id",
    );

    await queryInterface.addColumn(dbNameTables.verificationCode, "mobile", {
      allowNull: true,
      type: Sequelize.STRING(30),
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
