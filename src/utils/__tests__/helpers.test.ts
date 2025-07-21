import { 
  formatPrice, 
  extractUserIdFromUrl,
  createUrlWithUserId,
  isValidUserId,
  isValidProductId,
  isValidSearchTerm,
  filterProductsBySearch,
  filterProductsByCategories,
  debounce,
  truncateText,
  capitalizeFirst,
  generateId,
  isEmpty
} from '../helpers';
import { createMockProduct, createMockUser, createMockProducts } from '../../test-utils/mockData';
import type { Product } from '@/types';

describe('Helper Functions', () => {
  describe('formatPrice', () => {
    it('should format price with default currency', () => {
      expect(formatPrice(29.99)).toBe('$29.99');
      expect(formatPrice(0)).toBe('$0.00');
      expect(formatPrice(100)).toBe('$100.00');
    });

    it('should format price with custom currency', () => {
      expect(formatPrice(29.99, 'EUR')).toBe('€29.99');
      expect(formatPrice(29.99, 'GBP')).toBe('£29.99');
    });

    it('should handle decimal places correctly', () => {
      expect(formatPrice(29.999)).toBe('$30.00');
      expect(formatPrice(29.001)).toBe('$29.00');
      expect(formatPrice(29.5)).toBe('$29.50');
    });

    it('should handle negative prices', () => {
      expect(formatPrice(-10)).toBe('-$10.00');
    });

    it('should handle large numbers', () => {
      expect(formatPrice(999999.99)).toBe('$999,999.99');
    });
  });

  describe('URL Utilities', () => {
    describe('extractUserIdFromUrl', () => {
      it('should extract valid user ID from search params', () => {
        const searchParams = new URLSearchParams('?userId=5');
        const userId = extractUserIdFromUrl(searchParams);
        
        expect(userId).toBe(5);
      });

      it('should return null for invalid user ID', () => {
        const searchParams = new URLSearchParams('?userId=999');
        const userId = extractUserIdFromUrl(searchParams);
        
        expect(userId).toBe(null);
      });

      it('should return null when no userId param', () => {
        const searchParams = new URLSearchParams('?other=value');
        const userId = extractUserIdFromUrl(searchParams);
        
        expect(userId).toBe(null);
      });
    });

    describe('createUrlWithUserId', () => {
      it('should create URL with user ID', () => {
        const baseUrl = '/profile';
        const userId = 5;
        const result = createUrlWithUserId(baseUrl, userId);
        
        expect(result).toContain('userId=5');
      });

      it('should return base URL when no user ID', () => {
        const baseUrl = '/profile';
        const result = createUrlWithUserId(baseUrl, null);
        
        expect(result).toBe(baseUrl);
      });
    });
  });

  describe('Validation', () => {
    describe('isValidUserId', () => {
      it('should validate correct user IDs', () => {
        expect(isValidUserId(1)).toBe(true);
        expect(isValidUserId(5)).toBe(true);
        expect(isValidUserId(10)).toBe(true);
      });

      it('should reject invalid user IDs', () => {
        expect(isValidUserId(0)).toBe(false);
        expect(isValidUserId(11)).toBe(false);
        expect(isValidUserId(-1)).toBe(false);
      });
    });

    describe('isValidProductId', () => {
      it('should validate correct product IDs', () => {
        expect(isValidProductId(1)).toBe(true);
        expect(isValidProductId(10)).toBe(true);
        expect(isValidProductId(20)).toBe(true);
      });

      it('should reject invalid product IDs', () => {
        expect(isValidProductId(0)).toBe(false);
        expect(isValidProductId(21)).toBe(false);
        expect(isValidProductId(-1)).toBe(false);
      });
    });

    describe('isValidSearchTerm', () => {
      it('should validate correct search terms', () => {
        expect(isValidSearchTerm('phone')).toBe(true);
        expect(isValidSearchTerm('a')).toBe(true);
      });

      it('should reject invalid search terms', () => {
        expect(isValidSearchTerm('')).toBe(false);
        expect(isValidSearchTerm('a'.repeat(101))).toBe(false);
      });
    });
  });

  describe('Product Filtering', () => {
    const mockProducts = createMockProducts(5);
    const electronicsProduct = createMockProduct({ id: 1, category: 'electronics', title: 'iPhone' });
    const clothingProduct = createMockProduct({ id: 2, category: 'clothing', title: 'T-Shirt' });
    const testProducts = [electronicsProduct, clothingProduct, ...mockProducts];

    describe('filterProductsByCategories', () => {
      it('should filter products by categories', () => {
        const result = filterProductsByCategories(testProducts, ['electronics']);
        
        expect(result.length).toBeGreaterThanOrEqual(2); // At least electronicsProduct and others with electronics category
        expect(result.every(p => p.category === 'electronics')).toBe(true);
      });

      it('should return all products for empty categories', () => {
        const result = filterProductsByCategories(testProducts, []);
        
        expect(result).toEqual(testProducts);
      });

      it('should handle multiple categories', () => {
        const result = filterProductsByCategories(testProducts, ['electronics', 'clothing']);
        
        expect(result.length).toBeGreaterThan(2);
      });
    });

    describe('filterProductsBySearch', () => {
      it('should filter products by title search', () => {
        const result = filterProductsBySearch(testProducts, 'iPhone');
        
        expect(result).toHaveLength(1);
        expect(result[0].title).toContain('iPhone');
      });

      it('should filter products by description search', () => {
        const productsWithDescription = testProducts.map(p => ({
          ...p,
          description: p.id === 1 ? 'Latest smartphone technology' : p.description
        }));
        
        const result = filterProductsBySearch(productsWithDescription, 'smartphone');
        
        expect(result.length).toBeGreaterThan(0);
        expect(result.some(p => p.description.includes('smartphone'))).toBe(true);
      });

      it('should be case insensitive', () => {
        const result = filterProductsBySearch(testProducts, 'iphone');
        
        expect(result).toHaveLength(1);
        expect(result[0].title.toLowerCase()).toContain('iphone');
      });

      it('should return all products for empty search', () => {
        const result = filterProductsBySearch(testProducts, '');
        
        expect(result).toEqual(testProducts);
      });

      it('should return empty array for no matches', () => {
        const result = filterProductsBySearch(testProducts, 'xyznomatch');
        
        expect(result).toEqual([]);
      });
    });
  });

  describe('Text Utilities', () => {
    describe('truncateText', () => {
      it('should truncate long text', () => {
        const longText = 'This is a very long text that should be truncated';
        const result = truncateText(longText, 20);
        
        expect(result).toBe('This is a very long...');
      });

      it('should return original text if short enough', () => {
        const shortText = 'Short text';
        const result = truncateText(shortText, 20);
        
        expect(result).toBe('Short text');
      });

      it('should handle empty text', () => {
        const result = truncateText('', 10);
        
        expect(result).toBe('');
      });
    });

    describe('capitalizeFirst', () => {
      it('should capitalize first letter', () => {
        expect(capitalizeFirst('hello')).toBe('Hello');
        expect(capitalizeFirst('HELLO')).toBe('Hello');
      });

      it('should handle empty string', () => {
        expect(capitalizeFirst('')).toBe('');
      });
    });
  });

  describe('Utility Functions', () => {
    describe('debounce', () => {
      beforeEach(() => {
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it('should delay function execution', () => {
        const mockFn = jest.fn();
        const debouncedFn = debounce(mockFn, 300);
        
        debouncedFn('test');
        expect(mockFn).not.toHaveBeenCalled();
        
        jest.advanceTimersByTime(300);
        expect(mockFn).toHaveBeenCalledWith('test');
      });

      it('should cancel previous calls', () => {
        const mockFn = jest.fn();
        const debouncedFn = debounce(mockFn, 300);
        
        debouncedFn('first');
        debouncedFn('second');
        debouncedFn('third');
        
        jest.advanceTimersByTime(300);
        
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith('third');
      });
    });

    describe('generateId', () => {
      it('should generate unique IDs', () => {
        const id1 = generateId();
        const id2 = generateId();
        
        expect(id1).not.toBe(id2);
        expect(typeof id1).toBe('string');
        expect(typeof id2).toBe('string');
      });

      it('should generate IDs of consistent format', () => {
        const id = generateId();
        
        expect(id).toMatch(/^[a-zA-Z0-9]+$/);
        expect(id.length).toBeGreaterThan(0);
      });
    });

    describe('isEmpty', () => {
      it('should detect empty values', () => {
        expect(isEmpty(null)).toBe(true);
        expect(isEmpty(undefined)).toBe(true);
        expect(isEmpty('')).toBe(true);
        expect(isEmpty('   ')).toBe(true);
        expect(isEmpty([])).toBe(true);
        expect(isEmpty({})).toBe(true);
      });

      it('should detect non-empty values', () => {
        expect(isEmpty('hello')).toBe(false);
        expect(isEmpty([1, 2, 3])).toBe(false);
        expect(isEmpty({ key: 'value' })).toBe(false);
        expect(isEmpty(0)).toBe(false);
      });
    });
  });
}); 