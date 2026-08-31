"use strict";

const {
  dbNameTables,
} = require("../../../shared/constants/db-name-tables.cjs");

let SERVICES = [
  {
    name: "Canalizador",
    slug: "canalizador",
    icon: "fa6-solid:screwdriver-wrench",
    is_active: true,
    categorySlug: "construcao-reparacao",
  },
  {
    name: "Electricista",
    slug: "electricista",
    icon: "fa6-solid:bolt",
    is_active: true,
    categorySlug: "construcao-reparacao",
  },
  {
    name: "Cozinheira",
    slug: "cozinheira",
    icon: "fa6-solid:kitchen-set",
    is_active: true,
    categorySlug: "restauracao",
  },
  {
    name: "Motorista",
    slug: "motorista",
    icon: "fa6-solid:car",
    is_active: true,
    categorySlug: "transportes",
  },
  {
    name: "Téc. Telemóveis",
    slug: "tec-telemoveis",
    icon: "mdi:cellphone-cog",
    is_active: true,
    categorySlug: "construcao-reparacao",
  },
  {
    name: "Cabeleireira",
    slug: "cabeleireira",
    icon: "fa6-solid:scissors",
    is_active: true,
    categorySlug: "beleza-estetica",
  },
  {
    name: "Pedreiro",
    slug: "pedreiro",
    icon: "fa6-solid:trowel-bricks",
    is_active: true,
    categorySlug: "construcao-reparacao",
  },
  {
    name: "Costureira",
    slug: "costureira",
    icon: "fa6-solid:syringe",
    is_active: true,
    categorySlug: "beleza-estetica",
  },
  {
    name: "Limpeza",
    slug: "limpeza",
    icon: "fa6-solid:broom",
    is_active: true,
    categorySlug: "construcao-reparacao",
  },
  {
    name: "Jardineiro",
    slug: "jardineiro",
    icon: "fa6-solid:seedling",
    is_active: true,
    categorySlug: "construcao-reparacao",
  },
  {
    name: "Pintor",
    slug: "pintor",
    icon: "fa6-solid:paint-roller",
    is_active: true,
    categorySlug: "construcao-reparacao",
  },
  {
    name: "Frio & AC",
    slug: "frio",
    icon: "fa6-solid:snowflake",
    is_active: true,
    categorySlug: "construcao-reparacao",
  },
  {
    name: "Explicador",
    slug: "explicador",
    icon: "fa6-solid:screwdriver-wrench",
    is_active: true,
    categorySlug: "educacao",
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categoryServiceTableName = queryInterface.quoteIdentifier(
      dbNameTables.categoryServices,
    );
    const categories = await queryInterface.sequelize.query(
      `SELECT id, slug from ${categoryServiceTableName}`,
      { type: Sequelize.QueryTypes.SELECT },
    );
    SERVICES = SERVICES.map((service) => {
      const categoryService = categories.find(
        (category) => category.slug === service.categorySlug,
      );
      if (categoryService) service.category_id = categoryService.id;
      delete service.categorySlug;
      return service;
    });

    const servicesWithoutCategory = SERVICES.filter(
      (s) => s.category_id == null,
    );

    if (servicesWithoutCategory.length > 0) {
      const missing = servicesWithoutCategory.map((s) => s.slug).join(", ");
      throw new Error(`Services missing category: ${missing}`);
    }

    await queryInterface.bulkInsert(dbNameTables.services, SERVICES);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(dbNameTables.services, {
      slug: SERVICES.map((seed) => seed.slug),
    });
  },
};
