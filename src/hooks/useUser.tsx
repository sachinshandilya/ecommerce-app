import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchUserById } from '@/utils/api';
import { User } from '@/types';
import { toast } from 'react-hot-toast';
import { isValidUserId } from '@/utils/helpers';

/**
 * Hook for fetching user data by ID
 * Used when userId is present in URL parameters
 */
export const useUser = (userId: number | null) => {
  const isValidId = userId && isValidUserId(userId);

  const { data, isLoading, error, refetch } = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => fetchUserById(userId!),
    enabled: isValidId, // Only fetch if user ID is valid
  });

  // Handle errors with toast notifications
  useEffect(() => {
    if (error && isValidId) {
      const errorMessage = (error as any)?.message || `Failed to load user ${userId}`;
      toast.error(errorMessage);
    }
  }, [error, userId, isValidId]);

  return {
    user: data,
    isLoading,
    error,
    refetch,
    isValidId,
    hasUserId: !!userId,
  };
};

/**
 * Hook for checking if a user exists without showing error notifications
 * Useful for validation purposes
 */
export const useUserExists = (userId: number | null) => {
  const isValidId = userId && isValidUserId(userId);

  const { data, error } = useQuery<User>({
    queryKey: ['user-exists', userId],
    queryFn: () => fetchUserById(userId!),
    enabled: isValidId,
  });

  return {
    exists: !!data,
    user: data,
    isValidId,
    notFound: error && !data,
  };
}; 