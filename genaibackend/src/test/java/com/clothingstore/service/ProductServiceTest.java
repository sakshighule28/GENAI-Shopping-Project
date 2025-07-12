package com.clothingstore.service;

import com.clothingstore.entity.Product;
import com.clothingstore.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;



    @Test
    void testGetAllProducts() {
        Product product1 = new Product();
        product1.setId(1L);
        product1.setName("Product 1");

        Product product2 = new Product();
        product2.setId(2L);
        product2.setName("Product 2");

        when(productRepository.findAll()).thenReturn(Arrays.asList(product1, product2));

        List<Product> result = productService.getAllProducts();

        assertEquals(2, result.size());
        assertEquals("Product 1", result.get(0).getName());
        assertEquals("Product 2", result.get(1).getName());
    }

    @Test
    void testGetProductById() {
        Product product = new Product();
        product.setId(1L);
        product.setName("Test Product");

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        Product result = productService.getProductById(1L);

        assertNotNull(result);
        assertEquals("Test Product", result.getName());
    }

    @Test
    void testGetProductByIdNotFound() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        Product result = productService.getProductById(999L);

        assertNull(result);
    }

    @Test
    void testSaveProduct() {
        Product product = new Product();
        product.setName("New Product");
        product.setBasePrice(new BigDecimal("100.00"));

        when(productRepository.save(any(Product.class))).thenReturn(product);

        Product result = productService.saveProduct(product);

        assertNotNull(result);
        assertEquals("New Product", result.getName());
        verify(productRepository).save(product);
    }

    @Test
    void testDeleteProduct() {
        Long productId = 1L;

        productService.deleteProduct(productId);

        verify(productRepository).deleteById(productId);
    }

    @Test
    void testSearchProducts() {
        Product product = new Product();
        product.setId(1L);
        product.setName("Test Shirt");

        when(productRepository.findByNameContainingIgnoreCase("shirt"))
            .thenReturn(Arrays.asList(product));

        List<Product> result = productService.searchProducts("shirt");

        assertEquals(1, result.size());
        assertEquals("Test Shirt", result.get(0).getName());
    }

    @Test
    void testGetProductsByCategory() {
        Product product = new Product();
        product.setId(1L);
        product.setName("Category Product");
        product.setCategoryId(1L);

        when(productRepository.findByCategoryId(1L))
            .thenReturn(Arrays.asList(product));

        List<Product> result = productService.getProductsByCategory(1L);

        assertEquals(1, result.size());
        assertEquals("Category Product", result.get(0).getName());
    }
}