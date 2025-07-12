package com.clothingstore.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String description;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal discountPercent = BigDecimal.ZERO;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal discountedPrice;
    
    @Column(nullable = false)
    private Integer unitsInStock;
    
    private String imageUrl;
    private String brand;
    private String sizes; // Available sizes as comma-separated string
    
    private Double averageRating;
    
    private Integer totalReviews;
    
    @Column(name = "category_id")
    private Long categoryId;
    
    @Column(name = "created_date")
    private LocalDateTime createdDate;
    
    @Column(name = "popularity_score")
    private Integer popularityScore = 0;
    
    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
    }
    
    // Constructors
    public Product() {}
    
    public Product(String name, String description, BigDecimal basePrice, Integer unitsInStock, Long categoryId) {
        this.name = name;
        this.description = description;
        this.basePrice = basePrice;
        this.unitsInStock = unitsInStock;
        this.categoryId = categoryId;
        this.averageRating = 0.0;
        this.totalReviews = 0;
        this.discountPercent = BigDecimal.ZERO;
        this.discountedPrice = basePrice;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { 
        this.basePrice = basePrice;
        calculateDiscountedPrice();
    }
    
    public BigDecimal getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(BigDecimal discountPercent) { 
        this.discountPercent = discountPercent;
        calculateDiscountedPrice();
    }
    
    public BigDecimal getDiscountedPrice() { return discountedPrice; }
    public void setDiscountedPrice(BigDecimal discountedPrice) { this.discountedPrice = discountedPrice; }
    
    private void calculateDiscountedPrice() {
        if (basePrice != null && discountPercent != null) {
            BigDecimal discount = basePrice.multiply(discountPercent).divide(new BigDecimal("100"));
            this.discountedPrice = basePrice.subtract(discount);
        }
    }
    
    public Integer getUnitsInStock() { return unitsInStock; }
    public void setUnitsInStock(Integer unitsInStock) { this.unitsInStock = unitsInStock; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    
    public String getSizes() { return sizes; }
    public void setSizes(String sizes) { this.sizes = sizes; }
    
    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }
    
    public Integer getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }
    
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    
    public Integer getPopularityScore() { return popularityScore; }
    public void setPopularityScore(Integer popularityScore) { this.popularityScore = popularityScore; }
}