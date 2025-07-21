import { useState, useEffect } from 'react';
import { FILTER_DEFAULTS } from '@/utils/constants';

/**
 * Hook for debouncing search input
 * Implements 1-second delay as per requirements
 */
export const useDebounce = <T,>(value: T, delay: number = FILTER_DEFAULTS.DEBOUNCE_DELAY): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout on value change or component unmount
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook specifically for search term debouncing
 * Pre-configured with 1-second delay for search operations
 */
export const useSearchDebounce = (searchTerm: string): string => {
  return useDebounce(searchTerm, FILTER_DEFAULTS.DEBOUNCE_DELAY);
};

/**
 * Hook for debounced search with loading state
 * Provides loading indicator while debouncing
 */
export const useDebounceWithLoading = <T,>(
  value: T, 
  delay: number = FILTER_DEFAULTS.DEBOUNCE_DELAY
): { debouncedValue: T; isDebouncing: boolean } => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);

  useEffect(() => {
    setIsDebouncing(true);
    
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  // Initial load should not show debouncing
  useEffect(() => {
    if (debouncedValue === value) {
      setIsDebouncing(false);
    }
  }, [debouncedValue, value]);

  return { debouncedValue, isDebouncing };
}; 