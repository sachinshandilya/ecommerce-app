// Pagination Constants
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 50,
  CURRENT_PAGE: 1,
  PAGE_SIZE_OPTIONS: [50, 100, 200],
  MAX_PAGE_SIZE: 200,
} as const;

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://fakestoreapi.com',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 0, // No retry as per requirements
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  API_ERROR: 'An error occurred while fetching data.',
  PRODUCT_NOT_FOUND: 'Product not found.',
  USER_NOT_FOUND: 'User not found.',
  CART_ERROR: 'An error occurred while updating your cart.',
  VALIDATION_ERROR: 'Invalid data provided.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
  LOADING_ERROR: 'Failed to load data. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  PRODUCT_ADDED_TO_CART: 'Product added to cart successfully!',
  PRODUCT_REMOVED_FROM_CART: 'Product removed from cart.',
  CART_UPDATED: 'Cart updated successfully!',
  DATA_LOADED: 'Data loaded successfully.',
} as const;

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
} as const;

// Filter Constants
export const FILTER_DEFAULTS = {
  SEARCH_TERM: '',
  SELECTED_CATEGORIES: [],
  DEBOUNCE_DELAY: 1000, // 1 second as per requirements
} as const;

// Cart Constants
export const CART_DEFAULTS = {
  DEFAULT_QUANTITY: 1,
  MAX_QUANTITY: 999,
  MIN_QUANTITY: 1,
} as const;

// Sort Options
export const SORT_OPTIONS = {
  TITLE_ASC: { field: 'title', direction: 'asc' },
  TITLE_DESC: { field: 'title', direction: 'desc' },
  PRICE_ASC: { field: 'price', direction: 'asc' },
  PRICE_DESC: { field: 'price', direction: 'desc' },
  RATING_ASC: { field: 'rating', direction: 'asc' },
  RATING_DESC: { field: 'rating', direction: 'desc' },
} as const;

// Validation Constants
export const VALIDATION_RULES = {
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 100,
  MIN_USER_ID: 1,
  MAX_USER_ID: 10, // FakeStore API has users 1-10
  MIN_PRODUCT_ID: 1,
  MAX_PRODUCT_ID: 20, // FakeStore API has products 1-20
} as const;

// Environment Detection
export const ENV = {
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || API_CONFIG.BASE_URL,
} as const;

// Route Constants
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAILS: '/products/[id]',
  CART: '/cart',
  PROFILE: '/profile',
  CHECKOUT: '/checkout',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  CART_ITEMS: 'ecommerce_cart_items',
  USER_PREFERENCES: 'ecommerce_user_preferences',
  LAST_VISITED_PRODUCTS: 'ecommerce_last_visited',
} as const;

// Toast Configuration
export const TOAST_CONFIG = {
  DURATION: 4000, // 4 seconds
  POSITION: 'top-right',
  MAX_TOASTS: 3,
} as const;

// Image Configuration
export const IMAGE_CONFIG = {
  PRODUCT_IMAGE_QUALITY: 75,
  PRODUCT_IMAGE_SIZES: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  PLACEHOLDER_IMAGE: '/placeholder-product.png',
  USER_AVATAR_SIZE: 40,
} as const;

// Responsive Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const; 