import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { AuthService } from './auth.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductService,
        { provide: AuthService, useValue: authSpy }
      ]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all products', () => {
    const mockProducts = [
      { id: 1, name: 'Product 1', description: 'Test', basePrice: 100, unitsInStock: 10, categoryId: 1 },
      { id: 2, name: 'Product 2', description: 'Test', basePrice: 200, unitsInStock: 10, categoryId: 1 }
    ];

    service.getAllProducts().subscribe(products => {
      expect(products.length).toBe(2);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should get product by id', () => {
    const mockProduct = { id: 1, name: 'Test Product', description: 'Test', basePrice: 100, unitsInStock: 10, categoryId: 1 };

    service.getProductById(1).subscribe(product => {
      expect(product.name).toBe('Test Product');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/products/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should search products', () => {
    const mockProducts = [
      { id: 1, name: 'Test Shirt', description: 'Test', basePrice: 50, unitsInStock: 10, categoryId: 1 }
    ];

    service.searchProducts('shirt').subscribe(products => {
      expect(products.length).toBe(1);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/products/search?name=shirt');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should get products by category', () => {
    const mockProducts = [
      { id: 1, name: 'Category Product', description: 'Test', basePrice: 75, unitsInStock: 10, categoryId: 1 }
    ];

    service.getProductsByCategory(1).subscribe(products => {
      expect(products.length).toBe(1);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/products/category/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should create product with auth token', () => {
    const mockProduct = { name: 'New Product', description: 'Test', basePrice: 150, unitsInStock: 10, categoryName: 'Test' };
    const createdProduct = { id: 1, name: 'New Product', description: 'Test', basePrice: 150, unitsInStock: 10, categoryId: 1 };
    
    authService.getToken.and.returnValue('mock-token');

    service.createProduct(mockProduct).subscribe(product => {
      expect(product.name).toBe('New Product');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(createdProduct);
  });

  it('should validate coupon', () => {
    const mockCoupon = { code: 'SAVE10', discountPercent: 10, status: 'ACTIVE' };
    
    authService.getToken.and.returnValue('mock-token');

    service.validateCoupon('SAVE10', 1).subscribe(coupon => {
      expect(coupon.code).toBe('SAVE10');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/products/coupons/validate/SAVE10?userId=1');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockCoupon);
  });
});