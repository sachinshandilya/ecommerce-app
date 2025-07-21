import React from 'react';
import { Header, MinimalHeader } from './Header';
import { Footer, MinimalFooter } from './Footer';
import { ErrorBoundary, FeatureErrorBoundary } from './ErrorBoundary';

interface LayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'minimal';
  showHeader?: boolean;
  showFooter?: boolean;
  containerClassName?: string;
  mainClassName?: string;
}

/**
 * Main Layout component that wraps the entire application
 * Provides consistent page structure with header, main content, and footer
 */
export function Layout({
  children,
  variant = 'default',
  showHeader = true,
  showFooter = true,
  containerClassName = '',
  mainClassName = '',
}: LayoutProps) {
  const HeaderComponent = variant === 'minimal' ? MinimalHeader : Header;
  const FooterComponent = variant === 'minimal' ? MinimalFooter : Footer;

  return (
    <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
      <div className={`min-h-screen flex flex-col bg-gray-50 ${containerClassName}`}>
        {/* Header */}
        {showHeader && (
          <FeatureErrorBoundary featureName="navigation">
            <HeaderComponent />
          </FeatureErrorBoundary>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${mainClassName}`}>
          <ErrorBoundary
            fallback={
              <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <h2 className="text-lg font-semibold text-red-800 mb-2">
                    Content Loading Error
                  </h2>
                  <p className="text-red-700 mb-4">
                    We're having trouble loading this page content.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Reload Page
                  </button>
                </div>
              </div>
            }
          >
            {children}
          </ErrorBoundary>
        </main>

        {/* Footer */}
        {showFooter && (
          <FeatureErrorBoundary featureName="footer">
            <FooterComponent />
          </FeatureErrorBoundary>
        )}
      </div>
    </ErrorBoundary>
  );
}

/**
 * Page Layout for individual pages with container and padding
 */
interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '6xl' | '7xl';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function PageLayout({
  children,
  title,
  description,
  maxWidth = '7xl',
  padding = 'md',
  className = '',
}: PageLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-4',
    md: 'px-4 sm:px-6 lg:px-8 py-6',
    lg: 'px-4 sm:px-6 lg:px-8 py-8',
  };

  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto ${paddingClasses[padding]} ${className}`}>
      {/* Page Header */}
      {(title || description) && (
        <div className="mb-8">
          {title && (
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-lg text-gray-600">
              {description}
            </p>
          )}
        </div>
      )}
      
      {/* Page Content */}
      {children}
    </div>
  );
}

/**
 * Dashboard Layout for admin or complex layouts
 */
interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}

export function DashboardLayout({
  children,
  sidebar,
  title,
  actions,
}: DashboardLayoutProps) {
  return (
    <Layout showFooter={false}>
      <div className="flex h-full">
        {/* Sidebar */}
        {sidebar && (
          <aside className="hidden lg:flex lg:flex-shrink-0">
            <div className="flex flex-col w-64 bg-white border-r border-gray-200">
              <FeatureErrorBoundary featureName="sidebar">
                {sidebar}
              </FeatureErrorBoundary>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Dashboard Header */}
          {(title || actions) && (
            <header className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                {title && (
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {title}
                  </h1>
                )}
                {actions && (
                  <div className="flex items-center space-x-4">
                    {actions}
                  </div>
                )}
              </div>
            </header>
          )}

          {/* Dashboard Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            {children}
          </main>
        </div>
      </div>
    </Layout>
  );
}

/**
 * Centered Layout for authentication pages, etc.
 */
interface CenteredLayoutProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg';
  showHeader?: boolean;
  showFooter?: boolean;
}

export function CenteredLayout({
  children,
  maxWidth = 'md',
  showHeader = false,
  showFooter = false,
}: CenteredLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <Layout 
      variant="minimal" 
      showHeader={showHeader} 
      showFooter={showFooter}
      mainClassName="flex items-center justify-center"
    >
      <div className={`w-full ${maxWidthClasses[maxWidth]} px-4`}>
        {children}
      </div>
    </Layout>
  );
}

/**
 * Product Layout for e-commerce specific pages
 */
interface ProductLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  filters?: React.ReactNode;
  showFilters?: boolean;
}

export function ProductLayout({
  children,
  breadcrumbs,
  filters,
  showFilters = false,
}: ProductLayoutProps) {
  return (
    <Layout>
      <PageLayout>
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <div className="mb-6">
            <FeatureErrorBoundary featureName="breadcrumbs">
              {breadcrumbs}
            </FeatureErrorBoundary>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && filters && (
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="sticky top-20">
                <FeatureErrorBoundary featureName="filters">
                  {filters}
                </FeatureErrorBoundary>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </PageLayout>
    </Layout>
  );
}

/**
 * Loading Layout - shows while the main layout is loading
 */
export function LoadingLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Loading Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🛒</span>
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </header>

      {/* Loading Content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading application...</p>
        </div>
      </main>

      {/* Loading Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </footer>
    </div>
  );
} 