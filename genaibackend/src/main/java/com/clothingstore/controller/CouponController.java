package com.clothingstore.controller;

import com.clothingstore.entity.Coupon;
import com.clothingstore.entity.CouponUsage;
import com.clothingstore.repository.CouponRepository;
import com.clothingstore.repository.CouponUsageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/products/coupons")
@CrossOrigin(origins = "*")
public class CouponController {
    
    @Autowired
    private CouponRepository couponRepository;
    
    @Autowired
    private CouponUsageRepository couponUsageRepository;
    
    @GetMapping("/validate/{code}")
    public ResponseEntity<Coupon> validateCoupon(@PathVariable String code, @RequestParam Long userId) {
        Optional<Coupon> couponOpt = couponRepository.findByCode(code);
        
        if (!couponOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Coupon coupon = couponOpt.get();
        
        // Check if coupon is active
        if (coupon.getStatus() != Coupon.CouponStatus.ACTIVE) {
            return ResponseEntity.badRequest().build();
        }
        
        // Check if user has already used this coupon
        Optional<CouponUsage> usageOpt = couponUsageRepository.findByUserIdAndCouponId(userId, coupon.getId());
        if (usageOpt.isPresent()) {
            return ResponseEntity.status(409).build(); // Conflict - already used
        }
        
        return ResponseEntity.ok(coupon);
    }
    
    @GetMapping("/{code}")
    public ResponseEntity<Coupon> getCoupon(@PathVariable String code) {
        Optional<Coupon> coupon = couponRepository.findByCode(code);
        return coupon.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}