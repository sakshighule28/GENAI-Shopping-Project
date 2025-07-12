import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderStatus, Cart, Review } from '../models/order.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Order endpoints
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`, { headers: this.getHeaders() });
  }

  getMyOrders(): Observable<Order[]> {
    const userId = this.authService.currentUserValue?.id;
    return this.http.get<Order[]>(`${this.apiUrl}/orders/my-orders?userId=${userId}`, { headers: this.getHeaders() });
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}`, { headers: this.getHeaders() });
  }

  createOrder(orderData: any): Observable<Order> {
    const userId = this.authService.currentUserValue?.id;
    const orderWithUserId = { ...orderData, userId };
    return this.http.post<Order>(`${this.apiUrl}/orders`, orderWithUserId, { headers: this.getHeaders() });
  }
  
  createOrderFromCart(userId: number, totalAmount: number, address: string, city: string, state: string, pincode: string, phone: string): Observable<any> {
    const body = { userId, totalAmount, address, city, state, pincode, phone };
    console.log('Creating order with data:', body);
    return this.http.post(`${this.apiUrl}/orders/from-cart`, body, { headers: this.getHeaders() });
  }

  updateOrderStatus(id: number, status: OrderStatus, reason?: string): Observable<Order> {
    const body = { status, reason };
    return this.http.put<Order>(`${this.apiUrl}/orders/${id}/status`, body, { headers: this.getHeaders() });
  }

  // Cart endpoints
  addToCart(productId: number, quantity: number, size?: string): Observable<Cart> {
    const userId = this.authService.currentUserValue?.id;
    const body = { userId, productId, quantity, size };
    return this.http.post<Cart>(`${this.apiUrl}/cart/add`, body, { headers: this.getHeaders() });
  }

  getCart(): Observable<Cart[]> {
    const userId = this.authService.currentUserValue?.id;
    return this.http.get<Cart[]>(`${this.apiUrl}/cart/user/${userId}`, { headers: this.getHeaders() });
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cart/clear`, { headers: this.getHeaders() });
  }

  // Review endpoints
  addReview(review: Review): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/reviews`, review, { headers: this.getHeaders() });
  }

  getProductReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/reviews/product/${productId}`);
  }

  getMyReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/reviews/my-reviews`, { headers: this.getHeaders() });
  }

  // Wishlist endpoints
  addToWishlist(productId: number): Observable<any> {
    const userId = this.authService.currentUserValue?.id;
    const body = { userId, productId };
    return this.http.post(`${this.apiUrl}/wishlist/add`, body, { headers: this.getHeaders() });
  }

  removeFromWishlist(productId: number): Observable<any> {
    const userId = this.authService.currentUserValue?.id;
    return this.http.delete(`${this.apiUrl}/wishlist/remove?userId=${userId}&productId=${productId}`, { headers: this.getHeaders() });
  }

  getWishlist(): Observable<any[]> {
    const userId = this.authService.currentUserValue?.id;
    return this.http.get<any[]>(`${this.apiUrl}/wishlist/user/${userId}`, { headers: this.getHeaders() });
  }

  isInWishlist(productId: number): Observable<boolean> {
    const userId = this.authService.currentUserValue?.id;
    return this.http.get<boolean>(`${this.apiUrl}/wishlist/check?userId=${userId}&productId=${productId}`, { headers: this.getHeaders() });
  }
  
  removeFromCart(productId: number): Observable<any> {
    const userId = this.authService.currentUserValue?.id;
    return this.http.delete(`${this.apiUrl}/cart/remove/${productId}?userId=${userId}`, { headers: this.getHeaders() });
  }
  
  updateCartQuantity(productId: number, quantity: number): Observable<any> {
    const userId = this.authService.currentUserValue?.id;
    return this.http.put(`${this.apiUrl}/cart/update`, { userId, productId, quantity }, { headers: this.getHeaders() });
  }
}