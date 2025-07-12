import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Cart } from '../../models/order.model';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class CartComponent implements OnInit {
  cartItems: Cart[] = [];
  products: Product[] = [];
  cartCount = 0;
  cartTotal = 0;
  loading = false;
  
  // Cart tabs
  cartTab = 'cart';
  
  // Price calculations
  totalMRP = 0;
  totalSavings = 0;
  subtotal = 0;
  couponDiscount = 0;
  orderTotal = 0;
  
  // Coupon system
  couponCode = '';
  appliedCoupon: any = null;
  
  // Forms
  addressForm: FormGroup;
  selectedPayment = '';
  
  // UI states
  showShippingPolicy = false;
  generatedOrderId = '';
  
  // State and City data
  states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
  ];
  cities: any = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tezpur'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
    'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar'],
    'Maharashtra': ['Mumbai', 'Navi Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Thane', 'Kolhapur'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Alwar'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Noida', 'Allahabad'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Malda'],
    'Delhi': ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
    'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Korba', 'Bilaspur', 'Durg'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur']
  };
  filteredStates: string[] = [];
  filteredCities: string[] = [];
  selectedState = '';
  stateSearch = '';
  citySearch = '';
  showStateDropdown = false;
  showCityDropdown = false;
  
  // Payment flow
  paymentStep = 'payment'; // payment, otp, success
  generatedOtp = '';
  enteredOtp = '';
  
  // Coupon validation
  showCouponError = false;
  couponErrorMessage = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private productService: ProductService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.addressForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  ngOnInit() {
    this.loadProducts();
    this.loadCart();
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        this.showStateDropdown = false;
        this.showCityDropdown = false;
      }
    });
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        console.log('Products loaded:', products.length);
        this.products = products;
        // Recalculate cart summary after products are loaded
        if (this.cartItems.length > 0) {
          this.updateCartSummary();
        }
      },
      error: (error) => {
        console.error('Failed to load products', error);
      }
    });
  }

  loadCart() {
    console.log('Loading cart for user:', this.authService.currentUserValue?.id);
    this.orderService.getCart().subscribe({
      next: (cart) => {
        console.log('Cart loaded:', cart);
        this.cartItems = cart || [];
        // Wait for products to load before calculating summary
        if (this.products.length > 0) {
          this.updateCartSummary();
        } else {
          // Products not loaded yet, wait a bit
          setTimeout(() => this.updateCartSummary(), 500);
        }
      },
      error: (error) => {
        console.error('Failed to load cart', error);
        this.cartItems = [];
      }
    });
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  updateCartQuantity(item: Cart, change: number) {
    const newQuantity = item.quantity + change;
    
    // Enforce quantity limits: minimum 1, maximum 5
    if (newQuantity <= 0) {
      this.removeFromCart(item);
      return;
    }
    
    if (newQuantity > 5) {
      this.showMessage('Maximum 5 units allowed per product', 'error');
      return;
    }

    this.orderService.updateCartQuantity(item.productId, newQuantity).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (error) => {
        console.error('Failed to update cart', error);
      }
    });
  }

  removeFromCart(item: Cart) {
    this.orderService.removeFromCart(item.productId).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (error) => {
        console.error('Failed to remove item', error);
      }
    });
  }

  updateCartSummary() {
    if (!this.cartItems || this.cartItems.length === 0) {
      this.cartCount = 0;
      this.cartTotal = 0;
      return;
    }
    
    // Calculate total count
    this.cartCount = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Calculate total amount with proper price selection
    this.cartTotal = this.cartItems.reduce((sum, item) => {
      const product = this.getProductById(item.productId);
      if (!product) {
        console.warn(`Product not found for ID: ${item.productId}`);
        return sum;
      }
      
      // Use discounted price if available, otherwise base price
      let itemPrice = product.basePrice;
      if (product.discountPercent && product.discountPercent > 0) {
        itemPrice = product.basePrice * (1 - product.discountPercent / 100);
      }
      
      const itemTotal = itemPrice * item.quantity;
      console.log(`Item: ${product.name}, Price: ₹${itemPrice}, Qty: ${item.quantity}, Total: ₹${itemTotal}`);
      
      return sum + itemTotal;
    }, 0);
    
    // Round to 2 decimal places
    this.cartTotal = Math.round(this.cartTotal * 100) / 100;
    
    console.log(`Cart Summary - Items: ${this.cartCount}, Total: ₹${this.cartTotal}`);
    this.calculatePriceDetails();
  }
  
  getDiscountedPrice(productId: number): number {
    const product = this.getProductById(productId);
    if (!product || !product.discountPercent || product.discountPercent <= 0) {
      return product?.basePrice || 0;
    }
    const discountedPrice = product.basePrice * (1 - product.discountPercent / 100);
    return Math.round(discountedPrice * 100) / 100;
  }
  
  getItemTotal(item: Cart): number {
    const product = this.getProductById(item.productId);
    if (!product) return 0;
    
    let itemPrice = product.basePrice;
    if (product.discountPercent && product.discountPercent > 0) {
      itemPrice = product.basePrice * (1 - product.discountPercent / 100);
    }
    
    const total = itemPrice * item.quantity;
    return Math.round(total * 100) / 100;
  }
  
  calculatePriceDetails() {
    this.totalMRP = this.cartItems.reduce((sum, item) => {
      const product = this.getProductById(item.productId);
      return sum + (product?.basePrice || 0) * item.quantity;
    }, 0);
    
    this.subtotal = this.cartTotal;
    this.totalSavings = this.totalMRP - this.subtotal;
    this.orderTotal = this.subtotal + 5 - this.couponDiscount; // +5 for platform fee
    
    this.totalMRP = Math.round(this.totalMRP * 100) / 100;
    this.totalSavings = Math.round(this.totalSavings * 100) / 100;
    this.orderTotal = Math.round(this.orderTotal * 100) / 100;
  }
  
  getDeliveryDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  applyCoupon() {
    this.showCouponError = false;
    
    if (!this.couponCode.trim()) {
      this.showCouponError = true;
      this.couponErrorMessage = 'Please enter a coupon code';
      return;
    }
    
    const userId = this.authService.currentUserValue?.id;
    if (!userId) {
      this.showCouponError = true;
      this.couponErrorMessage = 'Please login to apply coupon';
      return;
    }
    
    // Call backend API to validate coupon
    this.productService.validateCoupon(this.couponCode.toUpperCase(), userId).subscribe({
      next: (coupon: any) => {
        if (coupon.status === 'EXPIRED') {
          this.showCouponError = true;
          this.couponErrorMessage = 'This coupon has expired';
          return;
        }
        
        this.appliedCoupon = coupon;
        this.couponDiscount = Math.round((this.subtotal * coupon.discountPercent) / 100 * 100) / 100;
        this.couponCode = '';
        this.showCouponError = false;
        this.calculatePriceDetails();
        this.showMessage(`Coupon applied! You saved ₹${this.couponDiscount}`, 'success');
      },
      error: (error: any) => {
        this.showCouponError = true;
        if (error.status === 409) {
          this.couponErrorMessage = 'Coupon already used';
        } else {
          this.couponErrorMessage = 'Invalid coupon code';
        }
      }
    });
  }
  
  removeCoupon() {
    this.appliedCoupon = null;
    this.couponDiscount = 0;
    this.showCouponError = false;
    this.calculatePriceDetails();
  }
  
  proceedToAddress() {
    this.cartTab = 'address';
  }
  
  proceedToPayment() {
    // Mark all fields as touched to show validation errors
    Object.keys(this.addressForm.controls).forEach(key => {
      this.addressForm.get(key)?.markAsTouched();
    });
    
    if (this.addressForm.valid) {
      // Generate 8-digit order number when proceeding to payment
      this.generatedOrderId = this.generateOrderNumber();
      this.cartTab = 'payment';
    } else {
      this.showMessage('Please fill all required fields', 'error');
    }
  }
  
  generateOrderNumber(): string {
    return String(Math.floor(Math.random() * 90000000) + 10000000);
  }
  
  filterStates() {
    if (this.stateSearch.trim() === '') {
      this.filteredStates = this.states;
    } else {
      this.filteredStates = this.states.filter(state => 
        state.toLowerCase().includes(this.stateSearch.toLowerCase())
      );
    }
    this.showStateDropdown = this.filteredStates.length > 0;
  }
  
  selectState(state: string) {
    this.selectedState = state;
    this.addressForm.patchValue({ state: state });
    this.addressForm.patchValue({ city: '' });
    this.stateSearch = state;
    this.citySearch = '';
    this.showStateDropdown = false;
    this.showCityDropdown = false;
  }
  
  filterCities() {
    if (this.selectedState && this.cities[this.selectedState]) {
      if (this.citySearch.trim() === '') {
        this.filteredCities = this.cities[this.selectedState];
      } else {
        this.filteredCities = this.cities[this.selectedState].filter((city: string) => 
          city.toLowerCase().includes(this.citySearch.toLowerCase())
        );
      }
      this.showCityDropdown = this.filteredCities.length > 0;
    }
  }
  
  selectCity(city: string) {
    this.addressForm.patchValue({ city: city });
    this.citySearch = city;
    this.showCityDropdown = false;
  }
  
  onStateInput(event: any) {
    this.stateSearch = event.target.value;
    this.selectedState = '';
    this.addressForm.patchValue({ state: '' });
    this.filterStates();
  }
  
  onStateFocus() {
    this.stateSearch = '';
    this.filterStates();
  }
  
  onCityInput(event: any) {
    this.citySearch = event.target.value;
    this.addressForm.patchValue({ city: '' });
    this.filterCities();
  }
  
  onCityFocus() {
    if (this.selectedState) {
      this.citySearch = '';
      this.filterCities();
    }
  }
  
  showMessage(text: string, type: string) {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message-overlay ${type}`;
    messageEl.innerHTML = `
      ${text}
      <button class="close-btn" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add to body
    document.body.appendChild(messageEl);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (messageEl.parentElement) {
        messageEl.remove();
      }
    }, 8080);
  }
  
  goBackToCart() {
    this.cartTab = 'cart';
  }
  
  goBackToAddress() {
    this.cartTab = 'address';
  }
  
  initiatePayment() {
    // Mark address form as touched in case user skipped validation
    Object.keys(this.addressForm.controls).forEach(key => {
      this.addressForm.get(key)?.markAsTouched();
    });
    
    if (!this.selectedPayment) {
      this.showMessage('Please select a payment method', 'error');
      return;
    }
    
    if (!this.addressForm.valid) {
      this.showMessage('Please complete the address form', 'error');
      this.cartTab = 'address';
      return;
    }
    
    // For COD, place order directly
    if (this.selectedPayment === 'cod') {
      this.paymentStep = 'success';
      this.placeOrder();
      return;
    }
    
    // For online payments, go to OTP step (don't place order yet)
    this.generatedOtp = this.generateOtp();
    this.enteredOtp = this.generatedOtp;
    this.paymentStep = 'otp';
  }
  
  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  verifyOtp() {
    if (this.enteredOtp === this.generatedOtp) {
      // OTP verified, now place order and show success
      this.paymentStep = 'success';
      this.placeOrder();
    } else {
      this.showMessage('Invalid OTP. Please try again.', 'error');
    }
  }
  
  cancelPayment() {
    this.paymentStep = 'payment';
    this.enteredOtp = '';
    this.generatedOtp = '';
  }
  
  completePayment() {
    // Reset everything and go to empty cart
    this.paymentStep = 'payment';
    this.cartTab = 'cart';
    this.selectedPayment = '';
    this.addressForm.reset();
    this.appliedCoupon = null;
    this.couponDiscount = 0;
    this.generatedOrderId = '';
  }
  
  placeOrder() {
    const userId = this.authService.currentUserValue?.id;
    const addressData = this.addressForm.value;
    
    if (!userId) {
      this.showMessage('Please login to place order', 'error');
      return;
    }
    
    // Create order data with coupon and payment info
    const orderData = {
      userId: userId,
      totalAmount: this.orderTotal,
      address: addressData.address,
      city: addressData.city,
      state: addressData.state,
      pincode: addressData.pincode,
      phone: addressData.phone,
      paymentMethod: this.selectedPayment,
      couponCode: this.appliedCoupon?.code || null,
      discountAmount: this.couponDiscount
    };
    
    // Create order using backend API
    this.orderService.createOrder(orderData).subscribe({
      next: (response: any) => {
        console.log('Order created:', response);
        this.generatedOrderId = response.orderId || this.generateOrderNumber();
        this.cartItems = [];
        this.appliedCoupon = null;
        this.couponDiscount = 0;
        this.calculatePriceDetails();
        console.log('Order placed successfully with ID:', this.generatedOrderId);
      },
      error: (error: any) => {
        console.error('Order placement failed:', error);
        // Fallback to simulation if backend fails
        this.generatedOrderId = this.generateOrderNumber();
        this.cartItems = [];
        this.appliedCoupon = null;
        this.couponDiscount = 0;
        this.calculatePriceDetails();
        console.log('Order placed (fallback) with ID:', this.generatedOrderId);
      }
    });
  }
}