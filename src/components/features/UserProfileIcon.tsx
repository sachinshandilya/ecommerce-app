'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User } from '@/types';
import { capitalizeFirst } from '@/utils/helpers';
import { navigateToProfile } from '@/utils/urlParams';

interface UserProfileIconProps {
  userId: number | null;
  user: User | null;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
  showUsername?: boolean;
  showDropdown?: boolean;
}

/**
 * User Profile Icon component for header integration
 * Shows profile avatar with optional dropdown and navigation
 */
export function UserProfileIcon({
  userId,
  user,
  onClick,
  className = '',
  variant = 'default',
  showUsername = true,
  showDropdown = false,
}: UserProfileIconProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Don't render if no valid userId
  if (!userId || !user) {
    return null;
  }

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

  // Default variant with optional dropdown
  return (
    <div className={`relative ${className}`}>
      {showDropdown ? (
        <div>
          {/* Profile Button */}
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-white">{initials}</span>
            </div>
            
            {showUsername && (
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">{fullName}</p>
                <p className="text-xs text-gray-500">@{user.username}</p>
              </div>
            )}

            {/* Dropdown Arrow */}
            <svg
              className={`h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              {/* User Info Header */}
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-white">{initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{fullName}</p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <Link
                  href={profileUrl}
                  onClick={handleClick}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <svg className="h-4 w-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Profile
                </Link>

                <Link
                  href="/"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <svg className="h-4 w-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2h10a2 2 0 012 2v2M7 7V5a2 2 0 012-2h6a2 2 0 012 2v2" />
                  </svg>
                  Browse Products
                </Link>

                <Link
                  href="/cart"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <svg className="h-4 w-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 7.2M7 13l5.2-13.6M16 13l1.8 7.2" />
                  </svg>
                  Shopping Cart
                </Link>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 py-1">
                <div className="px-4 py-2 text-xs text-gray-500">
                  User ID: {userId}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Simple Link without dropdown */
        <Link
          href={profileUrl}
          onClick={handleClick}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          title={`${fullName} Profile`}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white">{initials}</span>
          </div>
          
          {showUsername && (
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900">{fullName}</p>
              <p className="text-xs text-gray-500">@{user.username}</p>
            </div>
          )}
        </Link>
      )}

      {/* Click outside handler for dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
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