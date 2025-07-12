import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { ProductService } from './services/product.service';
import { OrderService } from './services/order.service';
import { User } from './models/user.model';
import { Product, Category } from './models/product.model';
import { Order, Cart, OrderStatus } from './models/order.model';
import { CartComponent } from './components/cart/cart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,CartComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './product-detail.scss', './wishlist.scss', './filters.scss', './sort-filter.scss']
})
export class AppComponent implements OnInit {
  title = 'Scripted';
  
  // Auth related
  showAuthForm = true;
  authMode: 'login' | 'register' = 'login';
  currentUser: User | null = null;
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  
  // UI State
  activeTab: any = 'home';
  loading = false;
  message = { text: '', type: '' };
  
  // Data
  products: Product[] = [];
  categories: Category[] = [];
  filteredProducts: Product[] = [];
  cartItems: Cart[] | null = null;
  customerOrders: Order[] | null = null;
  allOrders: Order[] = [];
  
  // Filters
  searchTerm = '';
  selectedCategory = '';
  selectedBrand = '';
  selectedPriceRange = '';
  brands: string[] = [];
  selectedCategories: number[] = [];
  selectedBrands: string[] = [];
  selectedPriceRanges: string[] = [];
  
  // Sort filters
  showSortFilter = false;
  sortOptions = {
    latest: false,
    priceLowToHigh: false,
    priceHighToLow: false,
    popularity: false
  };
  
  // Forms
  productForm!: FormGroup;
  categoryForm!: FormGroup;
  checkoutForm!: FormGroup;
  showProductForm = false;
  showCategoryForm = false;
  showCheckout = false;
  editingProduct: Product | null = null;
  
  // Cart
  cartCount = 0;
  cartTotal = 0;
  paymentMethod = '';
  
  // Product Detail
  selectedProduct: Product | null = null;
  selectedSize = '';
  selectedQuantity = 1;
  relatedProducts: Product[] = [];
  
  // Wishlist
  wishlistItems: any[] | null = null;
  wishlistProductIds: Set<number> = new Set();
  
