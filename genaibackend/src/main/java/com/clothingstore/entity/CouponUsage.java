package com.clothingstore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupon_usage")
public class CouponUsage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "coupon_id", nullable = false)
    private Long couponId;
    
    @Column(name = "used_date", nullable = false)
    private LocalDateTime usedDate;
    
    @Column(name = "order_id")
    private String orderId;
    
    // Constructors
    public CouponUsage() {}
    
    public CouponUsage(Long userId, Long couponId, String orderId) {
        this.userId = userId;
        this.couponId = couponId;
        this.orderId = orderId;
        this.usedDate = LocalDateTime.now();
    }
    
    public CouponUsage(Long userId, Long couponId) {
        this.userId = userId;
        this.couponId = couponId;
        this.usedDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Long getCouponId() { return couponId; }
    public void setCouponId(Long couponId) { this.couponId = couponId; }
    
    public LocalDateTime getUsedDate() { return usedDate; }
    public void setUsedDate(LocalDateTime usedDate) { this.usedDate = usedDate; }
    
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
}