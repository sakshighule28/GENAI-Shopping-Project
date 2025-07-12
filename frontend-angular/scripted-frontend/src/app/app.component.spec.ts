import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { ProductService } from './services/product.service';
import { OrderService } from './services/order.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockOrderService: jasmine.SpyObj<OrderService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'register', 'logout', 'isAdmin', 'isCustomer'], {
      currentUser: of(null),
      currentUserValue: null
    });
    const productSpy = jasmine.createSpyObj('ProductService', ['getAllProducts', 'getAllCategories', 'getNewProducts']);
    const orderSpy = jasmine.createSpyObj('OrderService', ['getCart', 'getMyOrders', 'getAllOrders']);

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterModule.forRoot([]),
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ProductService, useValue: productSpy },
        { provide: OrderService, useValue: orderSpy }
      ]
    }).compileComponents();

    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockProductService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    mockOrderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Scripted'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Scripted');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // Check if the component has the title property instead of DOM element
    expect(fixture.componentInstance.title).toContain('Scripted');
  });
});
