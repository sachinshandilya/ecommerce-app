'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

/**
 * Error Boundary component to catch JavaScript errors and prevent crashes
 * Provides fallback UI and recovery options
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state to trigger fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to log to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error reporting service
      // errorReportingService.captureException(error, { extra: errorInfo });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              {/* Error Icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              {/* Error Message */}
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 mb-6">
                We encountered an unexpected error. Please try one of the options below to continue.
              </p>

              {/* Error Details (Development) */}
              {this.props.showDetails && process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-gray-100 rounded-md text-left">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Error Details:</h3>
                  <p className="text-xs text-red-600 font-mono break-all">
                    {this.state.error.message}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-600 cursor-pointer">
                        Stack Trace
                      </summary>
                      <pre className="text-xs text-gray-600 mt-2 overflow-auto max-h-32">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Recovery Actions */}
              <div className="space-y-2">
                <Button
                  onClick={this.handleReset}
                  variant="primary"
                  className="w-full"
                >
                  Try Again
                </Button>
                <div className="flex space-x-2">
                  <Button
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="flex-1"
                  >
                    Go Home
                  </Button>
                  <Button
                    onClick={this.handleReload}
                    variant="secondary"
                    className="flex-1"
                  >
                    Reload Page
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Feature-level Error Boundary with smaller fallback UI
 * Use this for wrapping specific features or components
 */
interface FeatureErrorBoundaryProps {
  children: ReactNode;
  featureName?: string;
  onRetry?: () => void;
}

export function FeatureErrorBoundary({ 
  children, 
  featureName = 'this feature',
  onRetry
}: FeatureErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
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
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800 mb-1">
                Error loading {featureName}
              </h3>
              <p className="text-sm text-red-700 mb-3">
                We encountered an issue while loading this content.
              </p>
              <div className="flex space-x-2">
                <Button
                  onClick={onRetry || (() => window.location.reload())}
                  variant="outline"
                  size="sm"
                  className="text-red-800 border-red-300 hover:bg-red-100"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
      showDetails={process.env.NODE_ENV === 'development'}
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * Async Error Boundary for handling async component errors
 * Use this for components that might have async rendering issues
 */
interface AsyncErrorBoundaryState extends ErrorBoundaryState {
  retryCount: number;
}

export class AsyncErrorBoundary extends Component<ErrorBoundaryProps, AsyncErrorBoundaryState> {
  private maxRetries = 3;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<AsyncErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Async Error Boundary caught an error:', error, errorInfo);
    
    this.setState(prevState => ({
      error,
      errorInfo,
      retryCount: prevState.retryCount + 1,
    }));

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined 
      });
    }
  };

  render() {
    if (this.state.hasError) {
      const canRetry = this.state.retryCount < this.maxRetries;

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 max-w-md">
            <div className="flex items-center mb-3">
              <svg
                className="h-5 w-5 text-yellow-400 mr-2"
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
              <h3 className="text-sm font-medium text-yellow-800">
                Loading Error
              </h3>
            </div>
            <p className="text-sm text-yellow-700 mb-4">
              {canRetry 
                ? `Failed to load content. Retry ${this.state.retryCount}/${this.maxRetries}`
                : 'Maximum retry attempts reached. Please refresh the page.'
              }
            </p>
            {canRetry ? (
              <Button
                onClick={this.handleRetry}
                variant="outline"
                size="sm"
                className="text-yellow-800 border-yellow-300"
              >
                Retry ({this.maxRetries - this.state.retryCount} left)
              </Button>
            ) : (
              <Button
                onClick={() => window.location.reload()}
                variant="primary"
                size="sm"
              >
                Reload Page
              </Button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 