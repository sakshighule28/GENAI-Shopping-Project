package com.clothingstore.service;

import com.clothingstore.entity.Coupon;
import com.clothingstore.entity.CouponUsage;
import com.clothingstore.repository.CouponRepository;
import com.clothingstore.repository.CouponUsageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class CouponService {
    
    @Autowired
    private CouponRepository couponRepository;
    
    @Autowired
    private CouponUsageRepository couponUsageRepository;
    
    public Coupon createCoupon(String code, BigDecimal discountPercent) {
        Coupon coupon = new Coupon(code, discountPercent);
        return couponRepository.save(coupon);
    }
    
    public Optional<Coupon> findByCodeForUser(String code, Long userId) {
        Optional<Coupon> coupon = couponRepository.findByCode(code);
        if (coupon.isPresent()) {
            // Check if user has already used this coupon
            boolean hasUsed = couponUsageRepository.existsByUserIdAndCouponId(userId, coupon.get().getId());
            if (hasUsed) {
                return Optional.empty(); // Return empty if already used
            }
        }
        return coupon;
    }
    
    public void markCouponAsUsed(Long userId, Long couponId) {
        CouponUsage usage = new CouponUsage(userId, couponId);
        couponUsageRepository.save(usage);
    }
}