const CartItem = require('../models/CartItem');
const { Op } = require('sequelize');

class CartController {
  async addToCart(req, res) {
    try {
      const { userId, productId, quantity, size } = req.body;
      
      const existingItem = await CartItem.findOne({
        where: { userId, productId }
      });
      
      if (existingItem) {
        existingItem.quantity += quantity;
        await existingItem.save();
        return res.json(existingItem);
      }
      
      const cartItem = await CartItem.create({
        userId,
        productId,
        quantity,
        size
      });
      
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getCartItems(req, res) {
    try {
      const { userId } = req.params;
      const cartItems = await CartItem.findAll({
        where: { userId }
      });
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateQuantity(req, res) {
    try {
      const { userId, productId, quantity } = req.body;
      
      const cartItem = await CartItem.findOne({
        where: { userId, productId }
      });
      
      if (!cartItem) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
      
      cartItem.quantity = quantity;
      await cartItem.save();
      
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async removeFromCart(req, res) {
    try {
      const { productId } = req.params;
      const { userId } = req.query;
      
      await CartItem.destroy({
        where: { userId, productId }
      });
      
      res.json({ message: 'Item removed from cart' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async clearCart(req, res) {
    try {
      const { userId } = req.params;
      
      await CartItem.destroy({
        where: { userId }
      });
      
      res.json({ message: 'Cart cleared' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new CartController();