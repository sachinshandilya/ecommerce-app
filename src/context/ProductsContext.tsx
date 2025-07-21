'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { ProductsContextType, Product, FilterConfig, PaginationConfig } from '@/types';
import { useProducts, useCategories, useSearchDebounce } from '@/hooks';
import { applyFiltersToProducts, createPaginationConfig, getPaginatedItems } from '@/utils/helpers';
import { PAGINATION_DEFAULTS, FILTER_DEFAULTS } from '@/utils/constants';
import { toast } from 'react-hot-toast';

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

/**
 * Products Context Provider
 * Manages products, filtering, search, and pagination with client-side operations
 * No persistence - all state resets on page refresh
 */
export function ProductsContextProvider({ children }: { children: React.ReactNode }) {
  // Filter and pagination state - no persistence
  const [filters, setFilters] = useState<FilterConfig>({
    searchTerm: FILTER_DEFAULTS.SEARCH_TERM,
    selectedCategories: [...FILTER_DEFAULTS.SELECTED_CATEGORIES] as string[],
  });
  
  const [pagination, setPagination] = useState<PaginationConfig>({
    currentPage: PAGINATION_DEFAULTS.CURRENT_PAGE,
    pageSize: PAGINATION_DEFAULTS.PAGE_SIZE,
    totalItems: 0,
    totalPages: 0,
  });

  // API data fetching
  const { products, isLoading: productsLoading, error: productsError } = useProducts();
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();

  // Debounced search term for performance
  const debouncedSearchTerm = useSearchDebounce(filters.searchTerm);

  /**
   * Handle API errors
   */
  useEffect(() => {
    if (productsError) {
      toast.error('Failed to load products');
    }
    if (categoriesError) {
      toast.error('Failed to load categories');
    }
  }, [productsError, categoriesError]);

  /**
   * Apply filters to products (client-side)
   * Uses debounced search term to avoid excessive filtering
   */
  const filteredProducts = useMemo(() => {
    const filterConfig = {
      ...filters,
      searchTerm: debouncedSearchTerm, // Use debounced value
    };
    
    return applyFiltersToProducts(products, filterConfig);
  }, [products, filters.selectedCategories, debouncedSearchTerm]);

  /**
   * Update pagination when filtered products change
   */
  useEffect(() => {
    const newPagination = createPaginationConfig(
      filteredProducts.length,
      pagination.currentPage,
      pagination.pageSize
    );
    
    setPagination(newPagination);
  }, [filteredProducts.length, pagination.pageSize]);

  /**
   * Get paginated products for current page
   */
  const paginatedProducts = useMemo(() => {
    return getPaginatedItems(
      filteredProducts,
      pagination.currentPage,
      pagination.pageSize
    );
  }, [filteredProducts, pagination.currentPage, pagination.pageSize]);

  /**
   * Update search filter
   */
  const updateSearchTerm = useCallback((searchTerm: string) => {
    setFilters(prev => ({
      ...prev,
      searchTerm,
    }));
    
    // Reset to first page when searching
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
    }));
  }, []);

  /**
   * Update category filters
   */
  const updateCategories = useCallback((selectedCategories: string[]) => {
    setFilters(prev => ({
      ...prev,
      selectedCategories,
    }));
    
    // Reset to first page when filtering
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
    }));
  }, []);

  /**
   * Update all filters at once
   */
  const updateFilters = useCallback((newFilters: Partial<FilterConfig>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
    
    // Reset to first page when filters change
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
    }));
  }, []);

  /**
   * Update pagination settings
   */
  const updatePagination = useCallback((newPagination: Partial<PaginationConfig>) => {
    setPagination(prev => ({
      ...prev,
      ...newPagination,
    }));
  }, []);

  /**
   * Reset all filters and pagination
   */
  const resetFilters = useCallback(() => {
    setFilters({
      searchTerm: FILTER_DEFAULTS.SEARCH_TERM,
      selectedCategories: [...FILTER_DEFAULTS.SELECTED_CATEGORIES] as string[],
    });
    
    setPagination({
      currentPage: PAGINATION_DEFAULTS.CURRENT_PAGE,
      pageSize: PAGINATION_DEFAULTS.PAGE_SIZE,
      totalItems: 0,
      totalPages: 0,
    });
  }, []);

  /**
   * Search products by term
   */
  const searchProducts = useCallback((searchTerm: string) => {
    updateSearchTerm(searchTerm);
  }, [updateSearchTerm]);

  /**
   * Filter products by categories
   */
  const filterByCategory = useCallback((categories: string[]) => {
    updateCategories(categories);
  }, [updateCategories]);

  /**
   * Change page size and reset to first page
   */
  const changePageSize = useCallback((pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      pageSize,
      currentPage: 1,
    }));
  }, []);

  /**
   * Go to specific page
   */
  const goToPage = useCallback((page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: Math.max(1, Math.min(page, prev.totalPages)),
    }));
  }, []);

  /**
   * Navigation helpers
   */
  const goToNextPage = useCallback(() => {
    goToPage(pagination.currentPage + 1);
  }, [pagination.currentPage, goToPage]);

  const goToPreviousPage = useCallback(() => {
    goToPage(pagination.currentPage - 1);
  }, [pagination.currentPage, goToPage]);

  /**
   * Check if we have any active filters
   */
  const hasActiveFilters = useMemo(() => {
    return filters.searchTerm.length > 0 || filters.selectedCategories.length > 0;
  }, [filters]);

  /**
   * Get total products count before filtering
   */
  const totalProductsCount = products.length;

  const contextValue: ProductsContextType = {
    products: paginatedProducts,
    filteredProducts,
    allProducts: products,
    categories,
    filters,
    pagination,
    isLoading: productsLoading || categoriesLoading,
    error: productsError || categoriesError ? 'Failed to load data' : null,
    setFilters: updateFilters,
    setPagination: updatePagination,
    searchProducts,
    filterByCategory,
    updateSearchTerm,
    updateCategories,
    resetFilters,
    changePageSize,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasActiveFilters,
    totalProductsCount,
    isSearching: filters.searchTerm !== debouncedSearchTerm,
  };

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
}

/**
 * Hook to consume Products Context
 * Provides type-safe access to products state and operations
 */
export function useProductsContext() {
  const context = useContext(ProductsContext);
  
  if (context === undefined) {
    throw new Error('useProductsContext must be used within a ProductsContextProvider');
  }
  
  return context;
}

/**
 * Hook to get filtered products without pagination
 */
export function useFilteredProducts(): Product[] {
  const { filteredProducts } = useProductsContext();
  return filteredProducts;
}

/**
 * Hook to get current filters
 */
export function useCurrentFilters(): FilterConfig {
  const { filters } = useProductsContext();
  return filters;
}

/**
 * Hook to get pagination info
 */
export function usePaginationInfo(): PaginationConfig {
  const { pagination } = useProductsContext();
  return pagination;
}

/**
 * HOC to wrap components that need products context
 */
export function withProductsContext<P extends object>(Component: React.ComponentType<P>) {
  return function WrappedComponent(props: P) {
    return (
      <ProductsContextProvider>
        <Component {...props} />
      </ProductsContextProvider>
    );
  };
} 