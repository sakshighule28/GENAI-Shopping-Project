const Coupon = require('../models/Coupon');
const CouponUsage = require('../models/CouponUsage');

class CouponController {
  async validateCoupon(req, res) {
    try {
      const { code } = req.params;
      const { userId } = req.query;
      
      const coupon = await Coupon.findOne({ where: { code } });
      
      if (!coupon) {
        return res.status(404).json({ error: 'Coupon not found' });
      }
      
      if (coupon.status !== 'ACTIVE') {
        return res.status(400).json({ error: 'Coupon not active' });
      }
      
      const usage = await CouponUsage.findOne({
        where: { userId, couponId: coupon.id }
      });
      
      if (usage) {
        return res.status(409).json({ error: 'Coupon already used' });
      }
      
      res.json(coupon);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCoupon(req, res) {
    try {
      const { code } = req.params;
      const coupon = await Coupon.findOne({ where: { code } });
      
      if (!coupon) {
        return res.status(404).json({ error: 'Coupon not found' });
      }
      
      res.json(coupon);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CouponController();