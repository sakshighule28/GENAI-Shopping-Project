const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products/coupons', couponRoutes);
app.use('/api/categories', categoryRoutes);

// Database connection
const sequelize = require('./config/database');

sequelize.sync()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(5000, () => {
      console.log(`Server running on port 5000`);
    });
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });