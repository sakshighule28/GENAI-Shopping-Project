const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'order_id'
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'user_id'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_amount'
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    field: 'discount_amount'
  },
  finalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'final_amount'
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
    allowNull: false
  },
  paymentType: {
    type: DataTypes.ENUM('ONLINE', 'COD'),
    allowNull: false,
    field: 'payment_type'
  },
  paymentStatus: {
    type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED'),
    allowNull: false,
    field: 'payment_status'
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'shipping_address'
  },
  couponCode: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'coupon_code'
  },
  orderDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'order_date'
  },
  deliveredDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'delivered_date'
  }
}, {
  tableName: 'orders',
  timestamps: false
});

module.exports = Order;