const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CouponUsage = sequelize.define('CouponUsage', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  couponId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'coupon_id'
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'user_id'
  },
  orderId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'order_id'
  },
  usedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'used_at'
  }
}, {
  tableName: 'coupon_usage',
  timestamps: false
});

module.exports = CouponUsage;