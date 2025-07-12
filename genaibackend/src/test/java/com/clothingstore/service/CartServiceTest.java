package com.clothingstore.service;

import com.clothingstore.entity.CartItem;
import com.clothingstore.repository.CartRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @InjectMocks
    private CartService cartService;



    @Test
    void testAddToCart() {
        // Given
        Long userId = 1L;
        Long productId = 1L;
        Integer quantity = 2;
        String size = "M";

        CartItem cartItem = new CartItem();
        cartItem.setUserId(userId);
        cartItem.setProductId(productId);
        cartItem.setQuantity(quantity);
        cartItem.setSize(size);

        when(cartRepository.findByUserIdAndProductIdAndSize(userId, productId, size))
            .thenReturn(Optional.empty());
        when(cartRepository.save(any(CartItem.class))).thenReturn(cartItem);

        // When
        CartItem result = cartService.addToCart(userId, productId, quantity, size);

        // Then
        assertNotNull(result);
        assertEquals(userId, result.getUserId());
        assertEquals(productId, result.getProductId());
        assertEquals(quantity, result.getQuantity());
        assertEquals(size, result.getSize());
        verify(cartRepository).save(any(CartItem.class));
    }

    @Test
    void testAddToCartExistingItem() {
        // Given
        Long userId = 1L;
        Long productId = 1L;
        Integer quantity = 2;
        String size = "M";

        CartItem existingItem = new CartItem();
        existingItem.setUserId(userId);
        existingItem.setProductId(productId);
        existingItem.setQuantity(1);
        existingItem.setSize(size);

        when(cartRepository.findByUserIdAndProductIdAndSize(userId, productId, size))
            .thenReturn(Optional.of(existingItem));
        when(cartRepository.save(any(CartItem.class))).thenReturn(existingItem);

        // When
        CartItem result = cartService.addToCart(userId, productId, quantity, size);

        // Then
        assertNotNull(result);
        assertEquals(3, result.getQuantity()); // 1 + 2
        verify(cartRepository).save(existingItem);
    }

    @Test
    void testGetCartByUser() {
        // Given
        Long userId = 1L;
        CartItem item1 = new CartItem();
        item1.setUserId(userId);
        item1.setProductId(1L);

        CartItem item2 = new CartItem();
        item2.setUserId(userId);
        item2.setProductId(2L);

        when(cartRepository.findByUserId(userId)).thenReturn(Arrays.asList(item1, item2));

        // When
        List<CartItem> result = cartService.getCartByUser(userId);

        // Then
        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getProductId());
        assertEquals(2L, result.get(1).getProductId());
    }

    @Test
    void testClearCart() {
        // Given
        Long userId = 1L;

        // When
        cartService.clearCart(userId);

        // Then
        verify(cartRepository).deleteByUserId(userId);
    }

    @Test
    void testRemoveFromCart() {
        // Given
        Long userId = 1L;
        Long productId = 1L;

        // When
        cartService.removeFromCart(userId, productId);

        // Then
        verify(cartRepository).deleteByUserIdAndProductId(userId, productId);
    }
}