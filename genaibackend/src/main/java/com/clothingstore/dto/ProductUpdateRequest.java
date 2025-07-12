package com.clothingstore.dto;

import java.math.BigDecimal;

public class ProductUpdateRequest {
    private String productName;
    private BigDecimal basePrice;
    private Integer unitsInStock;
    private String sizes;
    
    // Constructors
    public ProductUpdateRequest() {}
    
    // Getters and Setters
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    
    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }
    
    public Integer getUnitsInStock() { return unitsInStock; }
    public void setUnitsInStock(Integer unitsInStock) { this.unitsInStock = unitsInStock; }
    
    public String getSizes() { return sizes; }
    public void setSizes(String sizes) { this.sizes = sizes; }
}