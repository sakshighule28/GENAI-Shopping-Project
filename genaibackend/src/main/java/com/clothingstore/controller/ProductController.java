package com.clothingstore.controller;

import com.clothingstore.entity.Product;
import com.clothingstore.entity.Category;
import com.clothingstore.service.ProductService;
import com.clothingstore.service.CategoryService;
import com.clothingstore.service.CouponService;
import com.clothingstore.entity.Coupon;
import com.clothingstore.dto.ProductRequest;
import com.clothingstore.dto.ProductUpdateRequest;
import com.clothingstore.dto.DiscountRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;


@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private CategoryService categoryService;
    
    @Autowired
    private CouponService couponService;
    
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return product != null ? ResponseEntity.ok(product) : ResponseEntity.notFound().build();
    }
    
    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Long categoryId) {
        return productService.getProductsByCategory(categoryId);
    }
    
    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String name) {
        return productService.searchProducts(name);
    }
    
    @GetMapping("/new")
    public List<Product> getNewProducts() {
        return productService.getNewProducts();
    }
    
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody ProductRequest request) {
        try {
            Category category = categoryService.getCategoryByName(request.getCategoryName());
            if (category == null) {
                return ResponseEntity.badRequest().build();
            }
            
            Product product = new Product();
            product.setName(request.getName());
            product.setDescription(request.getDescription());
            product.setBasePrice(request.getBasePrice());
            product.setUnitsInStock(request.getUnitsInStock());
            product.setImageUrl(request.getImageUrl());
            product.setBrand(request.getBrand());
            product.setSizes(request.getSizes());
            product.setCategoryId(category.getId());
            product.setAverageRating(0.0);
            product.setTotalReviews(0);
            product.setDiscountPercent(BigDecimal.ZERO);
            product.setDiscountedPrice(request.getBasePrice());
            
            Product savedProduct = productService.saveProduct(product);
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        if (productService.getProductById(id) != null) {
            product.setId(id);
            Product updatedProduct = productService.saveProduct(product);
            return ResponseEntity.ok(updatedProduct);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (productService.getProductById(id) != null) {
            productService.deleteProduct(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/update-by-name")
    public ResponseEntity<Product> updateProductByName(@RequestBody ProductUpdateRequest request) {
        try {
            Product updatedProduct = productService.updateProductByName(
                request.getProductName(),
                request.getBasePrice(),
                request.getUnitsInStock(),
                request.getSizes()
            );
            return updatedProduct != null ? ResponseEntity.ok(updatedProduct) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/apply-discount")
    public ResponseEntity<Product> applyDiscount(@RequestBody DiscountRequest request) {
        try {
            Product updatedProduct = productService.applyDiscount(
                request.getProductName(),
                request.getDiscountPercent()
            );
            return updatedProduct != null ? ResponseEntity.ok(updatedProduct) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/coupons")
    public ResponseEntity<Coupon> createCoupon(@RequestParam String code, @RequestParam BigDecimal discountPercent) {
        Coupon coupon = couponService.createCoupon(code, discountPercent);
        return ResponseEntity.ok(coupon);
    }
    

}