const Order = require('../models/Order');

class OrderController {
  async getAllOrders(req, res) {
    try {
      const orders = await Order.findAll();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMyOrders(req, res) {
    try {
      const { userId } = req.query;
      const orders = await Order.findAll({ where: { userId } });
      res.json(orders);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createOrder(req, res) {
    try {
      const { userId, totalAmount, address, city, state, pincode, phone } = req.body;
      
      const order = await Order.create({
        orderId: require('crypto').randomUUID(),
        userId,
        totalAmount,
        discountAmount: 0,
        finalAmount: totalAmount,
        status: 'PENDING',
        paymentType: 'ONLINE',
        paymentStatus: 'PENDING',
        shippingAddress: `${address}, ${city}, ${state} - ${pincode}`
      });
      
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async createOrderFromCart(req, res) {
    try {
      const { userId, totalAmount, address, city, state, pincode, phone, paymentMethod, couponCode, discountAmount } = req.body;
      
      const order = await Order.create({
        orderId: require('crypto').randomUUID(),
        userId,
        totalAmount,
        discountAmount: discountAmount || 0,
        finalAmount: totalAmount - (discountAmount || 0),
        status: 'PENDING',
        paymentType: (paymentMethod || 'ONLINE').toUpperCase(),
        paymentStatus: 'PENDING',
        shippingAddress: `${address}, ${city}, ${state} - ${pincode}`,
        couponCode
      });
      
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;
      
      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      order.status = status.toUpperCase();
      if (status.toUpperCase() === 'DELIVERED') {
        order.deliveredDate = new Date();
      }
      
      await order.save();
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new OrderController();