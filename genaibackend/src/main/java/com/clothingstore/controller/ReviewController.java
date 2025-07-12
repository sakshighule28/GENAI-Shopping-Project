package com.clothingstore.controller;

import com.clothingstore.entity.Review;
import com.clothingstore.entity.User;
import com.clothingstore.service.ReviewService;
import com.clothingstore.service.UserService;
import com.clothingstore.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ProductService productService;
    
    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody Review review, Principal principal) {
        if (principal != null) {
            User user = userService.findByUsername(principal.getName());
            if (user != null) {
                review.setUserId(user.getId());
                Review savedReview = reviewService.saveReview(review);
                
                // Update product rating
                productService.updateProductRating(review.getProductId(), review.getRating().doubleValue());
                
                return ResponseEntity.ok(savedReview);
            }
        }
        return ResponseEntity.badRequest().build();
    }
    
    @GetMapping("/product/{productId}")
    public List<Review> getProductReviews(@PathVariable Long productId) {
        return reviewService.getReviewsByProduct(productId);
    }
    
    @GetMapping("/my-reviews")
    public ResponseEntity<List<Review>> getMyReviews(Principal principal) {
        if (principal != null) {
            User user = userService.findByUsername(principal.getName());
            if (user != null) {
                return ResponseEntity.ok(reviewService.getReviewsByUser(user.getId()));
            }
        }
        return ResponseEntity.badRequest().build();
    }
}