import { mockApiResponses, setupFetchMock, createMockFetchResponse } from './apiMocks';

describe('API Mocks', () => {
  describe('mockApiResponses', () => {
    it('should contain all expected response types', () => {
      expect(mockApiResponses).toHaveProperty('products');
      expect(mockApiResponses).toHaveProperty('singleProduct');
      expect(mockApiResponses).toHaveProperty('categories');
      expect(mockApiResponses).toHaveProperty('user');
      expect(mockApiResponses).toHaveProperty('cart');
    });

    it('should have valid products array', () => {
      expect(Array.isArray(mockApiResponses.products)).toBe(true);
      expect(mockApiResponses.products.length).toBeGreaterThan(0);
    });
  });

  describe('createMockFetchResponse', () => {
    it('should create a resolved promise with response', async () => {
      const data = { test: 'data' };
      const response = await createMockFetchResponse(data);
      
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      
      const json = await response.json();
      expect(json).toEqual(data);
    });
  });

  describe('setupFetchMock', () => {
    it('should setup fetch mock without throwing', () => {
      expect(() => {
        setupFetchMock({ test: 'data' });
      }).not.toThrow();
    });
  });
}); 