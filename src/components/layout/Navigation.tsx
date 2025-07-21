'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartContext, useUserContext } from '@/context';
import { CountBadge, Button, IconButton } from '../ui';

interface NavigationItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  external?: boolean;
  requiresAuth?: boolean;
}

interface NavigationProps {
  items: NavigationItem[];
  className?: string;
  variant?: 'horizontal' | 'vertical';
  showIcons?: boolean;
  activeClassName?: string;
}

/**
 * Navigation component with active state highlighting
 * Supports both horizontal and vertical layouts
 */
export function Navigation({
  items,
  className = '',
  variant = 'horizontal',
  showIcons = true,
  activeClassName = 'text-blue-600 bg-blue-50',
}: NavigationProps) {
  const pathname = usePathname();
  const { userId } = useUserContext();

  // Filter items based on authentication requirements
  const filteredItems = items.filter(item => {
    if (item.requiresAuth) {
      return Boolean(userId);
    }
    return true;
  });

  const baseStyles = variant === 'horizontal' 
    ? 'flex space-x-1' 
    : 'flex flex-col space-y-1';

  const linkBaseStyles = variant === 'horizontal'
    ? 'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors'
    : 'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors w-full';

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className={`${baseStyles} ${className}`} role="navigation">
      {filteredItems.map((item) => {
        const active = isActive(item.href);
        const linkStyles = `${linkBaseStyles} ${
          active 
            ? activeClassName
            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
        }`;

        const content = (
          <>
            {showIcons && item.icon && (
              <span className={variant === 'horizontal' ? 'mr-2' : 'mr-3'}>
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <CountBadge
                count={item.badge}
                className={variant === 'horizontal' ? 'ml-2' : 'ml-auto'}
                size="sm"
              />
            )}
          </>
        );

        if (item.external) {
          return (
            <a
              key={item.href}
              href={item.href}
              className={linkStyles}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content}
            </a>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={linkStyles}
            aria-current={active ? 'page' : undefined}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Mobile Navigation Menu with overlay
 */
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavigationItem[];
  children?: React.ReactNode;
}

export function MobileMenu({ isOpen, onClose, items, children }: MobileMenuProps) {
  const { cartCount } = useCartContext();
  const { userId, user, getUserDisplayName } = useUserContext();

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Add cart badge to cart navigation item
  const enhancedItems = items.map(item => ({
    ...item,
    badge: item.href === '/cart' ? cartCount : item.badge,
  }));

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl z-50 transform transition-transform"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <IconButton
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
              onClick={onClose}
              variant="ghost"
              aria-label="Close menu"
            />
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <Navigation
              items={enhancedItems}
              variant="vertical"
              className="mb-6"
            />

            {/* Additional Content */}
            {children}

            {/* User Info */}
            {userId && user && (
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user.name?.firstname?.charAt(0) || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {getUserDisplayName?.() || `User ${userId}`}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Breadcrumb Navigation
 */
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 text-sm text-gray-500">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg
                className="h-4 w-4 mx-1 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            {item.href && index < items.length - 1 ? (
              <Link
                href={item.href}
                className="hover:text-gray-700 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={index === items.length - 1 ? 'text-gray-900 font-medium' : ''}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Tab Navigation
 */
interface TabItem {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ items, activeTab, onChange, className = '' }: TabsProps) {
  return (
    <div className={className}>
      <nav className="flex space-x-8" aria-label="Tabs">
        {items.map((tab) => {
          const isActive = tab.id === activeTab;
          const isDisabled = tab.disabled;

          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && onChange(tab.id)}
              disabled={isDisabled}
              className={`
                flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${isActive
                  ? 'border-blue-500 text-blue-600'
                  : isDisabled
                  ? 'border-transparent text-gray-400 cursor-not-allowed'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
              aria-disabled={isDisabled}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                               <CountBadge
                 count={tab.count}
                 className="ml-2"
                 size="sm"
                 variant={isActive ? 'success' : 'default'}
               />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/**
 * Pagination Navigation
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 5,
  className = '',
}: PaginationProps) {
  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(1, currentPage - halfVisible);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className={`flex items-center justify-center space-x-1 ${className}`} aria-label="Pagination">
      {/* First Page */}
      {showFirstLast && currentPage > 1 && (
        <Button
          onClick={() => onPageChange(1)}
          variant="outline"
          size="sm"
          aria-label="Go to first page"
        >
          First
        </Button>
      )}

      {/* Previous Page */}
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        variant="outline"
        size="sm"
        aria-label="Go to previous page"
      >
        Previous
      </Button>

      {/* Page Numbers */}
      {visiblePages.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          variant={page === currentPage ? 'primary' : 'outline'}
          size="sm"
          aria-label={`Go to page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </Button>
      ))}

      {/* Next Page */}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        variant="outline"
        size="sm"
        aria-label="Go to next page"
      >
        Next
      </Button>

      {/* Last Page */}
      {showFirstLast && currentPage < totalPages && (
        <Button
          onClick={() => onPageChange(totalPages)}
          variant="outline"
          size="sm"
          aria-label="Go to last page"
        >
          Last
        </Button>
      )}
    </nav>
  );
} 