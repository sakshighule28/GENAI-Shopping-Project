export interface User {
  id?: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
}

export interface AuthResponse {
  token: string;
  user: User;
}