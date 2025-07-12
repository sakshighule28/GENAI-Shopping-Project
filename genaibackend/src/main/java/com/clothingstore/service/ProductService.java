package com.clothingstore.service;

import com.clothingstore.entity.Product;
import com.clothingstore.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }
    
    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }
    
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
    
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    
    public List<Product> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }
    
    public List<Product> getNewProducts() {
        return productRepository.findNewProducts();
    }
    
    public Product findByName(String name) {
        return productRepository.findByName(name);
    }
    
    public Product updateProductByName(String productName, BigDecimal price, Integer stock, String sizes) {
        Product product = findByName(productName);
        if (product != null) {
            if (price != null) product.setBasePrice(price);
            if (stock != null) product.setUnitsInStock(stock);
            if (sizes != null) product.setSizes(sizes);
            return productRepository.save(product);
        }
        return null;
    }
    
    public void updateProductRating(Long productId, Double newRating) {
        Product product = getProductById(productId);
        if (product != null) {
            int totalReviews = product.getTotalReviews() + 1;
            double currentTotal = product.getAverageRating() * product.getTotalReviews();
            double newAverage = (currentTotal + newRating) / totalReviews;
            
            product.setAverageRating(Math.round(newAverage * 100.0) / 100.0);
            product.setTotalReviews(totalReviews);
            productRepository.save(product);
        }
    }
    
    public Product applyDiscount(String productName, BigDecimal discountPercent) {
        Product product = findByName(productName);
        if (product != null) {
            product.setDiscountPercent(discountPercent);
            return productRepository.save(product);
        }
        return null;
    }
}