// Core Product Interface
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// Cart Item Interface - Hybrid approach with optional product data
export interface CartItem {
  productId: number;
  quantity: number;
  productData?: Product;
}

// User Interface - Matching FakeStore API structure
export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: {
      lat: string;
      long: string;
    };
  };
  phone: string;
}

// Application State Interfaces
export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface FilterConfig {
  searchTerm: string;
  selectedCategories: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}

// Context Type Interfaces
export interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => void;
}

export interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUserId: (userId: number | null) => void;
}

export interface ProductsContextType {
  products: Product[];
  filteredProducts: Product[];
  categories: string[];
  filters: FilterConfig;
  pagination: PaginationConfig;
  isLoading: boolean;
  error: string | null;
  setFilters: (filters: Partial<FilterConfig>) => void;
  setPagination: (pagination: Partial<PaginationConfig>) => void;
  searchProducts: (searchTerm: string) => void;
  filterByCategory: (categories: string[]) => void;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Loading and Status Types
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Cart API Types
export interface CartApiItem {
  productId: number;
  quantity: number;
}

export interface CartApiResponse {
  id: number;
  userId: number;
  date: string;
  products: CartApiItem[];
}

// Environment Variables Type
export interface EnvironmentConfig {
  apiBaseUrl: string;
  isDevelopment: boolean;
}

// Utility Types
export type ProductSortField = 'title' | 'price' | 'rating' | 'category';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: ProductSortField;
  direction: SortDirection;
} 