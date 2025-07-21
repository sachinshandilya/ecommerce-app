'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CartItem, CartContextType, Product } from '@/types';
import { useAddToCart, useRemoveFromCart } from '@/hooks';
import { fetchProductById } from '@/utils/api';
import { toast } from 'react-hot-toast';
import { CART_DEFAULTS } from '@/utils/constants';

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Cart Context Provider
 * Implements hybrid cart state management with no persistence
 * Stores product IDs with quantities, fetches product data when needed
 */
export function CartContextProvider({ children }: { children: React.ReactNode }) {
  // Cart state - no persistence, resets on page refresh
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // React Query mutations for cart operations
  const addToCartMutation = useAddToCart();
  const removeFromCartMutation = useRemoveFromCart();

  /**
   * Add product to cart
   * Fetches product data immediately for accurate totals
   */
  const addToCart = useCallback(async (productId: number, quantity: number = CART_DEFAULTS.DEFAULT_QUANTITY) => {
    try {
      setIsLoading(true);

      // Fetch product data first
      const productData = await fetchProductById(productId);

      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        // Update quantity for existing item
        setCartItems(prev => 
          prev.map((item, index) => 
            index === existingItemIndex 
              ? { ...item, quantity: item.quantity + quantity, productData }
              : item
          )
        );
      } else {
        // Add new item to cart with product data
        const newCartItem: CartItem = {
          productId,
          quantity,
          productData,
        };
        
        setCartItems(prev => [...prev, newCartItem]);
      }

      toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart`);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  }, [cartItems]);

  /**
   * Remove product from cart
   */
  const removeFromCart = useCallback((productId: number) => {
    try {
      setIsLoading(true);
      
      setCartItems(prev => prev.filter(item => item.productId !== productId));
      toast.success('Item removed from cart');
      
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update item quantity in cart
   */
  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (quantity > CART_DEFAULTS.MAX_QUANTITY) {
      toast.error(`Maximum quantity is ${CART_DEFAULTS.MAX_QUANTITY}`);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  /**
   * Clear entire cart
   */
  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.success('Cart cleared');
  }, []);

  /**
   * Calculate cart total
   * All items should have product data when added to cart
   */
  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      if (item.productData) {
        return total + (item.productData.price * item.quantity);
      } else {
        console.warn(`Cart item ${item.productId} missing product data for total calculation`);
        return total;
      }
    }, 0);
  }, [cartItems]);

  /**
   * Calculate cart item count
   */
  const cartCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  /**
   * Check if cart has items
   */
  const hasItems = useMemo(() => cartItems.length > 0, [cartItems]);

  /**
   * Get cart items with full product data
   * Fetches product details for each cart item
   */
  const getCartItemsWithProducts = useCallback(async (): Promise<CartItem[]> => {
    if (cartItems.length === 0) {
      return [];
    }

    try {
      // Fetch product data for each cart item
      const itemsWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          try {
            const productData = await fetchProductById(item.productId);
            return {
              ...item,
              productData,
            };
          } catch (error) {
            console.error(`Failed to fetch product ${item.productId}:`, error);
            // Return item without product data if fetch fails
            return item;
          }
        })
      );

      return itemsWithProducts;
    } catch (error) {
      console.error('Failed to fetch cart items with products:', error);
      // Return original items if bulk fetch fails
      return cartItems;
    }
  }, [cartItems]);

  const contextValue: CartContextType = {
    cartItems,
    cartCount,
    cartTotal,
    isLoading: isLoading || addToCartMutation.isPending || removeFromCartMutation.isPending,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    hasItems,
    getCartItemsWithProducts,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * Hook to consume Cart Context
 * Provides type-safe access to cart state and operations
 */
export function useCartContext() {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartContextProvider');
  }
  
  return context;
}

/**
 * HOC to wrap components that need cart context
 */
export function withCartContext<P extends object>(Component: React.ComponentType<P>) {
  return function WrappedComponent(props: P) {
    return (
      <CartContextProvider>
        <Component {...props} />
      </CartContextProvider>
    );
  };
} 