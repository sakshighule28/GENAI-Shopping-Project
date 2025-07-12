import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login user successfully', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      role: 'CUSTOMER' as any
    };
    const mockResponse = {
      token: 'mock-jwt-token',
      user: mockUser
    };

    service.login({ username: 'testuser', password: 'password' }).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe('mock-jwt-token');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'testuser', password: 'password' });
    req.flush(mockResponse);
  });

  it('should register user successfully', () => {
    const registerData = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password',
      role: 'CUSTOMER' as any
    };
    const mockResponse = { id: 1, username: 'newuser', email: 'new@example.com', role: 'CUSTOMER' as any };

    service.register(registerData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(registerData);
    req.flush(mockResponse);
  });

  it('should logout user', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('currentUser', JSON.stringify({ id: 1, username: 'test' }));
    
    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(service.currentUserValue).toBeNull();
  });

  it('should check if user is logged in', () => {
    expect(service.isLoggedIn()).toBeFalsy();

    localStorage.setItem('token', 'test-token');
    expect(service.isLoggedIn()).toBeTruthy();
  });

  it('should get token', () => {
    expect(service.getToken()).toBeNull();

    localStorage.setItem('token', 'test-token');
    expect(service.getToken()).toBe('test-token');
  });

  it('should check user role', () => {
    const mockUser = { id: 1, username: 'admin', email: 'admin@test.com', role: 'ADMIN' as any };
    service['currentUserSubject'].next(mockUser);

    expect(service.isAdmin()).toBeTruthy();
    expect(service.isCustomer()).toBeFalsy();
  });
});