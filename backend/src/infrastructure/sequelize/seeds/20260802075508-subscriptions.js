"use strict";

const {
  dbNameTables,
} = require("../../../shared/constants/db-name-tables.cjs");

const SEEDS = [
  {
    name: "Básico",
    slug: "basico",
    points: 50,
    is_active: true,
  },
  {
    name: "Standard",
    slug: "standard",
    points: 150,
    is_active: true,
  },
  {
    name: "Premium",
    slug: "premium",
    points: 500,
    is_active: true,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(dbNameTables.subscriptions, SEEDS);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(dbNameTables.zones, {
      slug: SEEDS.map((seed) => seed.slug),
    });
  },
};
