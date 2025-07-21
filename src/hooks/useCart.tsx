import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { addToCart, removeFromCart, fetchUserCarts } from '@/utils/api';
import { CartApiResponse } from '@/types';
import { toast } from 'react-hot-toast';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/utils/constants';

/**
 * Hook for adding items to cart
 * Shows success/error toast notifications
 */
export const useAddToCart = () => {
  return useMutation<CartApiResponse, Error, { userId: number; productId: number; quantity?: number }>({
    mutationFn: ({ userId, productId, quantity = 1 }) => 
      addToCart(userId, productId, quantity),
    onSuccess: () => {
      toast.success(SUCCESS_MESSAGES.PRODUCT_ADDED_TO_CART);
    },
    onError: (error: any) => {
      const errorMessage = error?.message || ERROR_MESSAGES.CART_ERROR;
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook for removing items from cart
 * Shows success/error toast notifications
 */
export const useRemoveFromCart = () => {
  return useMutation<CartApiResponse, Error, { cartId: number }>({
    mutationFn: ({ cartId }) => removeFromCart(cartId),
    onSuccess: () => {
      toast.success(SUCCESS_MESSAGES.PRODUCT_REMOVED_FROM_CART);
    },
    onError: (error: any) => {
      const errorMessage = error?.message || ERROR_MESSAGES.CART_ERROR;
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook for fetching user's cart data
 * Used to display current cart contents
 */
export const useUserCarts = (userId: number | null) => {
  const { data, isLoading, error, refetch } = useQuery<CartApiResponse[]>({
    queryKey: ['user-carts', userId],
    queryFn: () => fetchUserCarts(userId!),
    enabled: !!userId, // Only fetch if userId is provided
  });

  // Handle errors with toast notifications
  useEffect(() => {
    if (error) {
      const errorMessage = (error as any)?.message || 'Failed to load cart data';
      toast.error(errorMessage);
    }
  }, [error]);

  return {
    carts: data || [],
    isLoading,
    error,
    refetch,
  };
};

/**
 * Combined cart operations hook
 * Provides all cart-related functionality in one hook
 */
export const useCartOperations = (userId: number | null) => {
  const addToCartMutation = useAddToCart();
  const removeFromCartMutation = useRemoveFromCart();
  const { carts, isLoading, error, refetch } = useUserCarts(userId);

  const handleAddToCart = (productId: number, quantity: number = 1) => {
    if (!userId) {
      toast.error('User ID is required to add items to cart');
      return;
    }
    
    addToCartMutation.mutate({ userId, productId, quantity });
  };

  const handleRemoveFromCart = (cartId: number) => {
    removeFromCartMutation.mutate({ cartId });
  };

  return {
    carts,
    isLoading,
    error,
    refetch,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    isAddingToCart: addToCartMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
    addError: addToCartMutation.error,
    removeError: removeFromCartMutation.error,
  };
}; 