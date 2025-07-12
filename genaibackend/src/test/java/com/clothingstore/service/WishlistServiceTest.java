package com.clothingstore.service;

import com.clothingstore.entity.Wishlist;
import com.clothingstore.repository.WishlistRepository;

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
class WishlistServiceTest {

    @Mock
    private WishlistRepository wishlistRepository;

    @InjectMocks
    private WishlistService wishlistService;



    @Test
    void testAddToWishlist() {
        Long userId = 1L;
        Long productId = 1L;

        Wishlist wishlistItem = new Wishlist();
        wishlistItem.setUserId(userId);
        wishlistItem.setProductId(productId);

        when(wishlistRepository.findByUserIdAndProductId(userId, productId))
            .thenReturn(Optional.empty());
        when(wishlistRepository.save(any(Wishlist.class))).thenReturn(wishlistItem);

        Wishlist result = wishlistService.addToWishlist(userId, productId);

        assertNotNull(result);
        assertEquals(userId, result.getUserId());
        assertEquals(productId, result.getProductId());
        verify(wishlistRepository).save(any(Wishlist.class));
    }

    @Test
    void testAddToWishlistAlreadyExists() {
        Long userId = 1L;
        Long productId = 1L;

        Wishlist existingItem = new Wishlist();
        existingItem.setUserId(userId);
        existingItem.setProductId(productId);

        when(wishlistRepository.findByUserIdAndProductId(userId, productId))
            .thenReturn(Optional.of(existingItem));

        Wishlist result = wishlistService.addToWishlist(userId, productId);

        assertEquals(existingItem, result);
        verify(wishlistRepository, never()).save(any(Wishlist.class));
    }

    @Test
    void testGetWishlistByUser() {
        Long userId = 1L;
        
        Wishlist item1 = new Wishlist();
        item1.setUserId(userId);
        item1.setProductId(1L);

        Wishlist item2 = new Wishlist();
        item2.setUserId(userId);
        item2.setProductId(2L);

        when(wishlistRepository.findByUserId(userId)).thenReturn(Arrays.asList(item1, item2));

        List<Wishlist> result = wishlistService.getUserWishlist(userId);

        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getProductId());
        assertEquals(2L, result.get(1).getProductId());
    }

    @Test
    void testRemoveFromWishlist() {
        Long userId = 1L;
        Long productId = 1L;

        wishlistService.removeFromWishlist(userId, productId);

        verify(wishlistRepository).deleteByUserIdAndProductId(userId, productId);
    }
}