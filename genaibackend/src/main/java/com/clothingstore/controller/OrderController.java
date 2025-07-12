package com.clothingstore.controller;

import com.clothingstore.entity.Order;
import com.clothingstore.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }
    
    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(@RequestParam Long userId) {
        try {
            return ResponseEntity.ok(orderService.getOrdersByUser(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        return order != null ? ResponseEntity.ok(order) : ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Map<String, Object> orderData) {
        try {
            Long userId = Long.valueOf(orderData.get("userId").toString());
            BigDecimal totalAmount = new BigDecimal(orderData.get("totalAmount").toString());
            String address = orderData.get("address").toString();
            String city = orderData.get("city").toString();
            String state = orderData.get("state").toString();
            String pincode = orderData.get("pincode").toString();
            String phone = orderData.get("phone").toString();
            
            Order order = orderService.createOrderFromCart(userId, totalAmount, address, city, state, pincode, phone, "online", null, BigDecimal.ZERO);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/from-cart")
    public ResponseEntity<Order> createOrderFromCart(@RequestBody Map<String, Object> orderData) {
        try {
            Long userId = Long.valueOf(orderData.get("userId").toString());
            BigDecimal totalAmount = new BigDecimal(orderData.get("totalAmount").toString());
            String address = orderData.get("address").toString();
            String city = orderData.get("city").toString();
            String state = orderData.get("state").toString();
            String pincode = orderData.get("pincode").toString();
            String phone = orderData.get("phone").toString();
            String paymentMethod = orderData.getOrDefault("paymentMethod", "online").toString();
            String couponCode = orderData.get("couponCode") != null ? orderData.get("couponCode").toString() : null;
            BigDecimal discountAmount = orderData.get("discountAmount") != null ? new BigDecimal(orderData.get("discountAmount").toString()) : BigDecimal.ZERO;
            
            Order order = orderService.createOrderFromCart(userId, totalAmount, address, city, state, pincode, phone, paymentMethod, couponCode, discountAmount);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            Order.OrderStatus status = Order.OrderStatus.valueOf(request.get("status").toUpperCase());
            String reason = request.get("reason");
            Order updatedOrder = orderService.updateOrderStatus(id, status, reason);
            return updatedOrder != null ? ResponseEntity.ok(updatedOrder) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}