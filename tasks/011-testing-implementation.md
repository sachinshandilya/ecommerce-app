# Task 011: Testing Implementation

## Overview
Implement comprehensive unit testing for utility functions and business logic using Jest and React Testing Library, with mock API responses and proper test coverage.

## Priority: Medium
**Estimated Time**: 6 hours  
**Dependencies**: Task 001-010 (All previous tasks)  
**Completion Criteria**: Complete test suite covering utility functions, custom hooks, and critical business logic

## Implementation Details

### 1. Testing Configuration Setup

#### Jest Configuration (`jest.config.js`)
- Configure Jest for Next.js compatibility
- Set up jsdom environment for component testing
- Configure module path mapping to match TypeScript paths
- Set up test coverage reporting

#### Setup Files
```typescript
// jest.setup.js
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));
```

### 2. Utility Functions Testing (`/src/utils/__tests__/`)

#### API Functions Tests (`api.test.ts`)
```typescript
// Test structure example
describe('API Functions', () => {
  beforeEach(() => {
    // Reset fetch mocks
    jest.clearAllMocks();
  });

  test('fetchProducts returns product array', async () => {
    // Mock fetch response
    // Call fetchProducts
    // Assert response structure and data
  });

  test('fetchProductById handles invalid ID', async () => {
    // Mock API error response
    // Call fetchProductById with invalid ID
    // Assert error handling
  });
});
```

#### Helper Functions Tests (`helpers.test.ts`)
- Test price formatting functions
- Test URL parameter parsing utilities
- Test product filtering and search utilities
- Test data validation helpers

#### Constants Tests (`constants.test.ts`)
- Verify API endpoints are correctly defined
- Test pagination default values
- Validate error message constants

### 3. Custom Hooks Testing (`/src/hooks/__tests__/`)

#### Debounce Hook Tests (`useDebounce.test.ts`)
```typescript
describe('useDebounce', () => {
  test('debounces value changes', async () => {
    // Render hook with initial value
    // Update value multiple times quickly
    // Assert only final value is debounced
    // Verify timing with fake timers
  });

  test('handles empty and null values', () => {
    // Test edge cases with various input types
  });
});
```

#### Cart Operations Tests (`useCart.test.ts`)
- Test add to cart functionality with mocked API
- Test remove from cart operations
- Test cart total calculations
- Test loading state management
- Test error handling scenarios

### 4. Business Logic Testing

#### Cart Context Tests (`/src/context/__tests__/CartContext.test.tsx`)
```typescript
describe('CartContext', () => {
  test('calculates cart total correctly', () => {
    // Create mock cart items with various prices
    // Render CartContext provider
    // Assert total calculation is correct
  });

  test('handles add to cart operation', async () => {
    // Mock API responses
    // Trigger add to cart
    // Assert state updates and API calls
  });
});
```

#### Products Context Tests (`ProductsContext.test.tsx`)
- Test product filtering logic
- Test search functionality
- Test pagination calculations
- Test category filtering

#### User Context Tests (`UserContext.test.tsx`)
- Test URL parameter extraction
- Test user data fetching
- Test error handling for invalid users

### 5. Component Testing Strategy

#### UI Components Tests (`/src/components/ui/__tests__/`)
```typescript
// Button component test example
describe('Button Component', () => {
  test('renders with correct variant styles', () => {
    render(<Button variant="primary">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('expected-classes');
  });

  test('shows loading state', () => {
    render(<Button isLoading>Test</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
```

#### Feature Components Tests
- Test ProductCard rendering with mock data
- Test SearchBar functionality with debounced input
- Test Pagination component with various configurations
- Test CartItem component with remove functionality

### 6. Mock Data and API Responses

#### Mock Data Factory (`/src/__tests__/mocks/`)
```typescript
// mockData.ts
export const createMockProduct = (overrides = {}): Product => ({
  id: 1,
  title: 'Test Product',
  price: 29.99,
  description: 'Test description',
  category: 'test-category',
  image: 'test-image.jpg',
  rating: { rate: 4.5, count: 100 },
  ...overrides,
});

export const createMockUser = (overrides = {}): User => ({
  // Mock user data structure
});

export const createMockCartItem = (overrides = {}): CartItem => ({
  // Mock cart item structure
});
```

