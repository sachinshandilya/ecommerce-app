'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SearchInput, Button, IconButton, Badge, CountBadge } from '../ui';
import { UserProfileIcon, UserProfileMenuButton } from '../features';
import { useCartContext, useUserContext, useProductsContext } from '@/context';

/**
 * Main application header with navigation, search, and user features
 * Integrates with all contexts for real-time state updates
 */
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  // Context integration
  const { cartCount } = useCartContext();
  const { userId, user, getUserDisplayName } = useUserContext();
  const { searchProducts, filters } = useProductsContext();

  // Handle search functionality
  const handleSearch = (searchTerm: string) => {
    if (searchProducts) {
      searchProducts(searchTerm);
      // Navigate to products page if not already there
      if (window.location.pathname !== '/') {
        router.push('/');
      }
    }
  };

  // Handle search clear
  const handleSearchClear = () => {
    if (searchProducts) {
      searchProducts('');
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation items
  const navigationItems = [
    { href: '/', label: 'Products', icon: '🛍️' },
    { href: '/cart', label: 'Cart', icon: '🛒' },
    ...(userId ? [{ href: '/profile', label: 'Profile', icon: '👤' }] : []),
  ];

  // Icons
  const MenuIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  const CloseIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const CartIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 7.2M7 13l5.2-13.6M16 13l1.8 7.2" />
    </svg>
  );

  const UserIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              <span className="text-2xl">🛒</span>
              <span className="hidden sm:block">E-Commerce</span>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SearchInput
              value={filters?.searchTerm || ''}
              onChange={handleSearch}
              onClear={handleSearchClear}
              placeholder="Search products..."
              className="w-full"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {/* Products Link */}
            <Link
              href="/"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <span>🛍️</span>
              <span>Products</span>
            </Link>

            {/* Cart Link with Badge */}
            <Link
              href="/cart"
              className="relative flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <CartIcon />
              <span>Cart</span>
              {cartCount > 0 && (
                <CountBadge
                  count={cartCount}
                  className="absolute -top-1 -right-1"
                  size="sm"
                />
              )}
            </Link>

            {/* User Profile Icon (Enhanced) */}
            <UserProfileIcon
              userId={userId}
              user={user}
              variant="compact"
              showUsername={true}
              showDropdown={true}
              className="hidden lg:block"
            />

            {/* Fallback Profile Link for smaller screens when user exists */}
            {userId && (
              <Link
                href="/profile"
                className="lg:hidden flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title={getUserDisplayName?.() || `User ${userId}`}
              >
                <UserIcon />
                <span className="hidden md:block">
                  {getUserDisplayName?.() || 'Profile'}
                </span>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <IconButton
              icon={isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              onClick={toggleMobileMenu}
              variant="ghost"
              aria-label="Toggle menu"
            />
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <SearchInput
            value={filters?.searchTerm || ''}
            onChange={handleSearch}
            onClear={handleSearchClear}
            placeholder="Search products..."
            className="w-full"
          />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="px-4 pt-2 pb-4 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.label === 'Cart' && cartCount > 0 && (
                  <CountBadge count={cartCount} size="sm" />
                )}
              </Link>
            ))}
            
            {/* Enhanced User Info in Mobile Menu */}
            {userId && user && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <UserProfileMenuButton
                  userId={userId}
                  user={user}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

/**
 * Minimal header for pages that need simpler navigation
 */
export function MinimalHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            <span className="text-xl">🛒</span>
            <span>E-Commerce</span>
          </Link>
          
          <Link
            href="/"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Store
          </Link>
        </div>
      </div>
    </header>
  );
} 