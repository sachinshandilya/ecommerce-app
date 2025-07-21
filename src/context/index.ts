// Export all context providers and hooks for easy importing

// Cart Context
export { 
  CartContextProvider, 
  useCartContext, 
  withCartContext 
} from './CartContext';

// User Context
export { 
  UserContextProvider, 
  useUserContext, 
  useCurrentUserId, 
  useIsAuthenticated, 
  withUserContext 
} from './UserContext';

// Products Context
export { 
  ProductsContextProvider, 
  useProductsContext, 
  useFilteredProducts, 
  useCurrentFilters, 
  usePaginationInfo, 
  withProductsContext 
} from './ProductsContext'; 