"use strict";

const {
  dbNameTables,
} = require("../../../shared/constants/db-name-tables.cjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(dbNameTables.mixeiros, "email", {
      unique: true,
      allowNull: true,
      type: Sequelize.STRING,
    });

    await queryInterface.changeColumn(dbNameTables.mixeiros, "email", {
      allowNull: true,
      type: Sequelize.STRING,
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
