import { QueryClient } from '@tanstack/react-query';

/**
 * React Query Client Configuration
 * Configured with no caching as per technical requirements
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,                    // Data immediately stale
      gcTime: 0,                       // No cache retention (renamed from cacheTime in v5)
      refetchOnWindowFocus: false,     // Don't refetch on window focus
      refetchOnMount: true,            // Refetch on component mount
      refetchOnReconnect: false,       // Don't refetch on reconnect
      retry: false,                    // No retry logic as per requirements
      retryOnMount: false,             // No retry on mount
      refetchInterval: false,          // No background refetching
      refetchIntervalInBackground: false,
    },
    mutations: {
      retry: false,                    // No retry for mutations
      retryDelay: 0,                   // No retry delay
    },
  },
});

/**
 * Development-only query client configuration
 * For creating fresh instances when needed
 */
export const createQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: false,
        retry: false,
        retryOnMount: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
      },
      mutations: {
        retry: false,
        retryDelay: 0,
      },
    },
  });
}; 