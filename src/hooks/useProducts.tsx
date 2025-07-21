import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchProducts } from '@/utils/api';
import { Product } from '@/types';
import { toast } from 'react-hot-toast';

/**
 * Hook for fetching all products from the API
 * No caching - fresh data on every request as per requirements
 */
export const useProducts = () => {
  const { data, isLoading, error, refetch } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // Handle errors with toast notifications
  useEffect(() => {
    if (error) {
      const errorMessage = (error as any)?.message || 'Failed to load products';
      toast.error(errorMessage);
    }
  }, [error]);

  return {
    products: data || [],
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook for fetching products with search and filter parameters
 * Used for client-side filtering after fetching all products
 */
export const useProductsWithFilters = (searchTerm?: string, categories?: string[]) => {
  const { products, isLoading, error, refetch } = useProducts();

  // Filter products client-side as per requirements
  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !categories || 
      categories.length === 0 || 
      categories.includes(product.category);

    return matchesSearch && matchesCategory;
  }) : [];

  return {
    products: filteredProducts,
    allProducts: products,
    isLoading,
    error,
    refetch,
  };
}; 