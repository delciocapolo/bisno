require("dotenv").config();

const common = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  dialect: process.env.DB_DIALECT || "postgres",
};

module.exports = {
  // Standard Sequelize environments
  development: common,
  production: common,

  // Aliases for common short values of NODE_ENV
  dev: common,
  prod: common,
};
