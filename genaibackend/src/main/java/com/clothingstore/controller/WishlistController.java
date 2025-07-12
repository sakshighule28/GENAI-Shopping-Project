package com.clothingstore.controller;

import com.clothingstore.entity.Wishlist;
import com.clothingstore.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {
    
    @Autowired
    private WishlistRepository wishlistRepository;
    
    @PostMapping("/add")
    public ResponseEntity<?> addToWishlist(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            Long productId = Long.valueOf(request.get("productId").toString());
            
            if (wishlistRepository.findByUserIdAndProductId(userId, productId).isPresent()) {
                return ResponseEntity.ok(Map.of("message", "Already in wishlist"));
            }
            
            Wishlist wishlist = new Wishlist(userId, productId);
            wishlistRepository.save(wishlist);
            return ResponseEntity.ok(Map.of("message", "Added to wishlist"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Wishlist>> getWishlist(@PathVariable Long userId) {
        return ResponseEntity.ok(wishlistRepository.findByUserId(userId));
    }
    
    @DeleteMapping("/remove")
    @Transactional
    public ResponseEntity<?> removeFromWishlist(@RequestParam Long userId, @RequestParam Long productId) {
        try {
            wishlistRepository.deleteByUserIdAndProductId(userId, productId);
            return ResponseEntity.ok(Map.of("message", "Removed from wishlist"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}