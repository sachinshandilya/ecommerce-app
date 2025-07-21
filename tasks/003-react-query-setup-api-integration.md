# Task 003: React Query Setup and API Integration

## Overview
Configure React Query with no caching, implement custom hooks for data fetching, and integrate with API service layer.

## Priority: High
**Estimated Time**: 4 hours  
**Dependencies**: Task 002 (TypeScript Interfaces and API Configuration)  
**Completion Criteria**: React Query working with custom hooks for all API operations

## Implementation Details

### 1. React Query Client Configuration
Create `/src/lib/queryClient.ts` with:

#### No-Cache Configuration
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,           // Data immediately stale
      cacheTime: 0,           // No cache retention  
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,           // No retry logic
    },
    mutations: {
      retry: false,           // No retry for mutations
    },
  },
});
```

### 2. Query Client Provider Setup
Update `/src/app/layout.tsx` to include:
- React Query Client Provider wrapper
- QueryClient instance from configuration
- Proper provider hierarchy for the application

### 3. Custom Hooks Implementation
Create individual hook files in `/src/hooks/`:

#### Products Data Hook (`useProducts.tsx`)
```typescript
// Structure example - not full implementation
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    // No caching configuration
  });
};
```

#### Individual Product Hook (`useProduct.tsx`)
- Hook for fetching single product by ID
- Handle loading and error states
- Return typed product data

#### Categories Hook (`useCategories.tsx`)
- Fetch all available categories
- Used for filter component population
- Handle API errors gracefully

#### User Data Hook (`useUser.tsx`)
- Fetch user by ID from URL parameters
- Handle invalid user ID scenarios
- Return user data with loading/error states

### 4. Cart Operations Hooks (`useCart.tsx`)
Implement mutation hooks for cart operations:

#### Add to Cart Mutation
```typescript
export const useAddToCart = () => {
  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      // Success handling
    },
    onError: (error) => {
      // Error handling with toast
    },
  });
};
```

#### Remove from Cart Mutation
- Mutation for removing items from cart
- Handle success and error states
- Integrate with toast notifications

### 5. Search and Filter Hook (`useDebounce.tsx`)
Create debouncing hook for search functionality:
- 1-second delay for search queries
- Cancel previous searches when new input received
- Return debounced value for API calls

### 6. Error Handling Integration
Implement error handling for all hooks:
- Consistent error message format
- Integration with react-hot-toast
- Network failure handling
- Invalid data response handling

### 7. Loading State Management
Configure loading states for:
- Initial data fetching (products, categories)
- Individual API calls (product details, user data)
- Mutation operations (cart add/remove)
- Search and filter operations

## Hook Integration Patterns

### Query Hook Structure
```typescript
export const useExampleData = (params?: any) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['example', params],
    queryFn: () => fetchExampleData(params),
    enabled: !!params, // Conditional fetching
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
```

### Mutation Hook Structure
```typescript
export const useExampleMutation = () => {
  return useMutation({
    mutationFn: exampleApiCall,
    onSuccess: (data) => {
      toast.success('Operation successful');
    },
    onError: (error) => {
      toast.error(error.message || 'Operation failed');
    },
  });
};
```

## Implementation Guidelines

### Query Key Strategy
- Use consistent query key patterns
- Include relevant parameters in query keys
- Ensure uniqueness for different data sets

### Error Handling Approach
- Toast notifications for all API errors
- No automatic retry logic
- Graceful degradation for failed requests
- User-friendly error messages

### Performance Considerations
- No caching means fresh data on every request
- Minimize unnecessary API calls
- Efficient query key management
- Proper cleanup for unmounted components

## Acceptance Criteria
- [ ] React Query client configured with no caching
- [ ] All API endpoints have corresponding custom hooks
- [ ] Error handling works with toast notifications
- [ ] Loading states are properly managed
- [ ] Debounced search hook implemented
- [ ] Cart mutation hooks functional
- [ ] No TypeScript errors in hook implementations
- [ ] Hooks can be imported and used in components

## Code Quality Checklist
- [ ] Each hook file under 300 lines
- [ ] Descriptive hook and function names
- [ ] Proper TypeScript typing for all hooks
- [ ] Consistent error handling patterns
- [ ] All imports at top of files
- [ ] No unused imports or variables

## File Structure After Completion
```
/src
  /lib
    queryClient.ts        # React Query configuration
  /hooks
    useProducts.tsx       # Products fetching hook
    useProduct.tsx        # Single product hook
    useCategories.tsx     # Categories hook
    useUser.tsx          # User data hook
    useCart.tsx          # Cart operations hooks
    useDebounce.tsx      # Debouncing utility hook
```

## Integration Testing
- Test all hooks with actual API endpoints
- Verify error handling with network failures
- Confirm loading states work correctly
- Validate debounced search functionality
- Test cart mutations with success/error scenarios

## Next Steps
After completion, this task enables:
- Task 004: Context Providers Implementation
- Task 007: Product Listing and Search/Filter Features
- Task 008: Product Details Page Implementation

## Performance Notes
- Fresh data fetching may impact performance
- Consider implementing loading indicators for better UX
- Monitor API call frequency during development
- Ensure proper cleanup to prevent memory leaks 