'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter, notFound } from 'next/navigation';
import { Layout, PageLayout } from '@/components/layout';
import {
  UserProfile,
  UserNotFound,
  UserProfileSkeleton,
  ProductBreadcrumb
} from '@/components/features';
import { LoadingText, Button } from '@/components/ui';
import { useUserContext } from '@/context';
import { extractUserIdFromUrl, validateUserId, isValidUserIdForApi } from '@/utils/urlParams';
import { toast } from 'react-hot-toast';

/**
 * User Selection Guide Component
 * Shows when no userId is provided in URL
 */
function UserSelectionGuide() {
  const router = useRouter();
  const [customUserId, setCustomUserId] = useState('');

  const handleUserSelect = (userId: number) => {
    router.push(`/profile?userId=${userId}`);
  };

  const handleCustomUserSubmit = () => {
    if (customUserId) {
      handleUserSelect(parseInt(customUserId));
    }
  };

  const sampleUsers = [
    { id: 1, name: 'Leanne Graham', username: 'Bret', description: 'Sample user from Sincere@april.biz' },
    { id: 2, name: 'Ervin Howell', username: 'Antonette', description: 'Sample user from Shanna@melissa.tv' },
    { id: 3, name: 'Clementine Bauch', username: 'Samantha', description: 'Sample user from Nathan@yesenia.net' },
    { id: 4, name: 'Patricia Lebsack', username: 'Karianne', description: 'Sample user from Julianne.OConner@kory.org' },
    { id: 5, name: 'Chelsey Dietrich', username: 'Kamren', description: 'Sample user from Lucio_Hettinger@annie.ca' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          User Profiles
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select a user to view their profile information and manage account settings.
        </p>
      </div>

      {/* User Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {sampleUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => handleUserSelect(user.id)}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold text-white">
                  {user.name.split(' ').map(n => n.charAt(0)).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{user.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">User ID: {user.id}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleUserSelect(user.id)}
              >
                View Profile
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom User ID Input */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          Try a Custom User ID
        </h3>
        <p className="text-blue-800 mb-4">
          You can also view any user by adding <code className="bg-blue-100 px-2 py-1 rounded">?userId=NUMBER</code> to the URL, or enter a user ID below:
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="number"
            placeholder="Enter user ID (1-10)"
            min="1"
            max="10"
            value={customUserId}
            onChange={(e) => setCustomUserId(e.target.value)}
            className="flex-1 px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCustomUserSubmit();
              }
            }}
          />
          <Button 
            variant="primary"
            onClick={handleCustomUserSubmit}
          >
            View Profile
          </Button>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          About User Profiles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">What you'll see:</h4>
            <ul className="space-y-1">
              <li>• Complete user information</li>
              <li>• Contact details and address</li>
              <li>• Profile avatar with initials</li>
              <li>• Responsive design for all devices</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Profile Features:</h4>
            <ul className="space-y-1">
              <li>• Profile icon appears in header</li>
              <li>• URL parameter integration</li>
              <li>• Real-time data from JSONPlaceholder API</li>
              <li>• Error handling for invalid users</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading, error, setUserId, userId: contextUserId } = useUserContext();
  
  const [localError, setLocalError] = useState<string | null>(null);
  const [userIdParam, setUserIdParam] = useState<string | null>(null);
  const [parsedUserId, setParsedUserId] = useState<number | null>(null);

  // Extract userId from URL parameters
  useEffect(() => {
    const userIdFromUrl = searchParams.get('userId');
    setUserIdParam(userIdFromUrl);
    
    // If no userId provided, we'll show the user selection guide
    if (!userIdFromUrl) {
      setLocalError(null);
      setParsedUserId(null);
      return;
    }

    const validatedUserId = validateUserId(userIdFromUrl);
    setParsedUserId(validatedUserId);

    if (!validatedUserId) {
      setLocalError('Invalid user ID format');
      toast.error('Invalid user ID format. Please provide a valid number.');
      return;
    }

    if (!isValidUserIdForApi(validatedUserId)) {
      setLocalError('User ID is outside valid range');
      toast.error('User ID must be between 1 and 10000.');
      return;
    }

    // Update UserContext with the userId
    if (validatedUserId !== contextUserId) {
      setUserId(validatedUserId);
      setLocalError(null);
    }
  }, [searchParams, setUserId, contextUserId]);

  // Handle case where user is not found after loading
  useEffect(() => {
    if (parsedUserId && !isLoading && !user && !error) {
      setLocalError('User not found');
      toast.error(`User ${parsedUserId} was not found`);
    }
  }, [parsedUserId, isLoading, user, error]);

  const handleNavigateToProducts = () => {
    router.push('/');
  };

  // Show user selection guide when no userId is provided
  if (!userIdParam) {
    return (
      <Layout>
        <PageLayout maxWidth="7xl" padding="md">
          {/* Breadcrumb */}
          <div className="mb-6">
            <ProductBreadcrumb 
              productTitle="User Profiles" 
              showHome={true}
            />
          </div>

          <UserSelectionGuide />
        </PageLayout>
      </Layout>
    );
  }

  // Show loading state
  if (isLoading || (!user && parsedUserId && !localError && !error)) {
    return (
      <Layout>
        <PageLayout maxWidth="7xl" padding="md">
          {/* Breadcrumb skeleton */}
          <div className="mb-6">
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
          </div>

          {/* Page title skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-96 mt-2 animate-pulse" />
          </div>

          {/* Profile skeleton */}
          <UserProfileSkeleton />

          {/* Loading text */}
          <div className="mt-8 flex justify-center">
            <LoadingText text="Loading user profile..." />
          </div>
        </PageLayout>
      </Layout>
    );
  }

  // Show error states
  if (localError || error || !parsedUserId) {
    return (
      <Layout>
        <PageLayout maxWidth="7xl" padding="md">
          {/* Breadcrumb */}
          <div className="mb-6">
            <ProductBreadcrumb 
              productTitle="Profile" 
              showHome={true}
            />
          </div>

          {/* User not found component */}
          <UserNotFound
            userId={parsedUserId}
            userIdParam={userIdParam}
            onNavigateToProducts={handleNavigateToProducts}
            title={localError === 'No user ID provided in URL' ? 'No User Selected' : 'User Not Found'}
            showSuggestions={true}
            showErrorDetails={true}
          />
        </PageLayout>
      </Layout>
    );
  }

  // Show user not found if user data is missing
  if (!user) {
    return (
      <Layout>
        <PageLayout maxWidth="7xl" padding="md">
          <div className="mb-6">
            <ProductBreadcrumb 
              productTitle="Profile" 
              showHome={true}
            />
          </div>

          <UserNotFound
            userId={parsedUserId}
            userIdParam={userIdParam}
            onNavigateToProducts={handleNavigateToProducts}
            showSuggestions={true}
            showErrorDetails={true}
          />
        </PageLayout>
      </Layout>
    );
  }

  // Main profile display
  const fullName = `${user.name.firstname} ${user.name.lastname}`;

  return (
    <Layout>
      <PageLayout maxWidth="7xl" padding="md">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <ProductBreadcrumb 
            productTitle={`${fullName}'s Profile`}
            showHome={true}
          />
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                User Profile
              </h1>
              <p className="text-gray-600">
                Viewing profile information for {fullName}
              </p>
            </div>

            {/* Profile Actions */}
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push('/profile')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                All Users
              </button>

              <button
                onClick={handleNavigateToProducts}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2h10a2 2 0 012 2v2M7 7V5a2 2 0 012-2h6a2 2 0 012 2v2" />
                </svg>
                Browse Products
              </button>

              <button
                onClick={() => window.location.href = '/cart'}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 7.2M7 13l5.2-13.6M16 13l1.8 7.2" />
                </svg>
                View Cart
              </button>
            </div>
          </div>
        </div>

        {/* User Profile Component */}
        <UserProfile 
          user={user}
          isLoading={false}
          variant="default"
          showAllDetails={true}
        />

        {/* Additional Information Section */}
        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-4 rounded border">
              <span className="font-medium text-gray-700">Profile URL:</span>
              <p className="text-gray-600 break-all mt-1">
                {window.location.href}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded border">
              <span className="font-medium text-gray-700">User ID:</span>
              <p className="text-gray-600 mt-1">
                {user.id}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded border">
              <span className="font-medium text-gray-700">Profile Status:</span>
              <p className="text-green-600 font-medium mt-1">
                Active
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Help */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Navigation Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Other Users</h4>
              <p className="text-sm text-blue-700 mb-2">
                Try viewing other user profiles by changing the userId parameter:
              </p>
              <div className="space-x-2">
                {[1, 2, 3, 4, 5].map((id) => (
                  <button
                    key={id}
                    onClick={() => window.location.href = `?userId=${id}`}
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      user.id === id 
                        ? 'bg-blue-200 text-blue-800' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                    disabled={user.id === id}
                  >
                    User {id}
                    {user.id === id && (
                      <span className="ml-1 text-blue-600">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Quick Actions</h4>
              <div className="space-y-2 text-sm">
                <button
                  onClick={() => router.push('/profile')}
                  className="block text-left text-blue-700 hover:text-blue-900"
                >
                  → View all users
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="block text-left text-blue-700 hover:text-blue-900"
                >
                  → Browse all products
                </button>
                <button
                  onClick={() => router.push('/cart')}
                  className="block text-left text-blue-700 hover:text-blue-900"
                >
                  → View shopping cart
                </button>
                <button
                  onClick={() => router.push(`/?userId=${user.id}`)}
                  className="block text-left text-blue-700 hover:text-blue-900"
                >
                  → Browse products as this user
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>
            Manage your profile information and account preferences.
          </p>
          <p className="mt-1">
            Profile features are available when a valid userId parameter is provided in the URL.
          </p>
        </div>
      </PageLayout>
    </Layout>
  );
} 