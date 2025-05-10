"use client";

import type { Product, CartItem } from '@/lib/types';
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { mockProducts } from '@/lib/mock-data'; // For fetching product details

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, selectedVariants?: { [key: string]: string }) => string; // Returns cart item ID
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
  getCartItemById: (cartItemId: string) => CartItem | undefined;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

// Helper to generate a unique ID for cart items based on product ID and variants
const generateCartItemId = (productId: string, selectedVariants?: { [key: string]: string }): string => {
  if (!selectedVariants || Object.keys(selectedVariants).length === 0) {
    return productId;
  }
  const variantString = Object.entries(selectedVariants)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) // Ensure consistent order
    .map(([type, value]) => `${type}-${value}`)
    .join('_');
  return `${productId}_${variantString}`;
};


export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem('cartItems');
      return localData ? JSON.parse(localData) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product: Product, quantity: number, selectedVariants?: { [key: string]: string }): string => {
    const cartItemId = generateCartItemId(product.id, selectedVariants);
    
    let itemPrice = product.price;
    if (selectedVariants && product.variants) {
      Object.entries(selectedVariants).forEach(([type, value]) => {
        const variantType = product.variants?.find(v => v.type === type);
        const option = variantType?.options.find(o => o.value === value);
        if (option?.additionalPrice) {
          itemPrice += option.additionalPrice;
        }
      });
    }
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === cartItemId);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            ...product, // Spreading product might bring too much, let's be specific
            id: cartItemId,
            productId: product.id,
            name: product.name,
            image: product.images[0],
            price: itemPrice,
            quantity: Math.min(quantity, product.stock),
            selectedVariants,
            availableStock: product.stock, // Assuming product.stock is for the specific variant combination or base product
            // Remove fields not in CartItem from Product
            description: product.description, // Keep description for cart display
            category: product.category, // Keep category
            // Remove longDescription, reviews, tags, etc. or ensure CartItem includes them if needed.
            // For simplicity, CartItem is defined to include common Product fields.
          } as CartItem, // Type assertion might be needed if Product has more fields than CartItem expects directly
        ];
      }
    });
    return cartItemId;
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === cartItemId) {
          const productDetails = mockProducts.find(p => p.id === item.productId);
          const stockLimit = productDetails ? productDetails.stock : item.availableStock;
          return { ...item, quantity: Math.max(1, Math.min(quantity, stockLimit)) };
        }
        return item;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getItemCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const getCartItemById = useCallback((cartItemId: string): CartItem | undefined => {
    return cartItems.find(item => item.id === cartItemId);
  }, [cartItems]);


  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        getTotalPrice,
        getCartItemById,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
