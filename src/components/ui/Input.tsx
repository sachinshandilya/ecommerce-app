import React, { forwardRef } from 'react';
import { IconButton } from './Button';

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'search' | 'email' | 'number' | 'password';
  error?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  id?: string;
  name?: string;
  required?: boolean;
  autoComplete?: string;
  'aria-describedby'?: string;
}

/**
 * Reusable Input component with validation states and accessibility
 * Uses only Tailwind CSS inline classes as per requirements
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  disabled = false,
  className = '',
  label,
  id,
  name,
  required = false,
  autoComplete,
  'aria-describedby': ariaDescribedBy,
  ...props
}, ref) => {
  const baseStyles = 'block w-full rounded-md border px-3 py-2 text-sm placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed';
  
  const stateStyles = error
    ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500';

  const inputStyles = `${baseStyles} ${stateStyles} ${className}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        className={inputStyles}
        aria-describedby={ariaDescribedBy}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

/**
 * Search Input component with search icon and clear functionality
 * Optimized for product search with debouncing support
 */
export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  'aria-label'?: string;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search products...',
  disabled = false,
  className = '',
  isLoading = false,
  'aria-label': ariaLabel = 'Search products',
  ...props
}: SearchInputProps) {
  const baseStyles = 'block w-full rounded-md border border-gray-300 pl-10 pr-10 py-2 text-sm placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed';
  
  const inputStyles = `${baseStyles} ${className}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
    if (onClear) {
      onClear();
    }
  };

  // Search Icon
  const SearchIcon = () => (
    <svg
      className="h-5 w-5 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );

  // Clear Icon
  const ClearIcon = () => (
    <svg
      className="h-5 w-5 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  // Loading Spinner
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-5 w-5 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <div className="relative">
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon />
      </div>
      
      {/* Input Field */}
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={inputStyles}
        aria-label={ariaLabel}
        {...props}
      />
      
      {/* Right Side Icons */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        {isLoading ? (
          <LoadingSpinner />
        ) : value ? (
          <IconButton
            icon={<ClearIcon />}
            onClick={handleClear}
            variant="ghost"
            size="sm"
            aria-label="Clear search"
            disabled={disabled}
          />
        ) : null}
      </div>
    </div>
  );
}

/**
 * Textarea component for longer text input
 */
export interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  id?: string;
  name?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  className = '',
  label,
  id,
  name,
  required = false,
  rows = 3,
  maxLength,
  ...props
}, ref) => {
  const baseStyles = 'block w-full rounded-md border px-3 py-2 text-sm placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed resize-vertical';
  
  const stateStyles = error
    ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500';

  const textareaStyles = `${baseStyles} ${stateStyles} ${className}`;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={textareaStyles}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
      <div className="flex justify-between items-center mt-1">
        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : (
          <div />
        )}
        {maxLength && (
          <p className="text-sm text-gray-500">
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea'; 