package com.clothingstore.service;

import com.clothingstore.entity.CartItem;
import com.clothingstore.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;
    
    public CartItem addToCart(Long userId, Long productId, Integer quantity, String size) {
        // Check for existing item with same product and size
        Optional<CartItem> existingItem = cartRepository.findByUserIdAndProductIdAndSize(userId, productId, size);
        
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartRepository.save(item);
        } else {
            CartItem newItem = new CartItem(userId, productId, quantity, size);
            return cartRepository.save(newItem);
        }
    }
    
    // Keep old method for backward compatibility
    public CartItem addToCart(Long userId, Long productId, Integer quantity) {
        return addToCart(userId, productId, quantity, null);
    }
    
    public List<CartItem> getCartItems(Long userId) {
        return cartRepository.findByUserId(userId);
    }
    
    public CartItem updateQuantity(Long userId, Long productId, Integer quantity) {
        Optional<CartItem> item = cartRepository.findByUserIdAndProductId(userId, productId);
        if (item.isPresent()) {
            item.get().setQuantity(quantity);
            return cartRepository.save(item.get());
        }
        return null;
    }
    
    @Transactional
    public void removeFromCart(Long userId, Long productId) {
        cartRepository.deleteByUserIdAndProductId(userId, productId);
    }
    
    @Transactional
    public void clearCart(Long userId) {
        cartRepository.deleteByUserId(userId);
    }
    
    public List<CartItem> getCartByUser(Long userId) {
        return cartRepository.findByUserId(userId);
    }
}