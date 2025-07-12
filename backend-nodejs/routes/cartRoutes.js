const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');

router.post('/add', CartController.addToCart);
router.get('/user/:userId', CartController.getCartItems);
router.put('/update', CartController.updateQuantity);
router.delete('/remove/:productId', CartController.removeFromCart);
router.delete('/clear/:userId', CartController.clearCart);

module.exports = router;