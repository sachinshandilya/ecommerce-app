import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartContextProvider } from '@/context/CartContext';
import { UserContextProvider } from '@/context/UserContext';
import { ProductsContextProvider } from '@/context/ProductsContext';

// Create a new QueryClient for each test to ensure isolation
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
      gcTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  withProviders?: boolean;
}

// Custom render function with all providers
export const renderWithProviders = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { 
    queryClient = createTestQueryClient(), 
    withProviders = true,
    ...renderOptions 
  } = options;

  const AllProviders = ({ children }: { children: React.ReactNode }) => {
    if (!withProviders) {
      return <>{children}</>;
    }

    return (
      <QueryClientProvider client={queryClient}>
        <CartContextProvider>
          <UserContextProvider>
            <ProductsContextProvider>
              {children}
            </ProductsContextProvider>
          </UserContextProvider>
        </CartContextProvider>
      </QueryClientProvider>
    );
  };

  return {
    ...render(ui, { wrapper: AllProviders, ...renderOptions }),
    queryClient,
  };
};

// Helper for rendering with only QueryClient (useful for testing hooks)
export const renderWithQueryClient = (
  ui: React.ReactElement,
  queryClient?: QueryClient
) => {
  const testQueryClient = queryClient || createTestQueryClient();
  
  const QueryProvider = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );

  return {
    ...render(ui, { wrapper: QueryProvider }),
    queryClient: testQueryClient,
  };
};

// Custom hook render helper
export const renderHookWithProviders = (
  options: { queryClient?: QueryClient; withProviders?: boolean } = {}
) => {
  const { queryClient = createTestQueryClient(), withProviders = true } = options;
  
  const wrapper = ({ children }: { children: React.ReactNode }) => {
    if (!withProviders) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    }

    return (
      <QueryClientProvider client={queryClient}>
        <CartContextProvider>
          <UserContextProvider>
            <ProductsContextProvider>
              {children}
            </ProductsContextProvider>
          </UserContextProvider>
        </CartContextProvider>
      </QueryClientProvider>
    );
  };

  return { wrapper, queryClient };
};

// Helper to wait for async operations
export const waitForLoadingToFinish = () => {
  return new Promise((resolve) => setTimeout(resolve, 0));
};

// Mock search params helper
export const createMockSearchParams = (params: Record<string, string> = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, value);
  });
  return searchParams;
};

// Helper to create mock router
export const createMockRouter = (overrides: any = {}) => ({
  push: () => {},
  replace: () => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
  prefetch: () => {},
  ...overrides,
});

// Helper for creating mock context values
export const createMockContextValue = <T extends object>(value: Partial<T>, defaults: T): T => ({
  ...defaults,
  ...value,
});

// Export the default render for convenience
export { render } from '@testing-library/react';
export * from '@testing-library/react'; 