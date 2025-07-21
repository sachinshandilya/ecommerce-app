import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  rounded?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

/**
 * Flexible Badge component for status indicators and tags
 * Uses only Tailwind CSS inline classes as per requirements
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  rounded = false,
  removable = false,
  onRemove,
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium transition-colors';
  
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800 border border-gray-200',
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    error: 'bg-red-100 text-red-800 border border-red-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200',
    purple: 'bg-purple-100 text-purple-800 border border-purple-200',
    pink: 'bg-pink-100 text-pink-800 border border-pink-200',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const roundedStyles = rounded ? 'rounded-full' : 'rounded-md';

  const badgeStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${roundedStyles} ${className}`;

  return (
    <span className={badgeStyles}>
      {children}
      {removable && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-black hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
          aria-label="Remove badge"
        >
          <svg
            className="h-3 w-3"
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
        </button>
      )}
    </span>
  );
}

/**
 * Count Badge - Specialized for cart count, notifications, etc.
 */
export interface CountBadgeProps {
  count: number;
  max?: number;
  showZero?: boolean;
  variant?: 'default' | 'error' | 'warning' | 'success';
  size?: 'sm' | 'md';
  className?: string;
}

export function CountBadge({
  count,
  max = 99,
  showZero = false,
  variant = 'error',
  size = 'sm',
  className = '',
}: CountBadgeProps) {
  if (count === 0 && !showZero) {
    return null;
  }

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge
      variant={variant}
      size={size}
      rounded
      className={`${className} min-w-0 font-bold`}
    >
      {displayCount}
    </Badge>
  );
}

/**
 * Status Badge - For status indicators with dot
 */
export interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'error' | 'success';
  text?: string;
  showDot?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({
  status,
  text,
  showDot = true,
  size = 'sm',
  className = '',
}: StatusBadgeProps) {
  const statusConfig = {
    active: {
      variant: 'success' as const,
      label: 'Active',
      dotColor: 'bg-green-400',
    },
    inactive: {
      variant: 'default' as const,
      label: 'Inactive',
      dotColor: 'bg-gray-400',
    },
    pending: {
      variant: 'warning' as const,
      label: 'Pending',
      dotColor: 'bg-yellow-400',
    },
    error: {
      variant: 'error' as const,
      label: 'Error',
      dotColor: 'bg-red-400',
    },
    success: {
      variant: 'success' as const,
      label: 'Success',
      dotColor: 'bg-green-400',
    },
  };

  const config = statusConfig[status];
  const displayText = text || config.label;

  return (
    <Badge variant={config.variant} size={size} className={className}>
      {showDot && (
        <div className={`w-2 h-2 rounded-full ${config.dotColor} mr-1.5`} />
      )}
      {displayText}
    </Badge>
  );
}

/**
 * Category Badge - For product categories and tags
 */
export interface CategoryBadgeProps {
  category: string;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

export function CategoryBadge({
  category,
  onClick,
  selected = false,
  className = '',
}: CategoryBadgeProps) {
  const baseStyles = 'inline-flex items-center px-3 py-1 text-sm font-medium rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = selected
    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500';

  const badgeStyles = `${baseStyles} ${variantStyles} ${className}`;

  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      className={badgeStyles}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {category}
    </Component>
  );
}

/**
 * Priority Badge - For priority levels
 */
export interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  className?: string;
}

export function PriorityBadge({
  priority,
  className = '',
}: PriorityBadgeProps) {
  const priorityConfig = {
    low: {
      variant: 'success' as const,
      label: 'Low',
    },
    medium: {
      variant: 'warning' as const,
      label: 'Medium',
    },
    high: {
      variant: 'error' as const,
      label: 'High',
    },
    urgent: {
      variant: 'error' as const,
      label: 'Urgent',
    },
  };

  const config = priorityConfig[priority];

  return (
    <Badge variant={config.variant} size="sm" className={className}>
      {config.label}
    </Badge>
  );
}

/**
 * Price Badge - For displaying prices with currency
 */
export interface PriceBadgeProps {
  price: number;
  currency?: string;
  originalPrice?: number;
  discount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PriceBadge({
  price,
  currency = 'USD',
  originalPrice,
  discount = false,
  size = 'md',
  className = '',
}: PriceBadgeProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  };

  const hasDiscount = discount && originalPrice && originalPrice > price;

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <Badge
        variant={hasDiscount ? 'success' : 'default'}
        size={size}
        className="font-bold"
      >
        {formatPrice(price)}
      </Badge>
      
      {hasDiscount && originalPrice && (
        <span className="text-sm text-gray-500 line-through">
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
}

/**
 * Badge Group - For displaying multiple badges
 */
export interface BadgeGroupProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'tight' | 'normal' | 'loose';
}

export function BadgeGroup({
  children,
  className = '',
  spacing = 'normal',
}: BadgeGroupProps) {
  const spacingStyles = {
    tight: 'space-x-1',
    normal: 'space-x-2',
    loose: 'space-x-3',
  };

  return (
    <div className={`inline-flex flex-wrap items-center ${spacingStyles[spacing]} ${className}`}>
      {children}
    </div>
  );
} 