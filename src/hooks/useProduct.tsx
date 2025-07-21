import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchProductById } from '@/utils/api';
import { Product } from '@/types';
import { toast } from 'react-hot-toast';
import { isValidProductId } from '@/utils/helpers';

/**
 * Hook for fetching a single product by ID
 * No caching - fresh data on every request
 */
export const useProduct = (productId: number | string | undefined) => {
  const id = typeof productId === 'string' ? parseInt(productId, 10) : productId;
  const isValidId = id && isValidProductId(id);

  const { data, isLoading, error, refetch } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    enabled: isValidId, // Only fetch if ID is valid
  });

  // Handle errors with toast notifications
  useEffect(() => {
    if (error) {
      const errorMessage = (error as any)?.message || `Failed to load product ${id}`;
      toast.error(errorMessage);
    }
  }, [error, id]);

  return {
    product: data,
    isLoading,
    error,
    refetch,
    isValidId,
  };
};

/**
 * Hook for checking if a product exists without showing loading state
 * Useful for validation purposes
 */
export const useProductExists = (productId: number | string | undefined) => {
  const id = typeof productId === 'string' ? parseInt(productId, 10) : productId;
  const isValidId = id && isValidProductId(id);

  const { data, error } = useQuery<Product>({
    queryKey: ['product-exists', id],
    queryFn: () => fetchProductById(id!),
    enabled: isValidId,
  });

  return {
    exists: !!data,
    product: data,
    isValidId,
    notFound: error && !data,
  };
}; 