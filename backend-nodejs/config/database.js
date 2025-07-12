const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'clothing_store',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  logging: false
});

module.exports = sequelize;