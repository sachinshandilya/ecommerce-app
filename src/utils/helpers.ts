import { Product, FilterConfig, PaginationConfig, EnvironmentConfig } from '@/types';
import { VALIDATION_RULES, ENV, PAGINATION_DEFAULTS } from './constants';

/**
 * URL Parameter Utilities
 */

// Extract userId from URL parameters
export const extractUserIdFromUrl = (searchParams?: URLSearchParams): number | null => {
  if (!searchParams) {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('userId');
      return userId ? parseInt(userId, 10) : null;
    }
    return null;
  }
  
  const userId = searchParams.get('userId');
  if (!userId) return null;
  
  const parsedId = parseInt(userId, 10);
  return isValidUserId(parsedId) ? parsedId : null;
};

// Create URL with userId parameter
export const createUrlWithUserId = (baseUrl: string, userId: number | null): string => {
  if (!userId) return baseUrl;
  
  const url = new URL(baseUrl, window.location.origin);
  url.searchParams.set('userId', userId.toString());
  return url.pathname + url.search;
};

/**
 * Validation Utilities
 */

// Validate user ID
export const isValidUserId = (userId: number): boolean => {
  return (
    Number.isInteger(userId) &&
    userId >= VALIDATION_RULES.MIN_USER_ID &&
    userId <= VALIDATION_RULES.MAX_USER_ID
  );
};

// Validate product ID
export const isValidProductId = (productId: number): boolean => {
  return (
    Number.isInteger(productId) &&
    productId >= VALIDATION_RULES.MIN_PRODUCT_ID &&
    productId <= VALIDATION_RULES.MAX_PRODUCT_ID
  );
};

// Validate search term
export const isValidSearchTerm = (searchTerm: string): boolean => {
  return (
    typeof searchTerm === 'string' &&
    searchTerm.trim().length >= 1 && // Allow single character searches
    searchTerm.length <= VALIDATION_RULES.MAX_SEARCH_LENGTH
  );
};

/**
 * Formatting Utilities
 */

// Format price with currency
export const formatPrice = (price: number, currency: string = 'USD'): string => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// Format rating display
export const formatRating = (rate: number, count: number): string => {
  if (typeof rate !== 'number' || typeof count !== 'number') {
    return 'No rating';
  }
  
  return `${rate.toFixed(1)} (${count} reviews)`;
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || typeof text !== 'string') return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
};

// Capitalize first letter
export const capitalizeFirst = (str: string): string => {
  if (!str || typeof str !== 'string') return '';
  
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Product Utilities
 */

// Filter products by search term
export const filterProductsBySearch = (products: Product[], searchTerm: string): Product[] => {
  if (!searchTerm || !isValidSearchTerm(searchTerm)) {
    return products;
  }
  
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  return products.filter(product =>
    product.title.toLowerCase().includes(normalizedSearch) ||
    product.description.toLowerCase().includes(normalizedSearch) ||
    product.category.toLowerCase().includes(normalizedSearch)
  );
};

// Filter products by categories
export const filterProductsByCategories = (products: Product[], categories: string[]): Product[] => {
  if (!categories || categories.length === 0) {
    return products;
  }
  
  return products.filter(product =>
    categories.includes(product.category)
  );
};

// Sort products by field and direction
export const sortProducts = (products: Product[], field: keyof Product, direction: 'asc' | 'desc'): Product[] => {
  return [...products].sort((a, b) => {
    let aValue = a[field];
    let bValue = b[field];
    
    // Handle rating field specially
    if (field === 'rating') {
      aValue = (a.rating as any).rate;
      bValue = (b.rating as any).rate;
    }
    
    // Handle string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    // Handle number comparison
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    }
    
    return 0;
  });
};

// Apply all filters to products
export const applyFiltersToProducts = (
  products: Product[], 
  filters: FilterConfig
): Product[] => {
  let filteredProducts = [...products];
  
  // Apply search filter
  if (filters.searchTerm) {
    filteredProducts = filterProductsBySearch(filteredProducts, filters.searchTerm);
  }
  
  // Apply category filter
  if (filters.selectedCategories && filters.selectedCategories.length > 0) {
    filteredProducts = filterProductsByCategories(filteredProducts, filters.selectedCategories);
  }
  
  // Apply price range filter if provided
  if (filters.priceRange) {
    filteredProducts = filteredProducts.filter(product =>
      product.price >= (filters.priceRange?.min || 0) &&
      product.price <= (filters.priceRange?.max || Infinity)
    );
  }
  
  return filteredProducts;
};

/**
 * Pagination Utilities
 */

// Calculate total pages
export const calculateTotalPages = (totalItems: number, pageSize: number): number => {
  if (pageSize <= 0) return 0;
  return Math.ceil(totalItems / pageSize);
};

// Get paginated items
export const getPaginatedItems = <T>(items: T[], currentPage: number, pageSize: number): T[] => {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return items.slice(startIndex, endIndex);
};

// Create pagination config
export const createPaginationConfig = (
  totalItems: number,
  currentPage: number = PAGINATION_DEFAULTS.CURRENT_PAGE,
  pageSize: number = PAGINATION_DEFAULTS.PAGE_SIZE
): PaginationConfig => {
  const totalPages = calculateTotalPages(totalItems, pageSize);
  
  return {
    currentPage: Math.max(1, Math.min(currentPage, totalPages)),
    pageSize,
    totalItems,
    totalPages,
  };
};

/**
 * Environment Utilities
 */

// Get environment configuration
export const getEnvironmentConfig = (): EnvironmentConfig => {
  return {
    apiBaseUrl: ENV.API_BASE_URL,
    isDevelopment: ENV.IS_DEVELOPMENT,
  };
};

// Debug logging (only in development)
export const debugLog = (message: string, data?: any): void => {
  if (ENV.IS_DEVELOPMENT) {
    console.log(`[DEBUG] ${message}`, data || '');
  }
};

/**
 * Data Transformation Utilities
 */

// Safe JSON parse with fallback
export const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    debugLog('JSON parse error', error);
    return fallback;
  }
};

// Generate unique ID for client-side operations
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Debounce function for search
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Check if value is empty
export const isEmpty = (value: any): boolean => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}; 