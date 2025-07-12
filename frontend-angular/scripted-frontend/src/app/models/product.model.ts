export interface Product {
  id?: number;
  name: string;
  description: string;
  basePrice: number;
  discountPercent?: number;
  discountedPrice?: number;
  unitsInStock: number;
  imageUrl?: string;
  brand?: string;
  sizes?: string;
  averageRating?: number;
  totalReviews?: number;
  categoryId: number;
  createdDate?: string;
  popularityScore?: number;
  in_wishlist?: boolean;
}

export interface Category {
  id?: number;
  name: string;
}

export interface ProductRequest {
  name: string;
  description: string;
  basePrice: number;
  unitsInStock: number;
  imageUrl?: string;
  brand?: string;
  sizes?: string;
  categoryName: string;
}

export interface ProductUpdateRequest {
  productName: string;
  basePrice?: number;
  unitsInStock?: number;
  sizes?: string;
}

export interface DiscountRequest {
  productName: string;
  discountPercent: number;
}