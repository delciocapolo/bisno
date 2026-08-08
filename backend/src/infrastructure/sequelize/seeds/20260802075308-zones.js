"use strict";

const {
  dbNameTables,
} = require("../../../shared/constants/db-name-tables.cjs");

const SEEDS = [
  { name: "Viana", slug: "viana", is_active: true },
  { name: "Cazenga", slug: "cazenga", is_active: true },
  { name: "Maianga", slug: "maianga", is_active: true },
  { name: "Ingombota", slug: "ingombota", is_active: true },
  { name: "Capolo II", slug: "capolo-ii", is_active: true },
  { name: "Kilamba", slug: "kilamba", is_active: true },
  { name: "Talatona", slug: "talatona", is_active: true },
  { name: "Rangel", slug: "rangel", is_active: true },
  { name: "Samba", slug: "samba", is_active: true },
  { name: "Cacuaco", slug: "cacuaco", is_active: true },
  { name: "Benfica", slug: "benfica", is_active: true },
  { name: "Sambizanga", slug: "sambizanga", is_active: true },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(dbNameTables.zones, SEEDS);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(dbNameTables.zones, {
      slug: SEEDS.map((seed) => seed.slug),
    });
  },
};
