'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserContextType, User } from '@/types';
import { useUser } from '@/hooks';
import { extractUserIdFromUrl, isValidUserId } from '@/utils/helpers';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * User Context Provider
 * Manages user state based on URL parameters with no persistence
 * Extracts userId from ?userId=1 parameter and fetches user data
 */
export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Get search params from Next.js
  const searchParams = useSearchParams();
  
  // Use the user hook to fetch user data
  const { user, isLoading, error: userError, isValidId } = useUser(userId);

  /**
   * Extract userId from URL parameters on mount and URL changes
   */
  useEffect(() => {
    try {
      const userIdFromUrl = extractUserIdFromUrl(searchParams);
      
      if (userIdFromUrl && isValidUserId(userIdFromUrl)) {
        setUserId(userIdFromUrl);
        setError(null);
      } else if (userIdFromUrl && !isValidUserId(userIdFromUrl)) {
        // Invalid user ID format
        setError(`Invalid user ID: ${userIdFromUrl}. Must be between 1-10.`);
        setUserId(null);
        toast.error('Invalid user ID in URL');
      } else {
        // No userId in URL
        setUserId(null);
        setError(null);
      }
    } catch (error) {
      console.error('Error parsing userId from URL:', error);
      setError('Failed to parse user ID from URL');
      setUserId(null);
    }
  }, [searchParams]);

  /**
   * Handle user API errors
   */
  useEffect(() => {
    if (userError && userId) {
      const errorMessage = (userError as any)?.message || 'Failed to load user data';
      setError(errorMessage);
      toast.error(`User ${userId} not found`);
    }
  }, [userError, userId]);

  /**
   * Programmatically set user ID
   * This can be used by components to change the current user
   */
  const handleSetUserId = useCallback((newUserId: number | null) => {
    if (newUserId === null) {
      setUserId(null);
      setError(null);
      return;
    }

    if (!isValidUserId(newUserId)) {
      setError(`Invalid user ID: ${newUserId}. Must be between 1-10.`);
      toast.error('Invalid user ID');
      return;
    }

    setUserId(newUserId);
    setError(null);
  }, []);

  /**
   * Clear user state
   */
  const clearUser = useCallback(() => {
    setUserId(null);
    setError(null);
  }, []);

  /**
   * Check if user is authenticated (has valid user data)
   */
  const isAuthenticated = Boolean(userId && user && !error);

  /**
   * Get user display name
   */
  const getUserDisplayName = useCallback(() => {
    if (!user) return null;
    
    const firstName = user.name?.firstname || '';
    const lastName = user.name?.lastname || '';
    
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    
    return user.username || user.email || `User ${user.id}`;
  }, [user]);

  const contextValue: UserContextType = {
    userId,
    user,
    isLoading,
    error: error || (userError as any)?.message || null,
    setUserId: handleSetUserId,
    clearUser,
    isAuthenticated,
    getUserDisplayName,
    isValidId: Boolean(userId && isValidId),
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * Hook to consume User Context
 * Provides type-safe access to user state and operations
 */
export function useUserContext() {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  
  return context;
}

/**
 * Hook to get current user ID from context
 * Convenience hook for components that only need the user ID
 */
export function useCurrentUserId(): number | null {
  const { userId } = useUserContext();
  return userId;
}

/**
 * Hook to check if user is authenticated
 * Convenience hook for components that need authentication status
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useUserContext();
  return isAuthenticated;
}

/**
 * HOC to wrap components that need user context
 */
export function withUserContext<P extends object>(Component: React.ComponentType<P>) {
  return function WrappedComponent(props: P) {
    return (
      <UserContextProvider>
        <Component {...props} />
      </UserContextProvider>
    );
  };
} 