import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { CartComponent } from './cart.component';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let productService: jasmine.SpyObj<ProductService>;
  let orderService: jasmine.SpyObj<OrderService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['currentUserValue']);
    const productSpy = jasmine.createSpyObj('ProductService', ['getAllProducts', 'validateCoupon', 'getNewProducts']);
    const orderSpy = jasmine.createSpyObj('OrderService', ['createOrder', 'getCart']);

    await TestBed.configureTestingModule({
      imports: [CartComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ProductService, useValue: productSpy },
        { provide: OrderService, useValue: orderSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    orderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty cart', () => {
    Object.defineProperty(authService, 'currentUserValue', { value: { id: 1, username: 'test', role: 'CUSTOMER' as any }, writable: true });
    productService.getAllProducts.and.returnValue(of([]));
    orderService.getCart.and.returnValue(of([]));
    
    component.ngOnInit();
    
    expect(component.cartItems).toEqual([]);
    expect(component.cartCount).toBe(0);
    expect(component.orderTotal).toBe(0);
  });

  it('should calculate price details correctly', () => {
    // Setup mocks first
    Object.defineProperty(authService, 'currentUserValue', { value: { id: 1, username: 'test', role: 'CUSTOMER' as any }, writable: true });
    productService.getAllProducts.and.returnValue(of([]));
    productService.getNewProducts.and.returnValue(of([]));
    orderService.getCart.and.returnValue(of([]));
    
    // Set up test data directly without calling ngOnInit
    component.cartItems = [
      { userId: 1, productId: 1, quantity: 2, size: 'M' },
      { userId: 1, productId: 2, quantity: 1, size: 'L' }
    ];
    component.products = [
      { id: 1, name: 'Product 1', description: 'Test', basePrice: 100, unitsInStock: 10, categoryId: 1 },
      { id: 2, name: 'Product 2', description: 'Test', basePrice: 200, unitsInStock: 10, categoryId: 1 }
    ];

    // Call the calculation methods directly
    component.updateCartSummary();

    expect(component.subtotal).toBe(400); // (100*2) + (200*1)
    expect(component.cartCount).toBe(3); // 2 + 1
  });

  it('should apply coupon successfully', () => {
    const mockCoupon = { code: 'SAVE10', discountPercent: 10, status: 'ACTIVE' };
    Object.defineProperty(authService, 'currentUserValue', { value: { id: 1, username: 'test', role: 'CUSTOMER' as any }, writable: true });
    productService.validateCoupon.and.returnValue(of(mockCoupon));
    
    component.subtotal = 100;
    component.couponCode = 'SAVE10';
    
    component.applyCoupon();

    expect(component.appliedCoupon).toEqual(mockCoupon);
    expect(component.couponDiscount).toBe(10);
    expect(component.showCouponError).toBeFalsy();
  });

  it('should handle invalid coupon', () => {
    Object.defineProperty(authService, 'currentUserValue', { value: { id: 1, username: 'test', role: 'CUSTOMER' as any }, writable: true });
    productService.validateCoupon.and.returnValue(throwError({ status: 404 }));
    
    component.couponCode = 'INVALID';
    
    component.applyCoupon();

    expect(component.showCouponError).toBeTruthy();
    expect(component.couponErrorMessage).toBe('Invalid coupon code');
    expect(component.appliedCoupon).toBeNull();
  });

  it('should place order successfully', () => {
    const mockOrder = { id: 1, orderId: '12345678', userId: 1, totalAmount: 100, status: 'PLACED' as any };
    Object.defineProperty(authService, 'currentUserValue', { value: { id: 1, username: 'test', role: 'CUSTOMER' as any }, writable: true });
    orderService.createOrder.and.returnValue(of(mockOrder));
    
    component.addressForm.patchValue({
      address: 'Test Address',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      phone: '9876543210'
    });
    component.selectedPayment = 'online';
    component.orderTotal = 100;

    component.placeOrder();

    expect(component.generatedOrderId).toBe('12345678');
    expect(component.cartItems).toEqual([]);
  });

  it('should validate address form', () => {
    // Setup mocks first
    Object.defineProperty(authService, 'currentUserValue', { value: { id: 1, username: 'test', role: 'CUSTOMER' as any }, writable: true });
    productService.getAllProducts.and.returnValue(of([]));
    productService.getNewProducts.and.returnValue(of([]));
    orderService.getCart.and.returnValue(of([]));
    
    // Initialize component first
    component.ngOnInit();
    
    expect(component.addressForm.valid).toBeFalsy();

    // Use the correct form field names from the actual component
    component.addressForm.patchValue({
      fullName: 'Test User',
      phone: '9876543210',
      address: 'Test Address',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456'
    });

    expect(component.addressForm.valid).toBeTruthy();
  });

  it('should generate order number', () => {
    const orderNumber = component.generateOrderNumber();
    
    expect(orderNumber).toMatch(/^\d{8}$/);
    expect(orderNumber.length).toBe(8);
  });
});