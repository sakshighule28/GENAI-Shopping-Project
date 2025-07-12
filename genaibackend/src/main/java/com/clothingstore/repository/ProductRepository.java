package com.clothingstore.repository;

import com.clothingstore.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT p FROM Product p WHERE p.createdDate >= (SELECT MAX(p2.createdDate) FROM Product p2 WHERE DATE(p2.createdDate) = (SELECT MAX(DATE(p3.createdDate)) FROM Product p3))")
    List<Product> findNewProducts();
    List<Product> findByBrand(String brand);
    Product findByName(String name);
}