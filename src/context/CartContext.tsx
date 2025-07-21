'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { CartItem, Product, CartContextType } from '@/types';
import { useAddToCart, useRemoveFromCart, useProduct } from '@/hooks';
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
   * Uses hybrid approach: stores productId and quantity, optionally caches product data
   */
  const addToCart = useCallback(async (productId: number, quantity: number = CART_DEFAULTS.DEFAULT_QUANTITY) => {
    try {
      setIsLoading(true);

      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        // Update quantity for existing item
        setCartItems(prev => 
          prev.map((item, index) => 
            index === existingItemIndex 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );
      } else {
        // Add new item to cart
        const newCartItem: CartItem = {
          productId,
          quantity,
          // productData will be fetched when needed for display
        };
        
        setCartItems(prev => [...prev, newCartItem]);
      }

      // Note: In a real implementation, this would call the API
      // For now, we're managing cart state client-side only
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
   * Only calculates if all items have product data loaded
   */
  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      if (item.productData) {
        return total + (item.productData.price * item.quantity);
      }
      return total;
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
   * Get cart items with product data
   * This function can be used to fetch product data for display
   */
  const getCartItemsWithProducts = useCallback(async (): Promise<CartItem[]> => {
    // In a real implementation, this would fetch missing product data
    // For now, return items as-is
    return cartItems;
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