#### API Response Mocks
```typescript
// apiMocks.ts
export const mockApiResponses = {
  products: [createMockProduct(), createMockProduct({ id: 2 })],
  categories: ['electronics', 'clothing', 'books'],
  user: createMockUser(),
  cartOperationSuccess: { success: true },
};
```

### 7. Test Utilities and Helpers

#### Custom Render Function
```typescript
// testUtils.tsx
export const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <CartContextProvider>
        <UserContextProvider>
          <ProductsContextProvider>
            {ui}
          </ProductsContextProvider>
        </UserContextProvider>
      </CartContextProvider>
    </QueryClientProvider>
  );
};
```

## Testing Guidelines

### Unit Testing Focus Areas
- **Utility Functions**: All helper functions and API calls
- **Custom Hooks**: Debounce, API hooks, context hooks
- **Business Logic**: Cart calculations, filtering, search
- **Error Handling**: API failures, validation errors
- **Edge Cases**: Empty states, invalid inputs, boundary conditions

### Mock Strategy
- **API Calls**: Mock fetch responses for all API endpoints
- **External Dependencies**: Mock React Query, Next.js router
- **Context Providers**: Test with mock context values
- **Local Storage**: Mock browser APIs when needed

### Test Coverage Goals
- **Utility Functions**: 100% coverage
- **Custom Hooks**: 90%+ coverage
- **Business Logic**: 95%+ coverage
- **Error Paths**: All error scenarios tested

### Testing Best Practices
- **Descriptive Test Names**: Clear test descriptions
- **Arrange-Act-Assert**: Consistent test structure
- **Mock Isolation**: Independent test cases
- **Edge Case Coverage**: Test boundary conditions
- **Error Scenarios**: Test all error paths

## Acceptance Criteria
- [ ] All utility functions have comprehensive unit tests
- [ ] Custom hooks are tested with proper mocking
- [ ] Business logic tests cover cart operations and filtering
- [ ] API functions are tested with mock responses
- [ ] Error handling scenarios are covered
- [ ] Test suite runs successfully with npm test
- [ ] Test coverage meets minimum requirements
- [ ] Mock data factories provide consistent test data
- [ ] Tests are maintainable and well-documented

## Code Quality Checklist
- [ ] Test files follow naming convention (*.test.ts/tsx)
- [ ] All tests have descriptive names
- [ ] Mock data is consistent and reusable
- [ ] Tests are independent and isolated
- [ ] Error cases are properly tested
- [ ] Async operations are properly awaited
- [ ] Clean up resources in test teardown

## File Structure After Completion
```
/src
  /__tests__
    /mocks
      mockData.ts         # Mock data factories
      apiMocks.ts         # API response mocks
    testUtils.tsx         # Custom testing utilities
  /utils
    /__tests__
      api.test.ts         # API functions tests
      helpers.test.ts     # Utility functions tests
      constants.test.ts   # Constants validation tests
  /hooks
    /__tests__
      useDebounce.test.ts # Debounce hook tests
      useCart.test.ts     # Cart operations tests
  /context
    /__tests__
      CartContext.test.tsx    # Cart context tests
      UserContext.test.tsx    # User context tests
      ProductsContext.test.tsx # Products context tests
  /components
    /ui
      /__tests__
        Button.test.tsx   # UI component tests
        Input.test.tsx
        Loading.test.tsx
```

## Test Execution Commands
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --coverage --watchAll=false"
  }
}
```

## Integration with Development Workflow
- **Pre-commit Hooks**: Run tests before commits
- **Continuous Integration**: Automated test runs
- **Coverage Reports**: Monitor test coverage trends
- **Development Testing**: Use watch mode during development

## Common Testing Patterns
- **API Mocking**: Consistent fetch mock patterns
- **Context Testing**: Provider wrapper testing
- **Async Testing**: Proper async/await handling
- **Error Testing**: Error boundary and error state testing
- **Loading Testing**: Loading state verification

## Next Steps
After completion, this task enables:
- Task 012: Final Integration and Polish
- Confidence in code quality and reliability
- Maintainable codebase with test coverage

## Troubleshooting Common Issues
- **Async Tests**: Ensure proper async/await usage
- **Context Mocking**: Provide proper context values
- **Timer Issues**: Use Jest fake timers for debounce testing
- **Module Mocking**: Proper Next.js and external library mocking 