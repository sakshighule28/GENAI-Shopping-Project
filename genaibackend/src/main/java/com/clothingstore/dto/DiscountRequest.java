package com.clothingstore.dto;

import java.math.BigDecimal;

public class DiscountRequest {
    private String productName;
    private BigDecimal discountPercent;
    
    // Constructors
    public DiscountRequest() {}
    
    // Getters and Setters
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    
    public BigDecimal getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(BigDecimal discountPercent) { this.discountPercent = discountPercent; }
}