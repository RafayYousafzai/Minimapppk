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
  cartInitialized: boolean;
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartInitialized, setCartInitialized] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after initial mount
    try {
      const localData = localStorage.getItem('cartItems');
      if (localData) {
        setCartItems(JSON.parse(localData));
      }
    } catch (error) {
        console.error('Error loading cart items from localStorage:', error);
        localStorage.removeItem('cartItems'); // Clear corrupted data
    }
    setCartInitialized(true); // Signal that hydration is complete and localStorage has been checked
  }, []); // Empty dependency array: run once on mount

  useEffect(() => {
    // Persist to localStorage whenever cartItems changes, but only after initial hydration
    if (cartInitialized) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, cartInitialized]);

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
            id: cartItemId,
            productId: product.id,
            name: product.name,
            image: product.images[0],
            price: itemPrice,
            quantity: Math.min(quantity, product.stock),
            selectedVariants,
            availableStock: product.stock, 
            description: product.description, 
            category: product.category, 
          } as CartItem, 
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
          // It's generally better to fetch fresh product details if stock can change,
          // but for this mock setup, we rely on availableStock stored in CartItem.
          // If item.availableStock wasn't correctly set upon adding, this might be an issue.
          // For now, assume item.availableStock is the authority for that specific item.
          const stockLimit = item.availableStock;
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
    if (!cartInitialized) return 0; // Return 0 if cart is not yet initialized from localStorage
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems, cartInitialized]);

  const getTotalPrice = useCallback(() => {
    if (!cartInitialized) return 0; // Return 0 if cart is not yet initialized
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems, cartInitialized]);

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
        cartInitialized,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
