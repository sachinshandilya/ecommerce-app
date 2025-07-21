import { 
  PAGINATION_DEFAULTS, 
  ERROR_MESSAGES, 
  STORAGE_KEYS,
  API_CONFIG,
  VALIDATION_RULES,
  FILTER_DEFAULTS,
  SUCCESS_MESSAGES
} from '../constants';

describe('Constants', () => {
  describe('API_CONFIG', () => {
    it('should contain API configuration', () => {
      expect(API_CONFIG).toBeDefined();
      expect(API_CONFIG.BASE_URL).toBeDefined();
      expect(API_CONFIG.TIMEOUT).toBeDefined();
      expect(API_CONFIG.RETRY_ATTEMPTS).toBeDefined();
    });

    it('should have valid base URL', () => {
      expect(typeof API_CONFIG.BASE_URL).toBe('string');
      expect(API_CONFIG.BASE_URL).toMatch(/^https?:\/\/.+/);
      expect(API_CONFIG.BASE_URL).toBe('https://fakestoreapi.com');
    });

    it('should have reasonable timeout and retry values', () => {
      expect(typeof API_CONFIG.TIMEOUT).toBe('number');
      expect(API_CONFIG.TIMEOUT).toBeGreaterThan(0);
      expect(typeof API_CONFIG.RETRY_ATTEMPTS).toBe('number');
      expect(API_CONFIG.RETRY_ATTEMPTS).toBeGreaterThanOrEqual(0);
    });
  });

  describe('PAGINATION_DEFAULTS', () => {
    it('should contain pagination configuration', () => {
      expect(PAGINATION_DEFAULTS).toBeDefined();
      expect(PAGINATION_DEFAULTS.PAGE_SIZE).toBeDefined();
      expect(PAGINATION_DEFAULTS.CURRENT_PAGE).toBeDefined();
      expect(PAGINATION_DEFAULTS.PAGE_SIZE_OPTIONS).toBeDefined();
    });

    it('should have reasonable default values', () => {
      expect(PAGINATION_DEFAULTS.PAGE_SIZE).toBeGreaterThan(0);
      expect(PAGINATION_DEFAULTS.CURRENT_PAGE).toBeGreaterThanOrEqual(1);
      expect(typeof PAGINATION_DEFAULTS.PAGE_SIZE).toBe('number');
      expect(typeof PAGINATION_DEFAULTS.CURRENT_PAGE).toBe('number');
    });

    it('should have expected default values', () => {
      expect(PAGINATION_DEFAULTS.PAGE_SIZE).toBe(50);
      expect(PAGINATION_DEFAULTS.CURRENT_PAGE).toBe(1);
    });
  });

  describe('ERROR_MESSAGES', () => {
    it('should contain all error message types', () => {
      expect(ERROR_MESSAGES).toBeDefined();
      expect(ERROR_MESSAGES.NETWORK_ERROR).toBeDefined();
      expect(ERROR_MESSAGES.API_ERROR).toBeDefined();
      expect(ERROR_MESSAGES.PRODUCT_NOT_FOUND).toBeDefined();
      expect(ERROR_MESSAGES.USER_NOT_FOUND).toBeDefined();
      expect(ERROR_MESSAGES.VALIDATION_ERROR).toBeDefined();
    });

    it('should have non-empty error messages', () => {
      Object.values(ERROR_MESSAGES).forEach(message => {
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      });
    });

    it('should have user-friendly error messages', () => {
      expect(ERROR_MESSAGES.NETWORK_ERROR.toLowerCase()).toContain('network');
      expect(ERROR_MESSAGES.PRODUCT_NOT_FOUND.toLowerCase()).toContain('not found');
      expect(ERROR_MESSAGES.USER_NOT_FOUND.toLowerCase()).toContain('not found');
      expect(ERROR_MESSAGES.VALIDATION_ERROR.toLowerCase()).toContain('invalid');
    });
  });

  describe('STORAGE_KEYS', () => {
    it('should contain storage key definitions', () => {
      expect(STORAGE_KEYS).toBeDefined();
      expect(STORAGE_KEYS.CART_ITEMS).toBeDefined();
      expect(STORAGE_KEYS.USER_PREFERENCES).toBeDefined();
      expect(STORAGE_KEYS.LAST_VISITED_PRODUCTS).toBeDefined();
    });

    it('should have consistent naming convention', () => {
      Object.values(STORAGE_KEYS).forEach(key => {
        expect(typeof key).toBe('string');
        expect(key).toContain('ecommerce_'); // App prefix
      });
    });

    it('should have unique storage keys', () => {
      const keys = Object.values(STORAGE_KEYS);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(keys.length);
    });
  });

  describe('VALIDATION_RULES', () => {
    it('should contain validation configuration', () => {
      expect(VALIDATION_RULES).toBeDefined();
      expect(VALIDATION_RULES.MIN_USER_ID).toBeDefined();
      expect(VALIDATION_RULES.MAX_USER_ID).toBeDefined();
      expect(VALIDATION_RULES.MIN_PRODUCT_ID).toBeDefined();
      expect(VALIDATION_RULES.MAX_PRODUCT_ID).toBeDefined();
    });

    it('should have reasonable validation limits', () => {
      expect(VALIDATION_RULES.MIN_USER_ID).toBe(1);
      expect(VALIDATION_RULES.MAX_USER_ID).toBe(10);
      expect(VALIDATION_RULES.MIN_PRODUCT_ID).toBe(1);
      expect(VALIDATION_RULES.MAX_PRODUCT_ID).toBe(20);
    });

    it('should have search length limits', () => {
      expect(VALIDATION_RULES.MIN_SEARCH_LENGTH).toBeGreaterThanOrEqual(1);
      expect(VALIDATION_RULES.MAX_SEARCH_LENGTH).toBeGreaterThan(VALIDATION_RULES.MIN_SEARCH_LENGTH);
    });
  });

  describe('FILTER_DEFAULTS', () => {
    it('should contain filter defaults', () => {
      expect(FILTER_DEFAULTS).toBeDefined();
      expect(FILTER_DEFAULTS.SEARCH_TERM).toBeDefined();
      expect(FILTER_DEFAULTS.SELECTED_CATEGORIES).toBeDefined();
      expect(FILTER_DEFAULTS.DEBOUNCE_DELAY).toBeDefined();
    });

    it('should have reasonable default values', () => {
      expect(FILTER_DEFAULTS.SEARCH_TERM).toBe('');
      expect(Array.isArray(FILTER_DEFAULTS.SELECTED_CATEGORIES)).toBe(true);
      expect(FILTER_DEFAULTS.DEBOUNCE_DELAY).toBeGreaterThan(0);
    });
  });

  describe('SUCCESS_MESSAGES', () => {
    it('should contain success messages', () => {
      expect(SUCCESS_MESSAGES).toBeDefined();
      expect(SUCCESS_MESSAGES.PRODUCT_ADDED_TO_CART).toBeDefined();
      expect(SUCCESS_MESSAGES.CART_UPDATED).toBeDefined();
    });

    it('should have non-empty success messages', () => {
      Object.values(SUCCESS_MESSAGES).forEach(message => {
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Configuration Consistency', () => {
    it('should have consistent configuration structure', () => {
      // Verify that all exported constants are defined
      expect(API_CONFIG).toBeDefined();
      expect(PAGINATION_DEFAULTS).toBeDefined();
      expect(ERROR_MESSAGES).toBeDefined();
      expect(STORAGE_KEYS).toBeDefined();
      expect(VALIDATION_RULES).toBeDefined();
      expect(FILTER_DEFAULTS).toBeDefined();
    });

    it('should have appropriate data types', () => {
      expect(typeof API_CONFIG).toBe('object');
      expect(typeof PAGINATION_DEFAULTS).toBe('object');
      expect(typeof ERROR_MESSAGES).toBe('object');
      expect(typeof STORAGE_KEYS).toBe('object');
      expect(typeof VALIDATION_RULES).toBe('object');
      expect(typeof FILTER_DEFAULTS).toBe('object');
    });
  });
}); 