
import type { Timestamp } from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth'; // Import Firebase User type

// You can extend this User type if you store more custom info in Firestore
export interface User extends FirebaseUser {}


export interface VariantOption {
  id: string;
  value: string; // e.g., "S", "M", "Red", "Blue"
  additionalPrice?: number; 
  // image?: string; // Specific image for this option if needed
  // stock?: number; // Specific stock for this variant option
}

export interface ProductVariant {
  type: string; // e.g., "Size", "Color"
  options: VariantOption[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  images: string[]; // Array of image URLs, first one is primary
  price: number;
  originalPrice?: number; // For sales/discounts
  category: string;
  rating: number; // Average rating, 0-5
  reviews: number; // Number of reviews (count)
  stock: number; // Total stock or stock for default variant
  tags?: string[];
  variants?: ProductVariant[];
  createdAt?: { seconds: number, nanoseconds: number } | Date; // Firestore timestamp or Date object for sorting
  updatedAt?: { seconds: number, nanoseconds: number } | Date; // Firestore timestamp or Date object
}

export interface CartItem {
  id: string; // This will be a composite key like product.id_variantType1.value_variantType2.value if variants exist
  productId: string;
  name: string;
  image: string;
  price: number; // Actual price considering selected variant
  quantity: number;
  selectedVariants?: { [variantType: string]: string }; // e.g. { Size: "M", Color: "Red" }
  availableStock: number; 
  description?: string; // Optional: for AI product recommendations context
  category?: string; // Optional: for AI product recommendations context
}

export interface FilterOptions {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
}

export type OrderStatus = "pending payment" | "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedVariants?: { [key: string]: string } | null;
  image: string;
}

export interface Order {
  id: string;
  billingFirstName: string;
  billingLastName: string;
  billingEmail: string;
  billingPhone: string;
  billingStreetAddress1: string;
  billingCity: string;
  billingPostcode: string;
  billingCountry: string;
  billingState: string;
  billingCompanyName?: string;
  billingStreetAddress2?: string;
  
  shipToDifferentAddress: boolean;
  shippingFirstName?: string;
  shippingLastName?: string;
  shippingCompanyName?: string;
  shippingCountry?: string;
  shippingStreetAddress1?: string;
  shippingStreetAddress2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPostcode?: string;

  cartItems: OrderItem[];
  orderTotal: number;
  orderStatus: OrderStatus;
  createdAt: { seconds: number, nanoseconds: number } | Date; // Firestore timestamp or Date object
  orderNotes?: string;
  paymentMethod?: string; // Optional now
}

export interface Review {
  id: string;
  productId: string;
  reviewerName: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: Timestamp | Date;
}

// Customer related types
export interface CustomerSummary {
  id: string; // email used as ID
  email: string;
  name: string; // Combined First + Last name
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: Date | null;
  firstOrderDate: Date | null;
  avatarFallback: string; // Initials for avatar
}

export interface CustomerDetails {
  summary: CustomerSummary;
  orders: Order[];
}
