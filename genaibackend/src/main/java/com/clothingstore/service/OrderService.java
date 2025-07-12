package com.clothingstore.service;

import com.clothingstore.entity.Order;
import com.clothingstore.entity.OrderItem;
import com.clothingstore.entity.Product;
import com.clothingstore.entity.CartItem;
import com.clothingstore.entity.Coupon;
import com.clothingstore.entity.CouponUsage;
import com.clothingstore.repository.OrderRepository;
import com.clothingstore.repository.OrderItemRepository;
import com.clothingstore.repository.CouponRepository;
import com.clothingstore.repository.CouponUsageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private CartService cartService;
    
    @Autowired
    private CouponRepository couponRepository;
    
    @Autowired
    private CouponUsageRepository couponUsageRepository;
    

    
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }
    
    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }
    
    public Order createOrderFromCart(Long userId, BigDecimal totalAmount, String address, String city, String state, String pincode, String phone) {
        return createOrderFromCart(userId, totalAmount, address, city, state, pincode, phone, "online", null, BigDecimal.ZERO);
    }
    
    public Order createOrderFromCart(Long userId, BigDecimal totalAmount, String address, String city, String state, String pincode, String phone, String paymentMethod, String couponCode, BigDecimal discountAmount) {
        try {
            // Generate 8-digit order ID
            String orderId = String.valueOf((int)(Math.random() * 90000000) + 10000000);
            
            // Get cart items first
            List<CartItem> cartItems = cartService.getCartByUser(userId);
            if (cartItems.isEmpty()) {
                throw new RuntimeException("Cart is empty");
            }
            
            // Calculate total items
            int totalItems = cartItems.stream().mapToInt(CartItem::getQuantity).sum();
            
            // Create and save order
            Order order = new Order();
            order.setUserId(userId);
            order.setOrderId(orderId);
            order.setTotalAmount(totalAmount);
            order.setTotalItems(totalItems);
            order.setShippingAddress(address);
            order.setCity(city);
            order.setState(state);
            order.setPincode(pincode);
            order.setPhone(phone);
            order.setStatus(Order.OrderStatus.PLACED);
            
            // Set payment type and status based on payment method
            if ("cod".equalsIgnoreCase(paymentMethod)) {
                order.setPaymentType(Order.PaymentType.COD);
                order.setPaymentStatus(Order.PaymentStatus.PENDING);
            } else {
                order.setPaymentType(Order.PaymentType.ONLINE);
                order.setPaymentStatus(Order.PaymentStatus.COMPLETED);
            }
            
            order.setOrderDate(java.time.LocalDateTime.now());
            
            // Set coupon details if provided
            if (couponCode != null && !couponCode.isEmpty()) {
                order.setCouponCode(couponCode);
                order.setDiscountAmount(discountAmount);
            }
            
            order = orderRepository.save(order);
            System.out.println("Order saved with ID: " + order.getId() + ", OrderID: " + order.getOrderId());
            
            // Create order items from cart items
            for (CartItem cartItem : cartItems) {
                Product product = productService.getProductById(cartItem.getProductId());
                if (product == null) {
                    System.out.println("Product not found for ID: " + cartItem.getProductId());
                    continue;
                }
                
                OrderItem orderItem = new OrderItem();
                orderItem.setOrderId(order.getId());
                orderItem.setProductId(cartItem.getProductId());
                orderItem.setQuantity(cartItem.getQuantity());
                orderItem.setSize(cartItem.getSize());
                orderItem.setProductName(product.getName());
                
                // Set discount percent
                Integer discountPercent = 0;
                if (product.getDiscountPercent() != null) {
                    discountPercent = product.getDiscountPercent().intValue();
                }
                orderItem.setDiscountPercent(discountPercent);
                
                // Calculate prices
                BigDecimal unitPrice = product.getDiscountedPrice() != null ? product.getDiscountedPrice() : product.getBasePrice();
                orderItem.setPrice(unitPrice);
                
                // Calculate total cost: price * quantity
                BigDecimal totalCost = unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
                orderItem.setTotalCost(totalCost);
                
                orderItemRepository.save(orderItem);
                System.out.println("OrderItem saved: " + product.getName() + ", Qty: " + cartItem.getQuantity() + ", Price: " + unitPrice + ", Total: " + totalCost);
            }
            
            // Mark coupon as used if provided
            if (couponCode != null && !couponCode.isEmpty()) {
                markCouponAsUsed(userId, couponCode, orderId);
            }
            
            // Clear cart after successful order creation
            cartService.clearCart(userId);
            System.out.println("Cart cleared for user: " + userId);
            
            return order;
            
        } catch (Exception e) {
            System.err.println("Error creating order: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create order: " + e.getMessage());
        }
    }
    
    private void markCouponAsUsed(Long userId, String couponCode, String orderId) {
        try {
            Coupon coupon = couponRepository.findByCode(couponCode).orElse(null);
            if (coupon != null) {
                CouponUsage usage = new CouponUsage(userId, coupon.getId(), orderId);
                couponUsageRepository.save(usage);
                System.out.println("Coupon " + couponCode + " marked as used for user " + userId);
            }
        } catch (Exception e) {
            System.err.println("Error marking coupon as used: " + e.getMessage());
        }
    }
    
    public Order updateOrderStatus(Long orderId, Order.OrderStatus status, String reason) {
        Order order = getOrderById(orderId);
        if (order != null) {
            Order.OrderStatus oldStatus = order.getStatus();
            order.setStatus(status);
            if (reason != null) {
                order.setStatusReason(reason);
            }
            
            if (status == Order.OrderStatus.CONFIRMED && oldStatus == Order.OrderStatus.PLACED) {
                reduceStockForOrder(orderId);
                order.setDeliveryDate(LocalDateTime.now().plusHours(2));
            } else if (status == Order.OrderStatus.CANCELLED) {
                restoreStockForOrder(orderId);
            }
            
            return orderRepository.save(order);
        }
        return null;
    }
    
    private void reduceStockForOrder(Long orderId) {
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        for (OrderItem item : items) {
            Product product = productService.getProductById(item.getProductId());
            if (product != null) {
                int newStock = product.getUnitsInStock() - item.getQuantity();
                product.setUnitsInStock(Math.max(0, newStock));
                productService.saveProduct(product);
            }
        }
    }
    
    private void restoreStockForOrder(Long orderId) {
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        for (OrderItem item : items) {
            Product product = productService.getProductById(item.getProductId());
            if (product != null) {
                int newStock = product.getUnitsInStock() + item.getQuantity();
                product.setUnitsInStock(newStock);
                productService.saveProduct(product);
            }
        }
    }
}