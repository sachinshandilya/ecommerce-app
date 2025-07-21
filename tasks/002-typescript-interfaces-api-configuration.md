# Task 002: TypeScript Interfaces and API Configuration

## Overview
Define all TypeScript interfaces for the application and set up the API service layer for FakeStore API integration.

## Priority: High
**Estimated Time**: 3 hours  
**Dependencies**: Task 001 (Project Setup)  
**Completion Criteria**: Complete type definitions and API service functions ready for use

## Implementation Details

### 1. Core TypeScript Interfaces
Create `/src/types/index.ts` with the following interfaces:

#### Product Interface
```typescript
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
```

#### Cart and User Interfaces
- Define `CartItem` interface with hybrid approach: `{productId: number, quantity: number, productData?: Product}`
- Define `User` interface matching FakeStore API response structure
- Include nested address and name objects as per API specification

#### Application State Interfaces
- `PaginationConfig` for client-side pagination state
- `FilterConfig` for search and category filtering
- Context type interfaces for each provider (CartContext, UserContext, ProductsContext)

### 2. API Service Layer Setup
Create `/src/utils/api.ts` with:

#### API Configuration
- Base URL constant: `https://fakestoreapi.com`
- API endpoints constants object with all required endpoints
- Request configuration for fetch operations

#### Core API Functions
```typescript
// Example structure (not full implementation)
export const fetchProducts = async (): Promise<Product[]> => {
  // Fetch all products implementation
  // Include proper error handling
  // Return typed response
};

export const fetchProductById = async (id: number): Promise<Product> => {
  // Single product fetch implementation
};

export const fetchCategories = async (): Promise<string[]> => {
  // Categories fetch implementation
};

export const fetchUserById = async (id: number): Promise<User> => {
  // User data fetch implementation
};
```

#### Cart API Functions
- `addToCart` function for POST/PUT cart operations
- `removeFromCart` function for cart item removal
- Error handling for cart operations

### 3. API Response Handling
- Create utility functions for API response validation
- Implement basic error handling helpers
- Add response type guards for runtime safety

### 4. Constants and Enums
Create `/src/utils/constants.ts` with:
- API endpoint URLs
- Pagination default values (page sizes: 50, 100, 200)
- Error messages for consistent UX
- Loading states and status enums

### 5. Helper Utilities
Create `/src/utils/helpers.ts` with:
- URL parameter parsing functions (for userId extraction)
- Price formatting utilities
- Product filtering and search utilities
- Data validation helpers

### 6. Environment Variables Types
- Create environment variable type definitions
- Ensure `NEXT_PUBLIC_API_BASE_URL` is properly typed
- Add development environment detection utilities

### 7. Error Types
Define error interfaces for:
- API error responses
- Network failure types
- Validation error types
- User-friendly error messages

## Implementation Guidelines

### API Service Patterns
- Use async/await pattern for all API calls
- Implement proper error handling with try-catch blocks
- No retry logic (as per requirements)
- Return typed responses matching interface definitions

### Type Safety Approach
- Use lenient TypeScript configuration (not strict mode)
- Provide default values for optional properties
- Use union types for status and state enums
- Avoid complex generic types

### Error Handling Strategy
- Create consistent error response format
- Include user-friendly error messages
- Prepare for toast notification integration
- Handle malformed API responses gracefully

## Acceptance Criteria
- [ ] All interfaces match FakeStore API response structure
- [ ] API service functions are properly typed
- [ ] Utility functions handle edge cases
- [ ] Constants are centralized and typed
- [ ] Environment variables are accessible and typed
- [ ] Error handling is consistent across all functions
- [ ] TypeScript compilation succeeds without errors
- [ ] API functions can be imported in other modules

## Code Quality Checklist
- [ ] Max 300 lines per file rule followed
- [ ] All imports at top of files
- [ ] Descriptive function and variable names
- [ ] No single-letter variable names
- [ ] Consistent naming conventions (camelCase for functions)
- [ ] Proper JSDoc comments for public functions

## Testing Preparation
- Structure API functions for easy mocking
- Include sample response data for testing
- Create mock data generators for each interface
- Prepare API response validation functions

## File Structure After Completion
```
/src
  /types
    index.ts              # All TypeScript interfaces
  /utils
    api.ts               # API service layer
    constants.ts         # Application constants  
    helpers.ts           # Utility functions
```

## Integration Points
These types and API functions will be used by:
- React Query hooks (Task 003)
- Context providers (Task 004)
- UI components for data display
- Testing utilities for mocking

## Next Steps
After completion, this task enables:
- Task 003: React Query Setup and API Integration
- Task 004: Context Providers Implementation

## Validation Tests
- Verify all interfaces compile without errors
- Test API functions with actual FakeStore endpoints
- Validate error handling with network simulation
- Confirm environment variables are accessible 