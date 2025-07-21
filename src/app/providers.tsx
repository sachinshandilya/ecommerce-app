'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useState, Suspense } from 'react';
import { 
  UserContextProvider, 
  ProductsContextProvider, 
  CartContextProvider 
} from '@/context';

/**
 * Providers component that wraps the application with necessary context providers
 * Includes React Query client, toast notifications, and application contexts
 * Provider hierarchy: QueryClient -> User -> Products -> Cart
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance for each app session
  // This ensures no caching between sessions as per requirements
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 0,                    // Data immediately stale
          gcTime: 0,                       // No cache retention
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
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <UserContextProvider>
          <ProductsContextProvider>
            <CartContextProvider>
              {children}
            </CartContextProvider>
          </ProductsContextProvider>
        </UserContextProvider>
      </Suspense>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
} 