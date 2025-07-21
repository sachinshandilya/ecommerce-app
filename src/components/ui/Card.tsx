import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
  hover?: boolean;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Flexible Card component for content display
 * Uses only Tailwind CSS inline classes as per requirements
 */
export function Card({
  children,
  clickable = false,
  onClick,
  className = '',
  hover = true,
  variant = 'default',
  padding = 'md',
}: CardProps) {
  const baseStyles = 'block w-full rounded-lg transition-all duration-200';
  
  const variantStyles = {
    default: 'bg-white border border-gray-200',
    outlined: 'bg-white border-2 border-gray-300',
    elevated: 'bg-white shadow-lg border border-gray-100',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const interactiveStyles = clickable
    ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
    : '';

  const hoverStyles = hover && clickable
    ? 'hover:shadow-md hover:border-gray-300'
    : '';

  const cardStyles = `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${interactiveStyles} ${hoverStyles} ${className}`;

  const Component = clickable ? 'button' : 'div';

  return (
    <Component
      className={cardStyles}
      onClick={clickable ? onClick : undefined}
      type={clickable ? 'button' : undefined}
    >
      {children}
    </Component>
  );
}

/**
 * Card Header component
 */
export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Card Title component
 */
export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function CardTitle({ children, className = '', level = 3 }: CardTitleProps) {
  const sizeStyles = {
    1: 'text-2xl',
    2: 'text-xl',
    3: 'text-lg',
    4: 'text-base',
    5: 'text-sm',
    6: 'text-xs',
  };

  const titleClassName = `font-semibold text-gray-900 ${sizeStyles[level]} ${className}`;

  switch (level) {
    case 1:
      return <h1 className={titleClassName}>{children}</h1>;
    case 2:
      return <h2 className={titleClassName}>{children}</h2>;
    case 3:
      return <h3 className={titleClassName}>{children}</h3>;
    case 4:
      return <h4 className={titleClassName}>{children}</h4>;
    case 5:
      return <h5 className={titleClassName}>{children}</h5>;
    case 6:
      return <h6 className={titleClassName}>{children}</h6>;
    default:
      return <h3 className={titleClassName}>{children}</h3>;
  }
}

/**
 * Card Content component
 */
export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`text-gray-700 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Card Footer component
 */
export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  justify?: 'start' | 'center' | 'end' | 'between';
}

export function CardFooter({ 
  children, 
  className = '', 
  justify = 'between' 
}: CardFooterProps) {
  const justifyStyles = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div className={`flex items-center ${justifyStyles[justify]} mt-4 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Product Card - Specialized card for product display
 */
export interface ProductCardProps {
  title: string;
  price: number;
  image?: string;
  imageAlt?: string;
  description?: string;
  onAddToCart?: () => void;
  onClick?: () => void;
  isLoading?: boolean;
  inCart?: boolean;
  className?: string;
}

export function ProductCard({
  title,
  price,
  image,
  imageAlt,
  description,
  onAddToCart,
  onClick,
  isLoading = false,
  inCart = false,
  className = '',
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Card
      clickable={Boolean(onClick)}
      onClick={onClick}
      hover={Boolean(onClick)}
      className={className}
    >
      {/* Product Image */}
      {image && (
        <div className="aspect-square mb-4 overflow-hidden rounded-md bg-gray-100">
          <img
            src={image}
            alt={imageAlt || title}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
            loading="lazy"
          />
        </div>
      )}

      {/* Product Info */}
      <CardContent>
        <CardTitle level={4} className="mb-2 line-clamp-2">
          {title}
        </CardTitle>
        
        {description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(price)}
          </span>
          
          {onAddToCart && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
              disabled={isLoading}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                inCart
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              } disabled:opacity-50`}
            >
              {isLoading ? 'Adding...' : inCart ? 'In Cart' : 'Add to Cart'}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * User Card - Specialized card for user profiles
 */
export interface UserCardProps {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  onClick?: () => void;
  className?: string;
}

export function UserCard({
  name,
  email,
  avatar,
  role,
  onClick,
  className = '',
}: UserCardProps) {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card
      clickable={Boolean(onClick)}
      onClick={onClick}
      hover={Boolean(onClick)}
      className={className}
    >
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-medium text-sm">{initials}</span>
            </div>
          )}
        </div>
        
        {/* User Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {name}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {email}
          </p>
          {role && (
            <p className="text-xs text-gray-400 truncate">
              {role}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

/**
 * Stat Card - For displaying statistics and metrics
 */
export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  className = '',
}: StatCardProps) {
  const changeColors = {
    increase: 'text-green-600',
    decrease: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <Card variant="elevated" className={className}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {value}
          </p>
          {change !== undefined && (
            <p className={`text-sm ${changeColors[changeType]}`}>
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        
        {icon && (
          <div className="flex-shrink-0 ml-4">
            <div className="p-2 bg-blue-100 rounded-md">
              {icon}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 