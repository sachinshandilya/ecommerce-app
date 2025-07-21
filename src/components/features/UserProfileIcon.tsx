'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User } from '@/types';
import { capitalizeFirst } from '@/utils/helpers';
import { navigateToProfile } from '@/utils/urlParams';

interface UserProfileIconProps {
  userId: number | null;
  user: User | null;
  variant?: 'default' | 'minimal' | 'compact' | 'badge';
  showUsername?: boolean;
  showDropdown?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * User Profile Icon Component
 * Always shows an icon - either for specific user or generic "all users" icon
 * Integrates with header navigation and provides user profile access
 */
export function UserProfileIcon({
  userId,
  user,
  variant = 'default',
  showUsername = false,
  showDropdown = false,
  className = '',
  onClick,
}: UserProfileIconProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Handle case when no user is provided - show generic "all users" icon
  if (!userId || !user) {
    const profileUrl = '/profile'; // Navigate to user selection page

    const handleClick = () => {
      if (onClick) {
        onClick();
      }
      setIsDropdownOpen(false);
    };

    const genericIcon = (
      <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    );

    if (variant === 'minimal') {
      return (
        <Link
          href={profileUrl}
          onClick={handleClick}
          className={`flex items-center justify-center w-8 h-8 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors ${className}`}
          title="View User Profiles"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </Link>
      );
    }

    if (variant === 'compact') {
      return (
        <Link
          href={profileUrl}
          onClick={handleClick}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
          title="View User Profiles"
        >
          {genericIcon}
          {showUsername && (
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">
              Users
            </span>
          )}
        </Link>
      );
    }

    // Default variant for no user
    return (
      <div className="relative">
        <Link
          href={profileUrl}
          onClick={handleClick}
          className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${className}`}
          title="View User Profiles"
        >
          {genericIcon}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">User Profiles</p>
            <p className="text-xs text-gray-500">View all users</p>
          </div>
        </Link>
      </div>
    );
  }

  // Original logic for when user exists
  const fullName = `${capitalizeFirst(user.name.firstname)} ${capitalizeFirst(user.name.lastname)}`;
  const initials = `${user.name.firstname.charAt(0).toUpperCase()}${user.name.lastname.charAt(0).toUpperCase()}`;
  const profileUrl = navigateToProfile(userId);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (variant === 'minimal') {
    return (
      <Link
        href={profileUrl}
        onClick={handleClick}
        className={`flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors ${className}`}
        title={`${fullName} Profile`}
      >
        <span className="text-sm font-semibold">{initials}</span>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        href={profileUrl}
        onClick={handleClick}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
        title={`${fullName} Profile`}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold text-white">{initials}</span>
        </div>
        {showUsername && (
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">
            {user.username}
          </span>
        )}
      </Link>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <Link
          href={profileUrl}
          onClick={handleClick}
          className="flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors"
          title={`${fullName} Profile`}
        >
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-white">{initials}</span>
          </div>
          <span className="text-xs font-medium text-blue-700">{user.username}</span>
        </Link>
      </div>
    );
  }

  // Default variant with optional dropdown
  return (
    <div className="relative">
      {showDropdown ? (
        <>
          {/* Dropdown trigger */}
          <button
            onClick={toggleDropdown}
            className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors w-full text-left ${className}`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-white">{initials}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{fullName}</p>
              <p className="text-xs text-gray-500">@{user.username}</p>
            </div>
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-white">{initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{fullName}</p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="py-2">
                <Link
                  href={profileUrl}
                  onClick={handleClick}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Full Profile
                </Link>
                
                <Link
                  href="/profile"
                  onClick={handleClick}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  All Users
                </Link>
                
                <Link
                  href="/"
                  onClick={handleClick}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Browse Products
                </Link>
                
                <Link
                  href="/cart"
                  onClick={handleClick}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 7.2M7 13l5.2-13.6M16 13l1.8 7.2" />
                  </svg>
                  Shopping Cart
                </Link>
              </div>
            </div>
          )}
        </>
      ) : (
        // Simple link without dropdown
        <Link
          href={profileUrl}
          onClick={handleClick}
          className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${className}`}
          title={`${fullName} Profile`}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white">{initials}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{fullName}</p>
            <p className="text-xs text-gray-500">@{user.username}</p>
          </div>
        </Link>
      )}
    </div>
  );
}

/**
 * User Profile Icon Skeleton for loading states
 */
export function UserProfileIconSkeleton({
  variant = 'default',
  className = '',
  showUsername = true,
}: {
  variant?: 'default' | 'compact' | 'minimal';
  className?: string;
  showUsername?: boolean;
}) {
  if (variant === 'minimal') {
    return (
      <div className={`w-8 h-8 bg-gray-200 rounded-full animate-pulse ${className}`} />
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 px-3 py-2 ${className}`}>
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        {showUsername && (
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse hidden sm:block" />
        )}
      </div>
    );
  }

  // Default skeleton
  return (
    <div className={`flex items-center space-x-3 px-3 py-2 ${className}`}>
      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
      {showUsername && (
        <div className="hidden sm:block space-y-1">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      )}
    </div>
  );
}

/**
 * User Profile Badge - Simple badge variant for minimal spaces
 */
interface UserProfileBadgeProps {
  userId: number | null;
  user: User | null;
  onClick?: () => void;
  className?: string;
}

export function UserProfileBadge({
  userId,
  user,
  onClick,
  className = '',
}: UserProfileBadgeProps) {
  if (!userId || !user) {
    return null;
  }

  const initials = `${user.name.firstname.charAt(0).toUpperCase()}${user.name.lastname.charAt(0).toUpperCase()}`;
  const fullName = `${capitalizeFirst(user.name.firstname)} ${capitalizeFirst(user.name.lastname)}`;
  const profileUrl = navigateToProfile(userId);

  return (
    <Link
      href={profileUrl}
      onClick={onClick}
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors ${className}`}
      title={`${fullName} Profile`}
    >
      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mr-1">
        <span className="text-xs font-semibold text-white">{initials}</span>
      </div>
      {user.username}
    </Link>
  );
}

/**
 * User Profile Menu Button - For mobile hamburger menus
 */
interface UserProfileMenuButtonProps {
  userId: number | null;
  user: User | null;
  onClick?: () => void;
  className?: string;
}

export function UserProfileMenuButton({
  userId,
  user,
  onClick,
  className = '',
}: UserProfileMenuButtonProps) {
  if (!userId || !user) {
    return null;
  }

  const fullName = `${capitalizeFirst(user.name.firstname)} ${capitalizeFirst(user.name.lastname)}`;
  const initials = `${user.name.firstname.charAt(0).toUpperCase()}${user.name.lastname.charAt(0).toUpperCase()}`;
  const profileUrl = navigateToProfile(userId);

  return (
    <Link
      href={profileUrl}
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors ${className}`}
    >
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
        <span className="text-sm font-semibold text-white">{initials}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{fullName}</p>
        <p className="text-xs text-gray-500">@{user.username} • View Profile</p>
      </div>
    </Link>
  );
} 