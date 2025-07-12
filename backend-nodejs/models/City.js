const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const City = sequelize.define('City', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  stateId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'state_id'
  }
}, {
  tableName: 'cities',
  timestamps: false
});

module.exports = City;