  // New Products
  newProducts: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private productService: ProductService,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.showAuthForm = !user;
      if (user) {
        this.loadInitialData();
        if (user.role === 'CUSTOMER') {
          this.activeTab = 'home';
          this.loadCart();
        } else {
          this.activeTab = 'dashboard';
        }
      }
    });
  }

  initializeForms() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['CUSTOMER', Validators.required]
    });

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      basePrice: ['', [Validators.required, Validators.min(0)]],
      unitsInStock: ['', [Validators.required, Validators.min(0)]],
      brand: [''],
      sizes: [''],
      imageUrl: [''],
      categoryName: ['', Validators.required]
    });

    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.checkoutForm = this.fb.group({
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  // Auth Methods
  login() {
    console.log('Login button clicked');
    console.log('Form valid:', this.loginForm.valid);
    console.log('Form value:', this.loginForm.value);
    
    if (this.loginForm.valid) {
      console.log('Making login request to:', 'http://localhost:8080/api/auth/login');
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login success response:', response);
          this.loading = false;
          this.showMessage('Login successful!', 'success');
        },
        error: (error) => {
          console.error('Login error details:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          this.loading = false;
          this.showMessage('Login failed: ' + (error.error?.error || error.error?.message || error.message || 'Unknown error'), 'error');
        }
      });
    } else {
      console.log('Form is invalid');
      console.log('Username errors:', this.loginForm.get('username')?.errors);
      console.log('Password errors:', this.loginForm.get('password')?.errors);
    }
  }

  register() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          this.showMessage('Registration successful! Please login.', 'success');
          this.switchAuthMode('login');
        },
        error: (error) => {
          this.loading = false;
          this.showMessage('Registration failed. Please try again.', 'error');
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.showAuthForm = true;
    this.activeTab = 'home';
    this.clearMessage();
  }

  switchAuthMode(mode: 'login' | 'register') {
    this.authMode = mode;
    this.clearMessage();
  }

  // Data Loading
  loadInitialData() {
    this.loadProducts();
    this.loadCategories();
    this.loadNewProducts();
    if (this.isAdmin()) {
      this.loadAllOrders();
    } else {
      this.loadCustomerOrders();
    }
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products.map(p => ({ ...p, in_wishlist: false }));
        this.filteredProducts = this.products;
        this.extractBrands();
        if (this.isCustomer()) {
          this.loadWishlist();
        } else {
          this.updateWishlistProducts();
        }
      },
      error: (error) => {
        this.showMessage('Failed to load products', 'error');
      }
    });
  }

  loadCategories() {
    this.productService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        this.showMessage('Failed to load categories', 'error');
      }
    });
  }

  loadCart() {
    console.log('Loading cart for user:', this.authService.currentUserValue?.id);
    this.orderService.getCart().subscribe({
      next: (cart) => {
        console.log('Cart loaded:', cart);
        this.cartItems = cart || [];
        this.updateCartSummary();
      },
      error: (error) => {
        console.error('Failed to load cart', error);
        this.cartItems = [];
      }
    });
  }

  loadCustomerOrders() {
    this.orderService.getMyOrders().subscribe({
      next: (orders) => {
        this.customerOrders = orders || [];
      },
      error: (error) => {
        console.error('Failed to load orders', error);
        this.customerOrders = [];
      }
    });
  }

  loadAllOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.allOrders = orders;
      },
      error: (error) => {
        console.error('Failed to load orders', error);
      }
    });
  }
  
  loadNewProducts() {
    this.productService.getNewProducts().subscribe({
      next: (products) => {
        this.newProducts = products;
      },
      error: (error) => {
        console.error('Failed to load new products', error);
      }
    });
  }
  
  goToLatestProducts() {
    this.setActiveTab('products');
    this.sortOptions.latest = true;
    this.applySortFilter();
  }

  // Utility Methods
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isCustomer(): boolean {
    return this.authService.isCustomer();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab as any;
    this.clearMessage();
  }

  showMessage(text: string, type: string) {
    this.message = { text, type };
    setTimeout(() => this.clearMessage(), 8080);
  }

  clearMessage() {
    this.message = { text: '', type: '' };
  }

  // Product Methods
  extractBrands() {
    const brandSet = new Set<string>();
    this.products.forEach(product => {
      if (product.brand) {
        brandSet.add(product.brand);
      }
    });
    this.brands = Array.from(brandSet);
  }

  searchProducts() {
    if (this.searchTerm.trim()) {
      this.productService.searchProducts(this.searchTerm).subscribe({
        next: (products) => {
          this.filteredProducts = products;
        },
        error: (error) => {
          this.showMessage('Search failed', 'error');
        }
      });
    } else {
      this.applyFilters();
    }
  }

  applyFilters() {
    let filtered = [...this.products];

    // Category filters
    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter(p => this.selectedCategories.includes(p.categoryId));
    }

    // Brand filters
    if (this.selectedBrands.length > 0) {
      filtered = filtered.filter(p => p.brand && this.selectedBrands.includes(p.brand));
    }

    // Price range filters
    if (this.selectedPriceRanges.length > 0) {
      filtered = filtered.filter(p => {
        const price = p.discountedPrice || p.basePrice;
        return this.selectedPriceRanges.some(range => {
          if (range === '10000+') {
            return price >= 10000;
          }
          const [min, max] = range.split('-').map(Number);
          return price >= min && price <= max;
        });
      });
    }

    this.filteredProducts = filtered;
  }

  filterByCategory(categoryId: number) {
    this.selectedCategories = [categoryId];
    this.setActiveTab('products');
    this.applyFilters();
  }
  
  applySortFilter() {
    let sorted = [...this.filteredProducts];
    
    if (this.sortOptions.latest) {
      sorted = sorted.sort((a, b) => new Date(b.createdDate || '').getTime() - new Date(a.createdDate || '').getTime());
    }
    
    if (this.sortOptions.priceLowToHigh) {
      sorted = sorted.sort((a, b) => (a.discountedPrice || a.basePrice) - (b.discountedPrice || b.basePrice));
    }
    
    if (this.sortOptions.priceHighToLow) {
      sorted = sorted.sort((a, b) => (b.discountedPrice || b.basePrice) - (a.discountedPrice || a.basePrice));
    }
    
    if (this.sortOptions.popularity) {
      sorted = sorted.sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));
    }
    
    this.filteredProducts = sorted;
  }
  
  applySortFilterAndClose() {
    this.applySortFilter();
    this.showSortFilter = false;
  }
  
  clearSortFilter() {
    this.sortOptions = {
      latest: false,
      priceLowToHigh: false,
      priceHighToLow: false,
      popularity: false
    };
    this.applySortFilter();
    this.showSortFilter = false;
  }

  viewProduct(product: Product) {
    this.selectedProduct = product;
    this.selectedSize = '';
    this.selectedQuantity = 1;
    this.loadRelatedProducts(product);
    this.loadProductReviews(product.id!);
  }
  
  closeProductDetail() {
    this.selectedProduct = null;
    this.selectedSize = '';
    this.selectedQuantity = 1;
    this.productReviews = [];
  }
  
  loadProductReviews(productId: number) {
    this.orderService.getProductReviews(productId).subscribe({
      next: (reviews) => {
        this.productReviews = reviews;
      },
      error: (error) => {
        console.error('Failed to load reviews', error);
        this.productReviews = [];
      }
    });
  }
  
  getStarArray(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }
  
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
  
  removeNotification(index: number) {
    this.notifications.splice(index, 1);
  }
  
  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  }
  
  getSizes(sizes: string): string[] {
    return sizes ? sizes.split(',').map(s => s.trim()) : [];
  }
  
  selectSize(size: string) {
    this.selectedSize = size;
    this.showSizeError = false;
  }
  
  increaseQuantity() {
    if (this.selectedProduct && this.selectedQuantity < Math.min(this.selectedProduct.unitsInStock, 5)) {
      this.selectedQuantity++;
    }
  }
  
  decreaseQuantity() {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
    }
  }
  
  canAddToCart(): boolean {
    if (!this.selectedProduct) return false;
    if (this.selectedProduct.sizes && !this.selectedSize) return false;
    return this.selectedQuantity > 0 && this.selectedQuantity <= this.selectedProduct.unitsInStock;
  }
  
  addSelectedToCart() {
    // Check if product has sizes and none is selected
    if (this.selectedProduct?.sizes && !this.selectedSize) {
      this.showSizeError = true;
      return;
    }
    this.showSizeError = false;
    
    // Validate quantity limits
    if (this.selectedQuantity > 5) {
      this.showMessage('Maximum 5 units allowed per product', 'error');
      return;
    }
    
    this.orderService.addToCart(this.selectedProduct!.id!, this.selectedQuantity, this.selectedSize).subscribe({
      next: () => {
        this.loadCart();
        this.showMessage('Product added to cart!', 'success');
        this.closeProductDetail();
      },
      error: (error) => {
        console.error('Failed to add to cart', error);
        this.showMessage('Failed to add product to cart', 'error');
      }
    });
  }
  
  addToCart(product: Product, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    
    if (!this.currentUser) {
      this.showMessage('Please login to add items to cart', 'error');
      return;
    }

    // Check if product has sizes and none is selected
    if (product.sizes) {
      this.showMessage('Please select a size first', 'error');
      this.viewProduct(product);
      return;
    }

    this.orderService.addToCart(product.id!, 1).subscribe({
      next: () => {
        this.loadCart();
        this.showMessage('Product added to cart!', 'success');
      },
      error: (error) => {
        console.error('Failed to add to cart', error);
        this.showMessage('Failed to add product to cart', 'error');
      }
    });
  }
  
  clearFilters() {
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.selectedPriceRange = '';
    this.searchTerm = '';
    this.selectedCategories = [];
    this.selectedBrands = [];
    this.selectedPriceRanges = [];
    this.applyFilters();
  }
  
  toggleCategoryFilter(categoryId: number) {
    const index = this.selectedCategories.indexOf(categoryId);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(categoryId);
    }
  }
  
  toggleBrandFilter(brand: string) {
    const index = this.selectedBrands.indexOf(brand);
    if (index > -1) {
      this.selectedBrands.splice(index, 1);
    } else {
      this.selectedBrands.push(brand);
    }
  }
  
  togglePriceFilter(priceRange: string) {
    const index = this.selectedPriceRanges.indexOf(priceRange);
    if (index > -1) {
      this.selectedPriceRanges.splice(index, 1);
    } else {
      this.selectedPriceRanges.push(priceRange);
    }
  }
  
  toggleAllCategories() {
    if (this.selectedCategories.length === this.categories.length) {
      this.selectedCategories = [];
    } else {
      this.selectedCategories = this.categories.map(c => c.id!);
    }
  }
  
  toggleAllBrands() {
    if (this.selectedBrands.length === this.brands.length) {
      this.selectedBrands = [];
    } else {
      this.selectedBrands = [...this.brands];
    }
  }
  
  // Wishlist Methods
  loadWishlist() {
    console.log('Loading wishlist for user:', this.authService.currentUserValue?.id);
    this.orderService.getWishlist().subscribe({
      next: (wishlist) => {
        console.log('Wishlist loaded:', wishlist);
        this.wishlistItems = wishlist || [];
        this.wishlistProductIds = new Set((wishlist || []).map(item => item.productId));
        
        // Update in_wishlist property for all products
        this.products.forEach(product => {
          product.in_wishlist = this.wishlistProductIds.has(product.id!);
        });
        this.filteredProducts = [...this.products];
        this.updateWishlistProducts();
        
        console.log('Wishlist product IDs:', this.wishlistProductIds);
      },
      error: (error) => {
        console.error('Failed to load wishlist', error);
        this.wishlistItems = [];
      }
    });
  }
  
  toggleWishlist(product: Product, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    
    if (product.in_wishlist) {
      this.removeFromWishlist(product.id!);
    } else {
      this.addToWishlist(product.id!);
    }
  }
  
  addToWishlist(productId: number) {
    console.log('Adding to wishlist:', productId);
    this.orderService.addToWishlist(productId).subscribe({
      next: (response) => {
        console.log('Added to wishlist response:', response);
        this.wishlistProductIds.add(productId);
        
        // Update product in_wishlist property
        const product = this.products.find(p => p.id === productId);
        if (product) {
          product.in_wishlist = true;
        }
        
        this.showMessage('Added to wishlist!', 'success');
        this.loadWishlist();
      },
      error: (error) => {
        console.error('Failed to add to wishlist:', error);
        this.showMessage('Failed to add to wishlist', 'error');
      }
    });
  }
  
  removeFromWishlist(productId: number) {
    this.orderService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.wishlistProductIds.delete(productId);
        
        // Update product in_wishlist property
        const product = this.products.find(p => p.id === productId);
        if (product) {
          product.in_wishlist = false;
        }
        
        this.showMessage('Removed from wishlist', 'info');
        this.loadWishlist();
      },
      error: (error) => {
        this.showMessage('Failed to remove from wishlist', 'error');
      }
    });
  }
  
  isInWishlist(productId: number): boolean {
    const inWishlist = this.wishlistProductIds.has(productId);
    console.log(`Product ${productId} in wishlist:`, inWishlist);
    return inWishlist;
  }
  
  loadRelatedProducts(product: Product) {
    // Get products from same category, excluding current product
    this.relatedProducts = this.products
      .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
      .slice(0, 4);
  }
  
  // Cart Methods

  updateCartQuantity(item: Cart, change: number) {
    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      this.removeFromCart(item);
      return;
    }

    this.orderService.updateCartQuantity(item.productId, newQuantity).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (error) => {
        this.showMessage('Failed to update cart', 'error');
      }
    });
  }

  removeFromCart(item: Cart) {
    this.orderService.removeFromCart(item.productId).subscribe({
      next: () => {
        this.loadCart();
        this.showMessage('Item removed from cart', 'info');
      },
      error: (error) => {
        this.showMessage('Failed to remove item', 'error');
      }
    });
  }

  nextWishlistItem() {
    if (this.currentWishlistIndex < this.wishlistProducts.length - 1) {
      this.currentWishlistIndex++;
    }
  }
  
  previousWishlistItem() {
    if (this.currentWishlistIndex > 0) {
      this.currentWishlistIndex--;
    }
  }
  
  updateCartSummary() {
    if (!this.cartItems) {
      this.cartCount = 0;
      this.cartTotal = 0;
      return;
    }
    this.cartCount = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    this.cartTotal = this.cartItems.reduce((sum, item) => {
      const product = this.getProductById(item.productId);
      const price = product?.discountedPrice || product?.basePrice || 0;
      return sum + (price * item.quantity);
    }, 0);
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }
  
  wishlistProducts: Product[] = [];
  currentWishlistIndex = 0;
  showSizeError = false;
  productReviews: any[] = [];
  
  // Notifications
  showNotifications = false;
  notifications: any[] = [];
  
  updateWishlistProducts() {
    if (!this.wishlistItems || !this.products || this.wishlistItems.length === 0) {
      this.wishlistProducts = [];
      return;
    }
    
    this.wishlistProducts = this.wishlistItems
      .map(item => {
        const product = this.products.find(p => p.id === item.productId);
        if (product) {
          return { ...product, in_wishlist: true };
        }
        return null;
      })
      .filter(product => product !== null) as Product[];
    
    console.log('Wishlist products updated:', this.wishlistProducts);
    this.currentWishlistIndex = 0;
    this.cdr.detectChanges();
  }

  proceedToCheckout() {
    this.showCheckout = true;
  }

  closeCheckout() {
    this.showCheckout = false;
    this.paymentMethod = '';
  }

  placeOrder() {
    if (this.checkoutForm.valid && this.paymentMethod) {
      const orderData = {
        ...this.checkoutForm.value,
        totalAmount: this.cartTotal
      };

      this.orderService.createOrder(orderData).subscribe({
        next: (order) => {
          this.showMessage('Order placed successfully!', 'success');
          this.closeCheckout();
          this.loadCart();
          this.loadCustomerOrders();
          this.setActiveTab('orders');
        },
        error: (error) => {
          this.showMessage('Failed to place order', 'error');
        }
      });
    }
  }

  // Admin Methods
  saveProduct() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      
      if (this.editingProduct) {
        // Update existing product
        this.productService.updateProduct(this.editingProduct.id!, productData).subscribe({
          next: (product) => {
            this.showMessage('Product updated successfully!', 'success');
            this.closeProductForm();
            this.loadProducts();
          },
          error: (error) => {
            this.showMessage('Failed to update product', 'error');
          }
        });
      } else {
        // Create new product
        this.productService.createProduct(productData).subscribe({
          next: (product) => {
            this.showMessage('Product created successfully!', 'success');
            this.closeProductForm();
            this.loadProducts();
          },
          error: (error) => {
            this.showMessage('Failed to create product', 'error');
          }
        });
      }
    }
  }

  editProduct(product: Product) {
    this.editingProduct = product;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      unitsInStock: product.unitsInStock,
      brand: product.brand,
      sizes: product.sizes,
      imageUrl: product.imageUrl,
      categoryName: this.getCategoryName(product.categoryId)
    });
    this.showProductForm = true;
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.showMessage('Product deleted successfully!', 'success');
          this.loadProducts();
        },
        error: (error) => {
          this.showMessage('Failed to delete product', 'error');
        }
      });
    }
  }

  showDiscountForm(product: Product) {
    const discount = prompt('Enter discount percentage (0-100):');
    if (discount !== null) {
      const discountPercent = parseFloat(discount);
      if (discountPercent >= 0 && discountPercent <= 100) {
        this.productService.applyDiscount({
          productName: product.name,
          discountPercent: discountPercent
        }).subscribe({
          next: (updatedProduct) => {
            this.showMessage('Discount applied successfully!', 'success');
            this.loadProducts();
          },
          error: (error) => {
            this.showMessage('Failed to apply discount', 'error');
          }
        });
      }
    }
  }

  closeProductForm() {
    this.showProductForm = false;
    this.editingProduct = null;
    this.productForm.reset();
  }

  saveCategory() {
    if (this.categoryForm.valid) {
      this.productService.createCategory(this.categoryForm.value).subscribe({
        next: (category) => {
          this.showMessage('Category created successfully!', 'success');
          this.closeCategoryForm();
          this.loadCategories();
        },
        error: (error) => {
          this.showMessage('Failed to create category', 'error');
        }
      });
    }
  }

  deleteCategory(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.productService.deleteCategory(id).subscribe({
        next: () => {
          this.showMessage('Category deleted successfully!', 'success');
          this.loadCategories();
        },
        error: (error) => {
          this.showMessage('Failed to delete category', 'error');
        }
      });
    }
  }

  closeCategoryForm() {
    this.showCategoryForm = false;
    this.categoryForm.reset();
  }

  updateOrderStatus(order: Order, event: any) {
    const newStatus = event.target.value as OrderStatus;
    this.orderService.updateOrderStatus(order.id!, newStatus).subscribe({
      next: (updatedOrder) => {
        this.showMessage('Order status updated successfully!', 'success');
        this.loadAllOrders();
      },
      error: (error) => {
        this.showMessage('Failed to update order status', 'error');
      }
    });
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  }

  getPendingOrdersCount(): number {
    return this.allOrders.filter(order => order.status === 'PLACED').length;
  }

  requestExchange(order: Order) {
    this.orderService.updateOrderStatus(order.id!, OrderStatus.REQUEST_EXCHANGE, 'Customer requested exchange').subscribe({
      next: () => {
        this.showMessage('Exchange request submitted!', 'success');
        this.loadCustomerOrders();
      },
      error: (error) => {
        this.showMessage('Failed to request exchange', 'error');
      }
    });
  }

  requestReplace(order: Order) {
    this.orderService.updateOrderStatus(order.id!, OrderStatus.REQUEST_REPLACE, 'Customer requested replacement').subscribe({
      next: () => {
        this.showMessage('Replacement request submitted!', 'success');
        this.loadCustomerOrders();
      },
      error: (error) => {
        this.showMessage('Failed to request replacement', 'error');
      }
    });
  }
}