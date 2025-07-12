const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  basePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'base_price'
  },
  discountPercent: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    field: 'discount_percent'
  },
  discountedPrice: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'discounted_price'
  },
  unitsInStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'units_in_stock'
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'image_url'
  },
  brand: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  sizes: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  averageRating: {
    type: DataTypes.DOUBLE,
    defaultValue: 0.0,
    field: 'average_rating'
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_reviews'
  },
  categoryId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'category_id'
  },
  createdDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_date'
  },
  popularityScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'popularity_score'
  }
}, {
  tableName: 'products',
  timestamps: false
});

module.exports = Product;