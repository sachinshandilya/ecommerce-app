import { fetchProducts, fetchProductById, fetchCategories, fetchUserById, addToCart } from '../api';
import { setupFetchMock, mockApiResponses } from '../../test-utils/apiMocks';
import { createMockProduct, createMockUser } from '../../test-utils/mockData';

describe('API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchProducts', () => {
    it('should return product array', async () => {
      setupFetchMock(mockApiResponses.products);
      
      const result = await fetchProducts();
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://fakestoreapi.com/products',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' }
        })
      );
      expect(result).toEqual(mockApiResponses.products);
    });


  });

  describe('fetchProductById', () => {
    it('should return single product for valid ID', async () => {
      const mockProduct = createMockProduct({ id: 1 });
      setupFetchMock(mockProduct);
      
      const result = await fetchProductById(1);
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://fakestoreapi.com/products/1',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' }
        })
      );
      expect(result).toEqual(mockProduct);
    });



    it('should handle string ID conversion', async () => {
      const mockProduct = createMockProduct({ id: 5 });
      setupFetchMock(mockProduct);
      
      const result = await fetchProductById('5' as any);
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://fakestoreapi.com/products/5',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' }
        })
      );
      expect(result).toEqual(mockProduct);
    });
  });

  describe('fetchCategories', () => {
    it('should return categories array', async () => {
      setupFetchMock(mockApiResponses.categories);
      
      const result = await fetchCategories();
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://fakestoreapi.com/products/categories',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' }
        })
      );
      expect(result).toEqual(mockApiResponses.categories);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty categories response', async () => {
      setupFetchMock([]);
      
      const result = await fetchCategories();
      
      expect(result).toEqual([]);
    });


  });

  describe('fetchUserById', () => {
    it('should return user for valid ID', async () => {
      const mockUser = createMockUser({ id: 1 });
      setupFetchMock(mockUser);
      
      const result = await fetchUserById(1);
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://fakestoreapi.com/users/1',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' }
        })
      );
      expect(result).toEqual(mockUser);
    });


  });

  describe('addToCart', () => {
    it('should add item to cart successfully', async () => {
      setupFetchMock(mockApiResponses.addToCartResponse);
      
      const result = await addToCart(1, 1, 2);
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://fakestoreapi.com/carts',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
      expect(result).toEqual(mockApiResponses.addToCartResponse);
    });

    it('should handle default quantity', async () => {
      setupFetchMock(mockApiResponses.addToCartResponse);
      
      const result = await addToCart(1, 1);
      
      expect(result).toEqual(mockApiResponses.addToCartResponse);
    });


  });
}); 