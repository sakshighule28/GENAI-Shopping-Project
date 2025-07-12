package com.clothingstore.service;

import com.clothingstore.entity.*;
import com.clothingstore.repository.*;
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
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    
    @Mock
    private OrderItemRepository orderItemRepository;
    
    @Mock
    private ProductService productService;
    
    @Mock
    private CartService cartService;
    
    @Mock
    private CouponRepository couponRepository;
    
    @Mock
    private CouponUsageRepository couponUsageRepository;
    
    @InjectMocks
    private OrderService orderService;



    @Test
    void testCreateOrderFromCart() {
        // Given
        Long userId = 1L;
        BigDecimal totalAmount = new BigDecimal("100.00");
        String address = "Test Address";
        String city = "Test City";
        String state = "Test State";
        String pincode = "123456";
        String phone = "9876543210";

        CartItem cartItem = new CartItem();
        cartItem.setProductId(1L);
        cartItem.setQuantity(2);
        cartItem.setSize("M");

        Product product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setBasePrice(new BigDecimal("50.00"));
        product.setDiscountedPrice(new BigDecimal("45.00"));

        Order savedOrder = new Order();
        savedOrder.setId(1L);
        savedOrder.setOrderId("12345678");

        when(cartService.getCartByUser(userId)).thenReturn(Arrays.asList(cartItem));
        when(productService.getProductById(1L)).thenReturn(product);
        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

        // When
        Order result = orderService.createOrderFromCart(userId, totalAmount, address, city, state, pincode, phone);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(cartService).clearCart(userId);
        verify(orderItemRepository).save(any(OrderItem.class));
    }

    @Test
    void testGetOrdersByUser() {
        // Given
        Long userId = 1L;
        Order order1 = new Order();
        order1.setId(1L);
        Order order2 = new Order();
        order2.setId(2L);

        when(orderRepository.findByUserIdOrderByOrderDateDesc(userId))
            .thenReturn(Arrays.asList(order1, order2));

        // When
        List<Order> result = orderService.getOrdersByUser(userId);

        // Then
        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getId());
        assertEquals(2L, result.get(1).getId());
    }

    @Test
    void testUpdateOrderStatus() {
        // Given
        Long orderId = 1L;
        Order order = new Order();
        order.setId(orderId);
        order.setStatus(Order.OrderStatus.PLACED);

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        // When
        Order result = orderService.updateOrderStatus(orderId, Order.OrderStatus.CONFIRMED, "Test reason");

        // Then
        assertNotNull(result);
        assertEquals(Order.OrderStatus.CONFIRMED, result.getStatus());
        assertEquals("Test reason", result.getStatusReason());
    }
}