const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  discountPercent: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    field: 'discount_percent'
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'EXPIRED'),
    allowNull: false
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    field: 'usage_limit'
  },
  usedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'used_count'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expiry_date'
  }
}, {
  tableName: 'coupons',
  timestamps: false
});

module.exports = Coupon;