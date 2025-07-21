import { ApiError as ApiErrorType } from '@/types';
import { ERROR_MESSAGES } from '@/utils/constants';

/**
 * Custom Error Classes
 */

// Base application error
export class AppError extends Error {
  public readonly code: string;
  public readonly status?: number;

  constructor(message: string, code: string, status?: number) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
  }
}

// API-specific error
export class ApiRequestError extends AppError {
  constructor(message: string, status?: number, code: string = 'API_ERROR') {
    super(message, code, status);
    this.name = 'ApiRequestError';
  }
}

// Network error
export class NetworkError extends AppError {
  constructor(message: string = ERROR_MESSAGES.NETWORK_ERROR) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

// Validation error
export class ValidationError extends AppError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.field = field;
  }
}

// User not found error
export class UserNotFoundError extends AppError {
  constructor(userId: number) {
    super(`User with ID ${userId} not found`, 'USER_NOT_FOUND', 404);
    this.name = 'UserNotFoundError';
  }
}

// Product not found error
export class ProductNotFoundError extends AppError {
  constructor(productId: number) {
    super(`Product with ID ${productId} not found`, 'PRODUCT_NOT_FOUND', 404);
    this.name = 'ProductNotFoundError';
  }
}

/**
 * Error Handling Utilities
 */

// Create standardized API error from response
export const createApiError = (
  message: string,
  status?: number,
  code?: string
): ApiErrorType => {
  return {
    message: message || ERROR_MESSAGES.API_ERROR,
    status,
    code: code || 'API_ERROR',
  };
};

// Handle fetch errors
export const handleFetchError = (error: any): ApiErrorType => {
  // Network error
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return createApiError(ERROR_MESSAGES.NETWORK_ERROR, undefined, 'NETWORK_ERROR');
  }

  // HTTP error
  if (error.status) {
    const message = getErrorMessageForStatus(error.status);
    return createApiError(message, error.status, 'HTTP_ERROR');
  }

  // Generic error
  return createApiError(
    error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
    undefined,
    'UNKNOWN_ERROR'
  );
};

// Get user-friendly error message for HTTP status
export const getErrorMessageForStatus = (status: number): string => {
  switch (status) {
    case 400:
      return 'Bad request. Please check your input.';
    case 401:
      return 'Authentication required.';
    case 403:
      return 'Access forbidden.';
    case 404:
      return 'Resource not found.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    case 503:
      return 'Service unavailable. Please try again later.';
    default:
      return ERROR_MESSAGES.API_ERROR;
  }
};

// Get user-friendly error message from error object
export const getUserFriendlyErrorMessage = (error: any): string => {
  // Handle custom error types
  if (error instanceof AppError) {
    return error.message;
  }

  // Handle API errors
  if (error && typeof error === 'object' && error.message) {
    return error.message;
  }

  // Handle standard JavaScript errors
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Default fallback
  return ERROR_MESSAGES.UNKNOWN_ERROR;
};

// Log error with context
export const logError = (error: any, context: string): void => {
  console.error(`[ERROR] ${context}:`, {
    message: error.message || 'Unknown error',
    code: error.code || 'UNKNOWN',
    status: error.status || 'N/A',
    stack: error.stack,
  });
};

// Check if error should be retried
export const shouldRetryError = (error: any): boolean => {
  // As per requirements, no retry logic
  return false;
};

// Create error boundary fallback message
export const createErrorBoundaryMessage = (error: Error): string => {
  return `Something went wrong: ${error.message}`;
};

// Validate error response from API
export const isApiErrorResponse = (response: any): response is ApiErrorType => {
  return (
    response &&
    typeof response === 'object' &&
    typeof response.message === 'string'
  );
};

// Create toast-ready error message
export const createToastErrorMessage = (error: any): string => {
  const message = getUserFriendlyErrorMessage(error);
  
  // Ensure message is not too long for toast
  if (message.length > 100) {
    return message.substring(0, 97) + '...';
  }
  
  return message;
}; 