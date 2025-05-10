
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
  category: string;
  rating: number; // Average rating, 0-5
  reviews: number; // Number of reviews
  stock: number; // Total stock or stock for default variant
  tags?: string[];
  variants?: ProductVariant[];
}

export interface CartItem {
  id: string; // This will be a composite key like product.id_variantType1.value_variantType2.value if variants exist
  productId: string;
  name: string;
  image: string;
  price: number; // Actual price considering selected variant
  quantity: number;
  selectedVariants?: { [variantType: string]: string }; // e.g. { Size: "M", Color: "Red" }
  // Add available stock for this specific cart item (product/variant combination)
  availableStock: number; 
}

export interface FilterOptions {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
}
