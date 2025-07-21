import { Product, User, CartApiResponse } from '@/types';

/**
 * Mock data for testing and development
 */

// Mock Products
export const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Sample Product 1',
    price: 29.99,
    description: 'This is a sample product description for testing purposes.',
    category: 'electronics',
    image: 'https://via.placeholder.com/300x300.png?text=Product+1',
    rating: {
      rate: 4.5,
      count: 120,
    },
  },
  {
    id: 2,
    title: 'Sample Product 2',
    price: 39.99,
    description: 'Another sample product for testing filtering and search.',
    category: 'clothing',
    image: 'https://via.placeholder.com/300x300.png?text=Product+2',
    rating: {
      rate: 4.0,
      count: 85,
    },
  },
];

// Mock User
export const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  username: 'testuser',
  password: 'password123',
  name: {
    firstname: 'John',
    lastname: 'Doe',
  },
  address: {
    city: 'New York',
    street: 'Broadway',
    number: 123,
    zipcode: '10001',
    geolocation: {
      lat: '40.7128',
      long: '-74.0060',
    },
  },
  phone: '+1-555-0123',
};

// Mock Categories
export const mockCategories: string[] = [
  'electronics',
  'clothing',
  'books',
  'home',
];

// Mock Cart Response
export const mockCartResponse: CartApiResponse = {
  id: 1,
  userId: 1,
  date: '2024-01-01',
  products: [
    { productId: 1, quantity: 2 },
    { productId: 2, quantity: 1 },
  ],
};

// Generate mock product by ID
export const generateMockProduct = (id: number): Product => ({
  id,
  title: `Mock Product ${id}`,
  price: Math.round((Math.random() * 100 + 10) * 100) / 100,
  description: `This is a mock product description for product ${id}.`,
  category: mockCategories[Math.floor(Math.random() * mockCategories.length)],
  image: `https://via.placeholder.com/300x300.png?text=Product+${id}`,
  rating: {
    rate: Math.round((Math.random() * 4 + 1) * 10) / 10,
    count: Math.floor(Math.random() * 200 + 10),
  },
});

// Generate mock products array
export const generateMockProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, index) => generateMockProduct(index + 1));
}; 