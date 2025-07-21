import { createMockProduct, createMockUser, createMockProducts, mockCategories } from './mockData';

describe('Mock Data Factories', () => {
  describe('createMockProduct', () => {
    it('should create a mock product with default values', () => {
      const product = createMockProduct();
      
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('title');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('image');
      expect(product).toHaveProperty('rating');
    });

    it('should create a mock product with overrides', () => {
      const overrides = { id: 999, title: 'Custom Product' };
      const product = createMockProduct(overrides);
      
      expect(product.id).toBe(999);
      expect(product.title).toBe('Custom Product');
    });
  });

  describe('createMockProducts', () => {
    it('should create multiple mock products', () => {
      const products = createMockProducts(5);
      
      expect(products).toHaveLength(5);
      expect(products[0].id).toBe(1);
      expect(products[4].id).toBe(5);
    });
  });

  describe('createMockUser', () => {
    it('should create a mock user with default values', () => {
      const user = createMockUser();
      
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('address');
      expect(user).toHaveProperty('phone');
    });
  });

  describe('mockCategories', () => {
    it('should contain expected categories', () => {
      expect(Array.isArray(mockCategories)).toBe(true);
      expect(mockCategories.length).toBeGreaterThan(0);
      expect(mockCategories).toContain('electronics');
    });
  });
}); 