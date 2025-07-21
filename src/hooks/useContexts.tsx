import { useCartContext, useUserContext, useProductsContext } from '@/context';
import { Product } from '@/types';
import { useCallback } from 'react';

/**
 * Hook that combines cart and user contexts
 * Provides cart operations with user validation
 */
export function useCartWithUser() {
  const cart = useCartContext();
  const { userId, isAuthenticated } = useUserContext();
  
  const addToCartWithValidation = useCallback(async (productId: number, quantity?: number) => {
    if (!userId) {
      // For demo purposes, we'll allow cart operations without user
      // In a real app, this might require authentication
      return cart.addToCart(productId, quantity);
    }
    
    return cart.addToCart(productId, quantity);
  }, [cart, userId]);

  return {
    ...cart,
    userId,
    isAuthenticated,
    addToCart: addToCartWithValidation,
  };
}

/**
 * Hook that combines products and cart contexts
 * Provides product data with cart operations
 */
export function useProductsWithCart() {
  const products = useProductsContext();
  const cart = useCartContext();
  
  const addProductToCart = useCallback((product: Product, quantity?: number) => {
    cart.addToCart(product.id, quantity);
  }, [cart]);

  const isProductInCart = useCallback((productId: number): boolean => {
    return cart.cartItems.some(item => item.productId === productId);
  }, [cart.cartItems]);

  const getProductQuantityInCart = useCallback((productId: number): number => {
    const cartItem = cart.cartItems.find(item => item.productId === productId);
    return cartItem ? cartItem.quantity : 0;
  }, [cart.cartItems]);

  return {
    ...products,
    ...cart,
    addProductToCart,
    isProductInCart,
    getProductQuantityInCart,
  };
}

/**
 * Hook that combines all three contexts
 * Provides complete application state
 */
export function useAppState() {
  const cart = useCartContext();
  const user = useUserContext();
  const products = useProductsContext();

  const isLoading = cart.isLoading || user.isLoading || products.isLoading;
  const hasError = Boolean(cart.error || user.error || products.error);

  return {
    cart,
    user,
    products,
    isLoading,
    hasError,
  };
}

/**
 * Hook for header component that needs user and cart info
 */
export function useHeaderData() {
  const { userId, user, isAuthenticated, getUserDisplayName } = useUserContext();
  const { cartCount, cartItems } = useCartContext();

  return {
    userId,
    user,
    isAuthenticated,
    userDisplayName: getUserDisplayName?.() || null,
    cartCount,
    hasCartItems: cartItems.length > 0,
  };
}

/**
 * Hook for product listing that combines products and search
 */
export function useProductListing() {
  const {
    products,
    filteredProducts,
    categories,
    filters,
    pagination,
    isLoading,
    searchProducts,
    filterByCategory,
    resetFilters,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasActiveFilters,
  } = useProductsContext();

  return {
    products,
    filteredProducts,
    categories,
    filters,
    pagination,
    isLoading,
    searchProducts,
    filterByCategory,
    resetFilters,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasActiveFilters,
    totalProducts: filteredProducts.length,
    hasProducts: products.length > 0,
    hasResults: filteredProducts.length > 0,
  };
}

/**
 * Hook for cart page that includes product data fetching
 */
export function useCartPage() {
  const cart = useCartContext();
  const { products } = useProductsContext();

  // Enrich cart items with product data
  const cartItemsWithProducts = cart.cartItems.map(cartItem => {
    const productData = products.find(p => p.id === cartItem.productId);
    return {
      ...cartItem,
      productData,
    };
  });

  const cartSubtotal = cartItemsWithProducts.reduce((total, item) => {
    if (item.productData) {
      return total + (item.productData.price * item.quantity);
    }
    return total;
  }, 0);

  return {
    ...cart,
    cartItemsWithProducts,
    cartSubtotal,
    hasValidItems: cartItemsWithProducts.every(item => item.productData),
  };
}

/**
 * Hook for checking if user can perform actions
 */
export function useUserPermissions() {
  const { userId, isAuthenticated } = useUserContext();

  return {
    canAddToCart: true, // In this demo, anyone can add to cart
    canViewProfile: Boolean(userId),
    canCheckout: Boolean(userId), // Require user for checkout
    isAuthenticated,
    requiresAuth: !userId,
  };
} 