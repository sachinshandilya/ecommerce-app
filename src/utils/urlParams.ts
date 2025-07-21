/**
 * URL Parameter Utilities
 * Helper functions for managing userId URL parameters and navigation
 */

/**
 * Extract userId from URL query parameters (client-side)
 * Works with Next.js router and window.location
 */
export const extractUserIdFromUrl = (): number | null => {
  // Check if we're running in the browser
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const url = new URL(window.location.href);
    const userIdParam = url.searchParams.get('userId');
    return validateUserId(userIdParam);
  } catch (error) {
    console.error('Error extracting userId from URL:', error);
    return null;
  }
};

/**
 * Validate userId parameter format
 * Ensures userId is a positive integer
 */
export const validateUserId = (id: string | null | undefined): number | null => {
  if (!id) {
    return null;
  }

  // Remove whitespace
  const trimmedId = id.trim();
  
  // Check if it's a valid number format
  if (!/^\d+$/.test(trimmedId)) {
    return null;
  }

  const numericId = parseInt(trimmedId, 10);
  
  // Ensure it's a positive integer
  if (numericId <= 0 || !Number.isInteger(numericId)) {
    return null;
  }

  return numericId;
};

/**
 * Build URL with userId parameter
 * Helper to create URLs while preserving other parameters
 */
export const buildUrlWithUserId = (path: string, userId: number): string => {
  try {
    const url = new URL(path, window.location.origin);
    url.searchParams.set('userId', userId.toString());
    return url.pathname + url.search;
  } catch (error) {
    console.error('Error building URL with userId:', error);
    return `${path}?userId=${userId}`;
  }
};

/**
 * Remove userId parameter from URL
 * Helper to clean URLs when user is no longer selected
 */
export const removeUserIdFromUrl = (path: string): string => {
  try {
    const url = new URL(path, window.location.origin);
    url.searchParams.delete('userId');
    return url.pathname + url.search;
  } catch (error) {
    console.error('Error removing userId from URL:', error);
    return path;
  }
};

/**
 * Check if current URL has valid userId parameter
 * Useful for conditional rendering of profile-related components
 */
export const hasValidUserIdInUrl = (): boolean => {
  const userId = extractUserIdFromUrl();
  return userId !== null;
};

/**
 * Get all URL parameters as an object
 * Utility function for accessing multiple parameters
 */
export const getUrlParameters = (): Record<string, string> => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const url = new URL(window.location.href);
    const params: Record<string, string> = {};
    
    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    return params;
  } catch (error) {
    console.error('Error getting URL parameters:', error);
    return {};
  }
};

/**
 * Update URL parameter without page reload
 * Uses browser history API for smooth navigation
 */
export const updateUrlParameter = (key: string, value: string | null): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const url = new URL(window.location.href);
    
    if (value === null) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
    
    const newUrl = url.pathname + url.search;
    window.history.replaceState({}, '', newUrl);
  } catch (error) {
    console.error('Error updating URL parameter:', error);
  }
};

/**
 * Navigate to profile page with userId
 * Helper for consistent profile navigation
 */
export const navigateToProfile = (userId: number): string => {
  return buildUrlWithUserId('/profile', userId);
};

/**
 * Navigate to products with userId preserved
 * Maintains userId context across navigation
 */
export const navigateToProductsWithUser = (userId: number): string => {
  return buildUrlWithUserId('/', userId);
};

/**
 * Parse and validate multiple user IDs from comma-separated string
 * Useful for batch operations or multiple user selection
 */
export const parseUserIds = (userIdsString: string | null): number[] => {
  if (!userIdsString) {
    return [];
  }

  try {
    return userIdsString
      .split(',')
      .map(id => validateUserId(id.trim()))
      .filter((id): id is number => id !== null);
  } catch (error) {
    console.error('Error parsing user IDs:', error);
    return [];
  }
};

/**
 * Check if userId is valid for API calls
 * Additional validation before making network requests
 */
export const isValidUserIdForApi = (userId: number | null): boolean => {
  if (userId === null || userId === undefined) {
    return false;
  }

  // Check reasonable bounds for user IDs
  // Assuming user IDs are positive integers within reasonable range
  return Number.isInteger(userId) && userId > 0 && userId <= 10000;
};

/**
 * Generate user-friendly error messages for invalid userIds
 * Consistent error messaging across the application
 */
export const getUserIdErrorMessage = (userIdParam: string | null): string => {
  if (!userIdParam) {
    return 'No user ID provided in URL';
  }

  if (userIdParam.trim() === '') {
    return 'Empty user ID parameter';
  }

  if (!/^\d+$/.test(userIdParam.trim())) {
    return 'User ID must be a number';
  }

  const numericId = parseInt(userIdParam.trim(), 10);
  
  if (numericId <= 0) {
    return 'User ID must be a positive number';
  }

  if (!isValidUserIdForApi(numericId)) {
    return 'User ID is outside valid range';
  }

  return 'Invalid user ID format';
};

/**
 * URL parameter validation schema
 * Centralized validation configuration
 */
export const URL_PARAM_VALIDATION = {
  userId: {
    required: false,
    type: 'number' as const,
    min: 1,
    max: 10000,
    validator: validateUserId,
  },
} as const;

/**
 * Type definitions for URL parameter utilities
 */
export interface UrlParameterConfig {
  key: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean';
  validator?: (value: string | null) => any;
}

/**
 * Generic URL parameter extractor with validation
 * Extensible for future parameter types
 */
export const extractParameter = <T>(
  key: string,
  config: UrlParameterConfig
): T | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const url = new URL(window.location.href);
    const value = url.searchParams.get(key);

    if (!value && config.required) {
      throw new Error(`Required parameter '${key}' is missing`);
    }

    if (!value) {
      return null;
    }

    if (config.validator) {
      return config.validator(value) as T;
    }

    // Basic type conversion
    switch (config.type) {
      case 'number':
        const num = parseFloat(value);
        return (isNaN(num) ? null : num) as T;
      case 'boolean':
        return (value.toLowerCase() === 'true') as T;
      default:
        return value as T;
    }
  } catch (error) {
    console.error(`Error extracting parameter '${key}':`, error);
    return null;
  }
}; 