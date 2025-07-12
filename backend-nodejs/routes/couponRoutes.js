const express = require('express');
const router = express.Router();
const CouponController = require('../controllers/CouponController');

router.get('/validate/:code', CouponController.validateCoupon);
router.get('/:code', CouponController.getCoupon);

module.exports = router;