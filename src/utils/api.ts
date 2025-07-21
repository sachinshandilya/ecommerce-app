import { Product, User, CartApiResponse, CartApiItem, ApiError } from '@/types';

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://fakestoreapi.com';

// API Endpoints
export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  PRODUCT_BY_ID: '/products',
  CATEGORIES: '/products/categories',
  PRODUCTS_BY_CATEGORY: '/products/category',
  USERS: '/users',
  CARTS: '/carts',
} as const;

// Request configuration
const defaultFetchConfig: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// API Error handler
const handleApiError = (error: any, context: string): ApiError => {
  console.error(`API Error in ${context}:`, error);
  
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      message: 'Network error. Please check your internet connection.',
      code: 'NETWORK_ERROR',
    };
  }
  
  if (error.status) {
    return {
      message: error.message || 'An error occurred while fetching data.',
      status: error.status,
      code: 'API_ERROR',
    };
  }
  
  return {
    message: 'An unexpected error occurred.',
    code: 'UNKNOWN_ERROR',
  };
};

// Generic fetch function with error handling
const apiRequest = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = { ...defaultFetchConfig, ...options };
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw {
        message: `HTTP error! status: ${response.status}`,
        status: response.status,
      };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw handleApiError(error, endpoint);
  }
};

// Product API Functions
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const products = await apiRequest<Product[]>(API_ENDPOINTS.PRODUCTS);
    
    // Validate and provide defaults for malformed data
    return products.map(product => ({
      id: product.id || 0,
      title: product.title || 'Unknown Product',
      price: product.price || 0,
      description: product.description || '',
      category: product.category || 'uncategorized',
      image: product.image || '',
      rating: {
        rate: product.rating?.rate || 0,
        count: product.rating?.count || 0,
      },
    }));
  } catch (error) {
    throw handleApiError(error, 'fetchProducts');
  }
};

export const fetchProductById = async (id: number): Promise<Product> => {
  try {
    const product = await apiRequest<Product>(`${API_ENDPOINTS.PRODUCT_BY_ID}/${id}`);
    
    // Validate and provide defaults
    return {
      id: product.id || 0,
      title: product.title || 'Unknown Product',
      price: product.price || 0,
      description: product.description || '',
      category: product.category || 'uncategorized',
      image: product.image || '',
      rating: {
        rate: product.rating?.rate || 0,
        count: product.rating?.count || 0,
      },
    };
  } catch (error) {
    throw handleApiError(error, `fetchProductById(${id})`);
  }
};

export const fetchCategories = async (): Promise<string[]> => {
  try {
    const categories = await apiRequest<string[]>(API_ENDPOINTS.CATEGORIES);
    return Array.isArray(categories) ? categories : [];
  } catch (error) {
    throw handleApiError(error, 'fetchCategories');
  }
};

export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const products = await apiRequest<Product[]>(`${API_ENDPOINTS.PRODUCTS_BY_CATEGORY}/${category}`);
    
    return products.map(product => ({
      id: product.id || 0,
      title: product.title || 'Unknown Product',
      price: product.price || 0,
      description: product.description || '',
      category: product.category || category,
      image: product.image || '',
      rating: {
        rate: product.rating?.rate || 0,
        count: product.rating?.count || 0,
      },
    }));
  } catch (error) {
    throw handleApiError(error, `fetchProductsByCategory(${category})`);
  }
};

// User API Functions
export const fetchUserById = async (id: number): Promise<User> => {
  try {
    const user = await apiRequest<User>(`${API_ENDPOINTS.USERS}/${id}`);
    
    // Validate and provide defaults for user data
    return {
      id: user.id || 0,
      email: user.email || '',
      username: user.username || '',
      password: user.password || '',
      name: {
        firstname: user.name?.firstname || '',
        lastname: user.name?.lastname || '',
      },
      address: {
        city: user.address?.city || '',
        street: user.address?.street || '',
        number: user.address?.number || 0,
        zipcode: user.address?.zipcode || '',
        geolocation: {
          lat: user.address?.geolocation?.lat || '0',
          long: user.address?.geolocation?.long || '0',
        },
      },
      phone: user.phone || '',
    };
  } catch (error) {
    throw handleApiError(error, `fetchUserById(${id})`);
  }
};

// Cart API Functions
export const addToCart = async (userId: number, productId: number, quantity: number = 1): Promise<CartApiResponse> => {
  try {
    const cartData = {
      userId,
      date: new Date().toISOString().split('T')[0],
      products: [{ productId, quantity }],
    };
    
    const response = await apiRequest<CartApiResponse>(API_ENDPOINTS.CARTS, {
      method: 'POST',
      body: JSON.stringify(cartData),
    });
    
    return response;
  } catch (error) {
    throw handleApiError(error, `addToCart(${userId}, ${productId}, ${quantity})`);
  }
};

export const updateCartItem = async (cartId: number, userId: number, productId: number, quantity: number): Promise<CartApiResponse> => {
  try {
    const cartData = {
      userId,
      date: new Date().toISOString().split('T')[0],
      products: [{ productId, quantity }],
    };
    
    const response = await apiRequest<CartApiResponse>(`${API_ENDPOINTS.CARTS}/${cartId}`, {
      method: 'PUT',
      body: JSON.stringify(cartData),
    });
    
    return response;
  } catch (error) {
    throw handleApiError(error, `updateCartItem(${cartId}, ${productId}, ${quantity})`);
  }
};

export const removeFromCart = async (cartId: number): Promise<CartApiResponse> => {
  try {
    const response = await apiRequest<CartApiResponse>(`${API_ENDPOINTS.CARTS}/${cartId}`, {
      method: 'DELETE',
    });
    
    return response;
  } catch (error) {
    throw handleApiError(error, `removeFromCart(${cartId})`);
  }
};

export const fetchUserCarts = async (userId: number): Promise<CartApiResponse[]> => {
  try {
    const carts = await apiRequest<CartApiResponse[]>(`${API_ENDPOINTS.CARTS}/user/${userId}`);
    return Array.isArray(carts) ? carts : [];
  } catch (error) {
    throw handleApiError(error, `fetchUserCarts(${userId})`);
  }
};

// Response validation utilities
export const isValidProduct = (product: any): product is Product => {
  return (
    product &&
    typeof product === 'object' &&
    typeof product.id === 'number' &&
    typeof product.title === 'string' &&
    typeof product.price === 'number'
  );
};

export const isValidUser = (user: any): user is User => {
  return (
    user &&
    typeof user === 'object' &&
    typeof user.id === 'number' &&
    typeof user.email === 'string' &&
    user.name &&
    typeof user.name === 'object'
  );
};

// Health check function
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await apiRequest<Product[]>(`${API_ENDPOINTS.PRODUCTS}?limit=1`);
    return true;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}; 