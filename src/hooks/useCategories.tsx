import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchCategories } from '@/utils/api';
import { toast } from 'react-hot-toast';

/**
 * Hook for fetching all product categories from the API
 * Used for filter component population
 */
export const useCategories = () => {
  const { data, isLoading, error, refetch } = useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Handle errors with toast notifications
  useEffect(() => {
    if (error) {
      const errorMessage = (error as any)?.message || 'Failed to load categories';
      toast.error(errorMessage);
    }
  }, [error]);

  return {
    categories: data || [],
    isLoading,
    error,
    refetch,
  };
}; 