'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui';
import { getUserIdErrorMessage } from '@/utils/urlParams';

interface UserNotFoundProps {
  userId?: number | null;
  userIdParam?: string | null;
  onNavigateToProducts?: () => void;
  className?: string;
  title?: string;
  message?: string;
  showSuggestions?: boolean;
  showErrorDetails?: boolean;
}

/**
 * User Not Found component for invalid userId error states
 * Provides helpful error messages and navigation options
 */
export function UserNotFound({
  userId,
  userIdParam,
  onNavigateToProducts,
  className = '',
  title = 'User Not Found',
  message,
  showSuggestions = true,
  showErrorDetails = true,
}: UserNotFoundProps) {
  const router = useRouter();

  const handleNavigateToProducts = () => {
    if (onNavigateToProducts) {
      onNavigateToProducts();
    } else {
      router.push('/');
    }
  };

  const handleTryAnotherUser = () => {
    // Remove userId parameter and go to products
    router.push('/');
  };

  // Generate appropriate error message
  const getErrorMessage = () => {
    if (message) {
      return message;
    }

    if (userIdParam) {
      return getUserIdErrorMessage(userIdParam);
    }

    if (userId) {
      return `User with ID ${userId} was not found. They may not exist in our system.`;
    }

    return 'No user ID was provided in the URL parameter.';
  };

  const errorMessage = getErrorMessage();

  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="max-w-lg mx-auto">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {title}
        </h1>

        {/* Error Message */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          {errorMessage}
        </p>

        {/* Error Details */}
        {showErrorDetails && (userIdParam || userId) && (
          <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Error Details</h3>
            <div className="text-sm text-gray-600 space-y-1">
              {userIdParam && (
                <p>
                  <span className="font-medium">Provided parameter:</span> "{userIdParam}"
                </p>
              )}
              {userId && (
                <p>
                  <span className="font-medium">Parsed user ID:</span> {userId}
                </p>
              )}
              <p>
                <span className="font-medium">Expected format:</span> A positive number (e.g., ?userId=1)
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleNavigateToProducts}
              variant="primary"
              size="lg"
              className="px-8"
            >
              Browse Products
            </Button>

            <Button
              onClick={handleTryAnotherUser}
              variant="outline"
              size="lg"
              className="px-8"
            >
              Try Different User
            </Button>
          </div>

          {/* Additional help link */}
          <div className="text-sm">
            <button
              onClick={() => window.location.href = '/?userId=1'}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Try with User ID 1 →
            </button>
          </div>
        </div>

        {/* Suggestions Section */}
        {showSuggestions && (
          <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg text-left">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              How to use the profile feature:
            </h3>
            <div className="space-y-3 text-blue-800">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-800 text-sm font-semibold">1</span>
                </div>
                <div>
                  <p className="font-medium">Add a userId parameter to the URL</p>
                  <p className="text-sm text-blue-700">
                    Example: <code className="bg-blue-100 px-1 rounded">/?userId=1</code>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-800 text-sm font-semibold">2</span>
                </div>
                <div>
                  <p className="font-medium">Use a valid user ID number</p>
                  <p className="text-sm text-blue-700">
                    Try user IDs 1-10 (these users exist in our demo system)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-800 text-sm font-semibold">3</span>
                </div>
                <div>
                  <p className="font-medium">Profile icon will appear in the header</p>
                  <p className="text-sm text-blue-700">
                    Click it to view the user's profile information
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => window.location.href = '/?userId=1'}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200 group"
            >
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-200 transition-colors">
                  <span className="text-sm font-semibold text-blue-600">1</span>
                </div>
                <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  User 1
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  Try this user
                </p>
              </div>
            </button>

            <button
              onClick={() => window.location.href = '/?userId=2'}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200 group"
            >
              <div className="text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-green-200 transition-colors">
                  <span className="text-sm font-semibold text-green-600">2</span>
                </div>
                <h4 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                  User 2
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  Or this user
                </p>
              </div>
            </button>

            <button
              onClick={() => window.location.href = '/?userId=3'}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200 group"
            >
              <div className="text-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-purple-200 transition-colors">
                  <span className="text-sm font-semibold text-purple-600">3</span>
                </div>
                <h4 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                  User 3
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  Maybe this one
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact User Not Found - For smaller spaces or inline errors
 */
interface CompactUserNotFoundProps {
  userId?: number | null;
  onNavigateToProducts?: () => void;
  className?: string;
}

export function CompactUserNotFound({
  userId,
  onNavigateToProducts,
  className = '',
}: CompactUserNotFoundProps) {
  const router = useRouter();

  const handleNavigateToProducts = () => {
    if (onNavigateToProducts) {
      onNavigateToProducts();
    } else {
      router.push('/');
    }
  };

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <svg
          className="h-5 w-5 text-red-500 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-900">
            User Not Found
          </h3>
          <p className="text-sm text-red-800 mt-1">
            {userId 
              ? `User ${userId} doesn't exist. Try a different user ID.`
              : 'Invalid or missing user ID parameter.'
            }
          </p>
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleNavigateToProducts}
              variant="outline"
              size="sm"
              className="text-red-700 border-red-300 hover:bg-red-100"
            >
              Browse Products
            </Button>
            <Button
              onClick={() => window.location.href = '/?userId=1'}
              variant="outline"
              size="sm"
              className="text-red-700 border-red-300 hover:bg-red-100"
            >
              Try User 1
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * User Not Found Banner - For header notifications
 */
interface UserNotFoundBannerProps {
  userId?: number | null;
  onDismiss?: () => void;
  className?: string;
}

export function UserNotFoundBanner({
  userId,
  onDismiss,
  className = '',
}: UserNotFoundBannerProps) {
  return (
    <div className={`bg-yellow-50 border-l-4 border-yellow-400 p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <svg
            className="h-5 w-5 text-yellow-400 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-yellow-800">
              User {userId} not found
            </p>
            <p className="text-sm text-yellow-700">
              Profile features are disabled. Try a different user ID.
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.location.href = '/?userId=1'}
            className="text-sm font-medium text-yellow-800 hover:text-yellow-900"
          >
            Try User 1
          </button>
          
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-yellow-400 hover:text-yellow-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 