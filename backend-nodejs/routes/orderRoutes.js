const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');

router.get('/', OrderController.getAllOrders);
router.get('/my-orders', OrderController.getMyOrders);
router.get('/:id', OrderController.getOrderById);
router.post('/', OrderController.createOrder);
router.post('/from-cart', OrderController.createOrderFromCart);
router.put('/:id/status', OrderController.updateOrderStatus);

module.exports = router;