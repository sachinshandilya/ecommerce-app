import { EnvironmentConfig } from '@/types';

/**
 * Environment Variable Validation and Configuration
 */

// Validate required environment variables
const validateEnvironmentVariables = (): void => {
  const requiredVars = ['NEXT_PUBLIC_API_BASE_URL'];
  const missingVars: string[] = [];

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.warn(
      `Missing environment variables: ${missingVars.join(', ')}. Using defaults.`
    );
  }
};

// Get environment configuration with validation
export const getEnvironmentConfig = (): EnvironmentConfig => {
  // Validate environment variables
  validateEnvironmentVariables();

  const config: EnvironmentConfig = {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://fakestoreapi.com',
    isDevelopment: process.env.NODE_ENV === 'development',
  };

  // Validate API base URL format
  try {
    new URL(config.apiBaseUrl);
  } catch (error) {
    console.error('Invalid API base URL, using default');
    config.apiBaseUrl = 'https://fakestoreapi.com';
  }

  return config;
};

// Environment detection utilities
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

export const isTest = (): boolean => {
  return process.env.NODE_ENV === 'test';
};

// Client-side environment check
export const isClient = (): boolean => {
  return typeof window !== 'undefined';
};

export const isServer = (): boolean => {
  return typeof window === 'undefined';
};

// Debug logging with environment awareness
export const envLog = (message: string, data?: any): void => {
  if (isDevelopment()) {
    console.log(`[ENV] ${message}`, data || '');
  }
};

// Environment-aware feature flags
export const getFeatureFlags = () => {
  return {
    enableDebugLogging: isDevelopment(),
    enableApiLogging: isDevelopment(),
    enablePerformanceMetrics: isDevelopment(),
    enableMockData: isTest(),
  };
}; 