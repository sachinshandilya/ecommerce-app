import type { Product, User, CartItem } from '@/types';

export const createMockProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  title: 'Test Product',
  price: 29.99,
  description: 'Test product description for testing purposes',
  category: 'electronics',
  image: 'https://example.com/test-image.jpg',
  rating: {
    rate: 4.5,
    count: 100,
  },
  ...overrides,
});

export const createMockProducts = (count: number = 3): Product[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockProduct({
      id: index + 1,
      title: `Test Product ${index + 1}`,
      price: (index + 1) * 10 + 0.99,
      category: ['electronics', 'jewelery', 'clothing'][index % 3],
    })
  );
};

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  email: 'john@gmail.com',
  username: 'johnd',
  password: 'm38rmF$',
  name: {
    firstname: 'John',
    lastname: 'Doe',
  },
  address: {
    city: 'kilcoole',
    street: '7835 new road',
    number: 3,
    zipcode: '12926-3874',
    geolocation: {
      lat: '-37.3159',
      long: '81.1496',
    },
  },
  phone: '1-570-236-7033',
  ...overrides,
});

export const createMockCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  productId: 1,
  quantity: 2,
  ...overrides,
});

export const createMockCart = (itemCount: number = 2) => ({
  id: 1,
  userId: 1,
  date: '2020-03-02T00:00:00.000Z',
  products: Array.from({ length: itemCount }, (_, index) =>
    createMockCartItem({
      productId: index + 1,
      quantity: index + 1,
    })
  ),
});

// Categories mock data
export const mockCategories = [
  'electronics',
  'jewelery',
  'men\'s clothing',
  'women\'s clothing',
];

// Error responses
export const createMockError = (message: string = 'Test error', status: number = 500) => ({
  message,
  status,
  error: true,
});

// Pagination mock data
export const createMockPaginatedResponse = <T>(
  items: T[],
  page: number = 1,
  limit: number = 10
) => ({
  data: items.slice((page - 1) * limit, page * limit),
  total: items.length,
  page,
  limit,
  totalPages: Math.ceil(items.length / limit),
}); 