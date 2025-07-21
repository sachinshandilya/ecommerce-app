# Task 004: Context Providers Implementation

## Overview
Implement React Context providers for cart management, user state, and products filtering using the hybrid cart approach and no state persistence.

## Priority: High
**Estimated Time**: 6 hours  
**Dependencies**: Task 003 (React Query Setup and API Integration)  
**Completion Criteria**: Working context providers managing application state with proper integration

## Implementation Details

### 1. Cart Context Implementation (`/src/context/CartContext.tsx`)

#### Cart State Structure
```typescript
interface CartContextType {
  cartItems: CartItem[];                    // Hybrid: {productId, quantity, productData?}
  addToCart: (productId: number) => Promise<void>;
  removeFromCart: (productId: number) => void;
  cartTotal: number;
  cartCount: number;
  isLoading: boolean;
}
```

#### Cart Context Features
- **Hybrid State Management**: Store product IDs with quantities, fetch product data when needed
- **No Persistence**: State lost on page refresh (in-memory only)
- **API Integration**: Use React Query hooks for cart operations
- **Loading States**: Show loading during add/remove operations
- **Total Calculation**: Real-time cart total and item count computation

#### Implementation Requirements
- Integrate with `useAddToCart` and `useRemoveFromCart` hooks
- Fetch product details when `productData` is missing
- Handle API failures with toast notifications
- Disable cart operations during loading states

### 2. User Context Implementation (`/src/context/UserContext.tsx`)

#### User State Structure
```typescript
interface UserContextType {
  userId: number | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUserId: (id: number | null) => void;
}
```

#### User Context Features
- **URL Parameter Integration**: Extract userId from URL query parameters
- **Client-side Validation**: Validate userId format (numeric only)
- **API Integration**: Use `useUser` hook for data fetching
- **Error Handling**: Handle invalid/missing users with toast notifications
- **No Persistence**: User state resets on navigation

#### Implementation Requirements
- Parse `?userId=1` from URL parameters
- Validate user existence through API calls
- Show error toast for invalid users
- Reset user state when userId is removed from URL

### 3. Products Context Implementation (`/src/context/ProductsContext.tsx`)

#### Products State Structure
```typescript
interface ProductsContextType {
  products: Product[];
  filteredProducts: Product[];
  categories: string[];
  filters: FilterConfig;
  pagination: PaginationConfig;
  setFilters: (filters: FilterConfig) => void;
  setPagination: (pagination: PaginationConfig) => void;
  isLoading: boolean;
}
```

#### Products Context Features
- **Client-side Operations**: All filtering and pagination done locally
- **Search Integration**: 1-second debounced search functionality
- **Category Filtering**: Multi-select category filters
- **Pagination**: Configurable page sizes (50, 100, 200 items)
- **No Persistence**: Filters reset on page refresh

#### Implementation Requirements
- Load all products on initialization using `useProducts` hook
- Load categories using `useCategories` hook
- Implement real-time filtering based on search and category selection
- Calculate pagination based on filtered results
- Reset filters and pagination on page refresh

### 4. Context Provider Hierarchy
Update `/src/app/layout.tsx` to include context providers:

```typescript
// Provider hierarchy structure
<QueryClientProvider client={queryClient}>
  <UserContextProvider>
    <ProductsContextProvider>
      <CartContextProvider>
        {children}
      </CartContextProvider>
    </ProductsContextProvider>
  </UserContextProvider>
</QueryClientProvider>
```

### 5. Context Hook Utilities
Create custom hooks for consuming contexts:

#### Cart Context Hook
```typescript
export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartContextProvider');
  }
  return context;
};
```

#### Similar hooks for User and Products contexts
- `useUserContext()`
- `useProductsContext()`
- Proper error handling for context usage outside providers

## Implementation Guidelines

### State Management Patterns
- **No Redux**: Use only React Context for state management
- **Separation of Concerns**: Each context handles specific domain logic
- **React Query Integration**: Leverage hooks for API operations
- **Error Boundaries**: Integrate with error boundary components

### Performance Considerations
- **Context Optimization**: Minimize unnecessary re-renders
- **Memoization**: Use useMemo for expensive calculations (cart totals, filtered products)
- **Selective Updates**: Update only necessary state portions
- **Loading States**: Show appropriate loading indicators during operations

### Error Handling Strategy
- **Toast Integration**: Use react-hot-toast for all error notifications
- **Graceful Degradation**: Handle API failures without breaking UI
- **User Feedback**: Provide clear error messages and recovery options
- **State Consistency**: Maintain consistent state even after errors

## Acceptance Criteria
- [ ] Cart context manages hybrid cart state correctly
- [ ] User context extracts and validates userId from URL
- [ ] Products context handles search, filtering, and pagination
- [ ] All contexts integrate with React Query hooks
- [ ] Loading states work across all contexts
- [ ] Error handling shows toast notifications
- [ ] No state persistence (resets on refresh)
- [ ] Context providers work in proper hierarchy
- [ ] Custom context hooks have proper error handling

## Code Quality Checklist
- [ ] Each context file under 300 lines
- [ ] Descriptive variable and function names
- [ ] Proper TypeScript typing for all contexts
- [ ] All imports at top of files
- [ ] No unused variables or imports
- [ ] Consistent error handling patterns
- [ ] Proper JSDoc comments for public functions

## File Structure After Completion
```
/src
  /context
    CartContext.tsx       # Cart state and operations
    UserContext.tsx       # User state and URL handling
    ProductsContext.tsx   # Products, filters, pagination
    index.ts             # Export all contexts and hooks
```

## Integration Points
These contexts will be consumed by:
- Header component (cart count, user profile icon)
- Product listing components (filtered products, pagination)
- Cart page (cart items, totals)
- Product details page (add to cart functionality)
- User profile page (user data display)

## Testing Strategy
- Test context providers with mock React Query hooks
- Verify state updates trigger re-renders correctly
- Test error scenarios with API failures
- Validate URL parameter parsing and validation
- Confirm cart calculations work correctly

## Next Steps
After completion, this task enables:
- Task 006: Layout Components and Error Boundaries
- Task 007: Product Listing and Search/Filter Features
- Task 009: Shopping Cart Functionality
- Task 010: User Profile Implementation

## Performance Monitoring
- Monitor context re-render frequency
- Optimize expensive calculations with memoization
- Ensure proper cleanup of event listeners
- Validate memory usage with large product datasets 