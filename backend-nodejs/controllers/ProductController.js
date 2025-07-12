const Product = require('../models/Product');
const Category = require('../models/Category');
const { Op } = require('sequelize');

class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await Product.findAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProductsByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const products = await Product.findAll({
        where: { categoryId }
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async searchProducts(req, res) {
    try {
      const { name } = req.query;
      const products = await Product.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%`
          }
        }
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getNewProducts(req, res) {
    try {
      const products = await Product.findAll({
        order: [['createdDate', 'DESC']],
        limit: 10
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const { categoryName, ...productData } = req.body;
      
      const category = await Category.findOne({ where: { name: categoryName } });
      if (!category) {
        return res.status(400).json({ error: 'Category not found' });
      }

      const product = await Product.create({
        ...productData,
        categoryId: category.id,
        averageRating: 0.0,
        totalReviews: 0,
        discountPercent: 0,
        discountedPrice: productData.basePrice
      });

      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      await product.update(req.body);
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      await product.destroy();
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ProductController();