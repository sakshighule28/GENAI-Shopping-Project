package com.clothingstore.service;

import com.clothingstore.entity.Review;
import com.clothingstore.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    public Review saveReview(Review review) {
        return reviewRepository.save(review);
    }
    
    public List<Review> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductId(productId);
    }
    
    public List<Review> getReviewsByUser(Long userId) {
        return reviewRepository.findByUserId(userId);
    }
    
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
}