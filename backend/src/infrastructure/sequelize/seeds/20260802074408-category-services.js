"use strict";

const {
  dbNameTables,
} = require("../../../shared/constants/db-name-tables.cjs");

const SEEDS = [
  {
    name: "Construção e Reparação",
    slug: "construcao-reparacao",
    is_active: true,
  },
  { name: "Tecnologia", slug: "tecnologia", is_active: true },
  { name: "Transportes", slug: "transportes", is_active: true },
  { name: "Serviços Domésticos", slug: "servicos-domesticos", is_active: true },
  { name: "Beleza e Estética", slug: "beleza-estetica", is_active: true },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(dbNameTables.categoryServices, SEEDS);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(dbNameTables.categoryServices, {
      slug: SEEDS.map((seed) => seed.slug),
    });
  },
};
