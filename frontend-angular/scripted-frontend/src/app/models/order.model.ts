export interface Order {
  id?: number;
  orderId?: string;
  userId: number;
  orderDate?: string;
  cancelDate?: string;
  deliveryDate?: string;
  totalAmount: number;
  discountAmount?: number;
  couponCode?: string;
  totalItems?: number;
  message?: string;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  shippingAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  statusReason?: string;
}

export enum OrderStatus {
  PLACED = 'PLACED',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  EXCHANGED = 'EXCHANGED',
  RETURNED = 'RETURNED',
  REQUEST_CANCEL = 'REQUEST_CANCEL',
  REQUEST_EXCHANGE = 'REQUEST_EXCHANGE',
  REQUEST_REPLACE = 'REQUEST_REPLACE',
  REQUEST_RETURN = 'REQUEST_RETURN'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED'
}

export interface OrderItem {
  id?: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  size?: string;
  totalCost: number;
  discountPercent?: number;
  productName?: string;
}

export interface Cart {
  id?: number;
  userId: number;
  productId: number;
  quantity: number;
  size?: string;
}

export interface Review {
  id?: number;
  productId: number;
  userId: number;
  rating: number;
  comment?: string;
  reviewDate?: string;
}

export interface Wishlist {
  id?: number;
  userId: number;
  productId: number;
  wishlistName: string;
}