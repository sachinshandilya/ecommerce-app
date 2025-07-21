import { createMockProduct, createMockProducts, createMockUser, createMockCart, mockCategories } from './mockData';

// Successful API responses
export const mockApiResponses = {
  products: createMockProducts(20),
  singleProduct: createMockProduct(),
  categories: mockCategories,
  user: createMockUser(),
  cart: createMockCart(),
  cartOperationSuccess: { 
    success: true, 
    message: 'Operation completed successfully' 
  },
  addToCartResponse: {
    id: 1,
    userId: 1,
    date: '2020-10-10T00:00:00.000Z',
    products: [{ productId: 1, quantity: 1 }],
  },
};

// Error responses
export const mockApiErrors = {
  networkError: new Error('Network error'),
  notFound: {
    message: 'Resource not found',
    status: 404,
  },
  serverError: {
    message: 'Internal server error',
    status: 500,
  },
  badRequest: {
    message: 'Bad request',
    status: 400,
  },
};

// Mock fetch responses
export const createMockFetchResponse = <T>(data: T, status: number = 200): Promise<Response> => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    headers: new Headers({
      'content-type': 'application/json',
    }),
  } as Response);
};

export const createMockFetchError = (status: number = 500, message: string = 'Error'): Promise<Response> => {
  return Promise.reject({
    message: `HTTP error! status: ${status}`,
    status,
  });
};

// Helper function to setup fetch mocks
export const setupFetchMock = (response: any, shouldReject: boolean = false) => {
  const mockFetch = global.fetch as any;
  
  if (shouldReject) {
    mockFetch.mockRejectedValueOnce(response);
  } else {
    mockFetch.mockResolvedValueOnce(createMockFetchResponse(response) as any);
  }
};

export const setupFetchErrorMock = (status: number = 500, message: string = 'Error') => {
  const mockFetch = global.fetch as any;
  mockFetch.mockRejectedValueOnce({
    message: `HTTP error! status: ${status}`,
    status,
  });
}; 