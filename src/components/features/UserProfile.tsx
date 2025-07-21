import React from 'react';
import { User } from '@/types';
import { Badge } from '../ui';
import { capitalizeFirst } from '@/utils/helpers';

interface UserProfileProps {
  user: User;
  isLoading?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'card';
  showAllDetails?: boolean;
}

/**
 * User Profile component displaying comprehensive user information
 * Supports multiple variants and responsive design
 */
export function UserProfile({
  user,
  isLoading = false,
  className = '',
  variant = 'default',
  showAllDetails = true,
}: UserProfileProps) {
  if (isLoading) {
    return <UserProfileSkeleton variant={variant} className={className} />;
  }

  // Format full name
  const fullName = `${capitalizeFirst(user.name.firstname)} ${capitalizeFirst(user.name.lastname)}`;
  
  // Format address
  const fullAddress = `${user.address.number} ${user.address.street}, ${user.address.city}, ${user.address.zipcode}`;

  if (variant === 'compact') {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-4">
          {/* Profile Avatar */}
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-blue-600">
              {user.name.firstname.charAt(0).toUpperCase()}{user.name.lastname.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Basic Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {fullName}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              @{user.username}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {user.email}
            </p>
          </div>

          {/* User ID Badge */}
          <Badge variant="default" size="sm">
            ID: {user.id}
          </Badge>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow ${className}`}>
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-lg">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-blue-600">
                {user.name.firstname.charAt(0).toUpperCase()}{user.name.lastname.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">{fullName}</h2>
              <p className="text-blue-100">@{user.username}</p>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700">{user.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-700">{user.phone}</span>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Address</h3>
            <div className="flex items-start space-x-3">
              <svg className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="text-gray-700">
                <p>{fullAddress}</p>
                {showAllDetails && (
                  <p className="text-sm text-gray-500 mt-1">
                    Coordinates: {user.address.geolocation.lat}, {user.address.geolocation.long}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
          {/* Profile Avatar */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 sm:mb-0">
            <span className="text-2xl font-bold text-white">
              {user.name.firstname.charAt(0).toUpperCase()}{user.name.lastname.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Basic Information */}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {fullName}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
              <span className="text-gray-600">@{user.username}</span>
              <Badge variant="default" size="sm" className="w-fit">
                User ID: {user.id}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Information
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <p className="text-gray-900 font-medium">
                  {capitalizeFirst(user.name.firstname)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <p className="text-gray-900 font-medium">
                  {capitalizeFirst(user.name.lastname)}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <p className="text-gray-900 font-medium">@{user.username}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <p className="text-gray-900 font-medium break-all">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Contact Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <p className="text-gray-900 font-medium">{user.phone}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <div className="text-gray-900 font-medium">
                <p>{user.address.number} {user.address.street}</p>
                <p>{user.address.city}, {user.address.zipcode}</p>
              </div>
            </div>

            {showAllDetails && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coordinates
                </label>
                <div className="text-gray-600 text-sm">
                  <p>Latitude: {user.address.geolocation.lat}</p>
                  <p>Longitude: {user.address.geolocation.long}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      {showAllDetails && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Account Details
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-white rounded border">
              <span className="text-gray-600">Account ID</span>
              <Badge variant="default" size="sm">#{user.id}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded border">
              <span className="text-gray-600">Profile Status</span>
              <Badge variant="default" size="sm" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * User Profile Skeleton for loading states
 */
export function UserProfileSkeleton({
  variant = 'default',
  className = '',
}: {
  variant?: 'default' | 'compact' | 'card';
  className?: string;
}) {
  if (variant === 'compact') {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          </div>
          <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
        <div className="h-32 bg-gray-200 rounded-t-lg animate-pulse" />
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
            <div className="h-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Default skeleton
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header skeleton */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1 space-y-3">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
            <div className="space-y-4">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                  <div className="h-5 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 