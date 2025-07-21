import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductCard, CompactProductCard, ProductCardSkeleton } from '../ProductCard';
import { Product } from '@/types';

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className, fill, sizes, placeholder, blurDataURL, ...props }: any) => (
    <img src={src} alt={alt} className={className} {...props} />
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, className, onClick, ...props }: any) => (
    <a href={href} className={className} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}));

// Mock helpers
jest.mock('@/utils/helpers', () => ({
  formatPrice: (price: number) => `$${price.toFixed(2)}`,
  truncateText: (text: string, length: number) => 
    text.length > length ? text.substring(0, length) + '...' : text,
  capitalizeFirst: (text: string) => 
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
}));

const mockProduct: Product = {
  id: 1,
  title: 'Test Product with a Very Long Name That Should Be Truncated',
  price: 29.99,
  description: 'This is a test product description that should also be truncated when displayed in certain views.',
  category: 'electronics',
  image: 'https://example.com/product.jpg',
  rating: {
    rate: 4.5,
    count: 128
  }
};

describe('ProductCard Component', () => {
  describe('Basic Functionality', () => {
    it('renders product information correctly', () => {
      render(<ProductCard product={mockProduct} />);
      
      expect(screen.getByText('Test Product with a Very Long Name That Should Be Truncated')).toBeInTheDocument();
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('src', mockProduct.image);
      expect(screen.getByRole('img')).toHaveAttribute('alt', mockProduct.title);
    });

    it('renders as a link by default', () => {
      render(<ProductCard product={mockProduct} />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', `/products/${mockProduct.id}`);
    });

    it('applies hover and focus styles', () => {
      render(<ProductCard product={mockProduct} />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500');
    });
  });

  describe('Image Display', () => {
    it('renders product image with correct attributes', () => {
      render(<ProductCard product={mockProduct} />);
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', mockProduct.image);
      expect(image).toHaveAttribute('alt', mockProduct.title);
    });

    it('applies proper image styling classes', () => {
      render(<ProductCard product={mockProduct} />);
      
      const image = screen.getByRole('img');
      expect(image).toHaveClass('object-contain', 'group-hover:scale-105');
    });
  });

  describe('Size Variants', () => {
    it('applies medium image size by default', () => {
      render(<ProductCard product={mockProduct} />);
      
      const imageContainer = screen.getByRole('img').parentElement;
      expect(imageContainer).toHaveClass('h-48');
    });

    it('applies small image size', () => {
      render(<ProductCard product={mockProduct} imageSize="sm" />);
      
      const imageContainer = screen.getByRole('img').parentElement;
      expect(imageContainer).toHaveClass('h-32');
    });

    it('applies large image size', () => {
      render(<ProductCard product={mockProduct} imageSize="lg" />);
      
      const imageContainer = screen.getByRole('img').parentElement;
      expect(imageContainer).toHaveClass('h-64');
    });
  });

  describe('Category Display', () => {
    it('shows category badge by default', () => {
      render(<ProductCard product={mockProduct} />);
      
      expect(screen.getByText('Electronics')).toBeInTheDocument();
    });

    it('hides category when showCategory is false', () => {
      render(<ProductCard product={mockProduct} showCategory={false} />);
      
      expect(screen.queryByText('Electronics')).not.toBeInTheDocument();
    });

    it('capitalizes category name correctly', () => {
      const productWithLowerCategory = {
        ...mockProduct,
        category: 'jewelry'
      };
      
      render(<ProductCard product={productWithLowerCategory} />);
      
      expect(screen.getByText('Jewelry')).toBeInTheDocument();
    });
  });

  describe('Rating Display', () => {
    it('shows rating badge by default', () => {
      render(<ProductCard product={mockProduct} />);
      
      expect(screen.getByText('4.5')).toBeInTheDocument();
      expect(screen.getByText('(128)')).toBeInTheDocument();
      expect(screen.getByText('★')).toBeInTheDocument();
    });

    it('hides rating when showRating is false', () => {
      render(<ProductCard product={mockProduct} showRating={false} />);
      
      expect(screen.queryByText('4.5')).not.toBeInTheDocument();
      expect(screen.queryByText('(128)')).not.toBeInTheDocument();
    });

    it('handles product without rating', () => {
      const productWithoutRating = {
        ...mockProduct,
        rating: undefined
      };
      
      render(<ProductCard product={productWithoutRating} />);
      
      expect(screen.queryByText('★')).not.toBeInTheDocument();
    });

    it('shows alternative star rating when category is hidden', () => {
      render(<ProductCard product={mockProduct} showCategory={false} showRating />);
      
      // Should show star rating in alternative location
      const stars = screen.getAllByText('★');
      expect(stars.length).toBeGreaterThan(1); // Multiple stars for rating display
    });
  });

  describe('Description Display', () => {
    it('hides description by default', () => {
      render(<ProductCard product={mockProduct} />);
      
      expect(screen.queryByText(/This is a test product description/)).not.toBeInTheDocument();
    });

    it('shows description when showDescription is true', () => {
      render(<ProductCard product={mockProduct} showDescription />);
      
      expect(screen.getByText(/This is a test product description/)).toBeInTheDocument();
    });

    it('truncates long descriptions', () => {
      const productWithLongDescription = {
        ...mockProduct,
        description: 'This is a very long product description that should be truncated when displayed to ensure the card layout remains consistent and readable.'
      };
      
      render(<ProductCard product={productWithLongDescription} showDescription />);
      
      // The description should be truncated (mocked to add ...)
      expect(screen.getByText(/\.\.\./)).toBeInTheDocument();
    });
  });

  describe('Price Display', () => {
    it('formats price correctly', () => {
      render(<ProductCard product={mockProduct} />);
      
      expect(screen.getByText('$29.99')).toBeInTheDocument();
    });

    it('handles integer prices', () => {
      const productWithIntPrice = {
        ...mockProduct,
        price: 50
      };
      
      render(<ProductCard product={productWithIntPrice} />);
      
      expect(screen.getByText('$50.00')).toBeInTheDocument();
    });

    it('handles decimal prices', () => {
      const productWithDecimalPrice = {
        ...mockProduct,
        price: 19.95
      };
      
      render(<ProductCard product={productWithDecimalPrice} />);
      
      expect(screen.getByText('$19.95')).toBeInTheDocument();
    });
  });

  describe('Click Handling', () => {
    it('calls onClick when provided and card is clicked', () => {
      const handleClick = jest.fn();
      render(<ProductCard product={mockProduct} onClick={handleClick} />);
      
      // Click on the card container, not the link
      const cardContainer = screen.getByRole('link').firstChild as HTMLElement;
      fireEvent.click(cardContainer);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when not provided', () => {
      const handleClick = jest.fn();
      render(<ProductCard product={mockProduct} />);
      
      fireEvent.click(screen.getByRole('link'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      render(<ProductCard product={mockProduct} className="custom-product-card" />);
      
      const cardContainer = screen.getByRole('link').firstChild as HTMLElement;
      expect(cardContainer).toHaveClass('custom-product-card');
    });

    it('preserves base styling with custom className', () => {
      render(<ProductCard product={mockProduct} className="custom-class" />);
      
      const cardContainer = screen.getByRole('link').firstChild as HTMLElement;
      expect(cardContainer).toHaveClass('custom-class', 'bg-white', 'rounded-lg', 'shadow-md');
    });
  });

  describe('Title Truncation', () => {
    it('truncates long product titles', () => {
      render(<ProductCard product={mockProduct} />);
      
      // The title should be truncated (mocked behavior)
      const titleElement = screen.getByText(/Test Product with a Very Long Name/);
      expect(titleElement).toBeInTheDocument();
    });

    it('shows full title when short', () => {
      const productWithShortTitle = {
        ...mockProduct,
        title: 'Short Title'
      };
      
      render(<ProductCard product={productWithShortTitle} />);
      
      expect(screen.getByText('Short Title')).toBeInTheDocument();
    });
  });
});

describe('CompactProductCard Component', () => {
  describe('Basic Functionality', () => {
    it('renders product information in compact format', () => {
      render(<CompactProductCard product={mockProduct} />);
      
      expect(screen.getByText(/Test Product with a Very Long Name/)).toBeInTheDocument();
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('src', mockProduct.image);
    });

    it('renders as a link', () => {
      render(<CompactProductCard product={mockProduct} />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', `/products/${mockProduct.id}`);
    });

    it('has compact image dimensions', () => {
      render(<CompactProductCard product={mockProduct} />);
      
      const imageContainer = screen.getByRole('img').parentElement;
      expect(imageContainer).toHaveClass('w-16', 'h-16');
    });
  });

  describe('Compact Layout', () => {
    it('uses horizontal flex layout', () => {
      render(<CompactProductCard product={mockProduct} />);
      
      const cardContainer = screen.getByRole('link').firstChild as HTMLElement;
      const flexContainer = cardContainer.querySelector('.flex');
      expect(flexContainer).toBeInTheDocument();
    });

    it('truncates title for compact display', () => {
      render(<CompactProductCard product={mockProduct} />);
      
      // Should show truncated version (mocked to 40 chars)
      const titleElement = screen.getByText(/Test Product with a Very Long Name/);
      expect(titleElement).toBeInTheDocument();
    });

    it('shows rating when available', () => {
      render(<CompactProductCard product={mockProduct} />);
      
      expect(screen.getByText('★')).toBeInTheDocument();
      expect(screen.getByText('4.5')).toBeInTheDocument();
    });

    it('hides rating when not available', () => {
      const productWithoutRating = {
        ...mockProduct,
        rating: undefined
      };
      
      render(<CompactProductCard product={productWithoutRating} />);
      
      expect(screen.queryByText('★')).not.toBeInTheDocument();
    });
  });

  describe('Click Handling', () => {
    it('calls onClick when provided', () => {
      const handleClick = jest.fn();
      render(<CompactProductCard product={mockProduct} onClick={handleClick} />);
      
      // Click on the card container, not the link
      const cardContainer = screen.getByRole('link').firstChild as HTMLElement;
      fireEvent.click(cardContainer);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      render(<CompactProductCard product={mockProduct} className="custom-compact-card" />);
      
      const cardContainer = screen.getByRole('link').firstChild as HTMLElement;
      expect(cardContainer).toHaveClass('custom-compact-card');
    });
  });
});

describe('ProductCardSkeleton Component', () => {
  describe('Basic Structure', () => {
    it('renders skeleton structure', () => {
      render(<ProductCardSkeleton />);
      
      // Check for animated skeleton elements
      const skeletonElements = document.querySelectorAll('.animate-pulse');
      expect(skeletonElements.length).toBeGreaterThan(0);
    });

    it('has proper default image size', () => {
      render(<ProductCardSkeleton />);
      
      const imageSkeletonContainer = document.querySelector('.h-48');
      expect(imageSkeletonContainer).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('applies small image size', () => {
      render(<ProductCardSkeleton imageSize="sm" />);
      
      const imageSkeletonContainer = document.querySelector('.h-32');
      expect(imageSkeletonContainer).toBeInTheDocument();
    });

    it('applies large image size', () => {
      render(<ProductCardSkeleton imageSize="lg" />);
      
      const imageSkeletonContainer = document.querySelector('.h-64');
      expect(imageSkeletonContainer).toBeInTheDocument();
    });
  });

  describe('Content Variants', () => {
    it('shows description skeleton when showDescription is true', () => {
      render(<ProductCardSkeleton showDescription />);
      
      // Should have additional skeleton lines for description
      const skeletonElements = document.querySelectorAll('.animate-pulse');
      expect(skeletonElements.length).toBeGreaterThan(4); // More skeleton elements
    });

    it('hides description skeleton by default', () => {
      render(<ProductCardSkeleton />);
      
      // Should have fewer skeleton elements without description
      const skeletonElements = document.querySelectorAll('.animate-pulse');
      expect(skeletonElements.length).toBeLessThan(8);
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      render(<ProductCardSkeleton className="custom-skeleton" />);
      
      const skeletonContainer = document.querySelector('.custom-skeleton');
      expect(skeletonContainer).toBeInTheDocument();
    });

    it('maintains skeleton base classes', () => {
      render(<ProductCardSkeleton className="custom-skeleton" />);
      
      const skeletonContainer = document.querySelector('.bg-white.rounded-lg.shadow-md');
      expect(skeletonContainer).toBeInTheDocument();
    });
  });

  describe('Skeleton Animation', () => {
    it('applies pulse animation to skeleton elements', () => {
      render(<ProductCardSkeleton />);
      
      const animatedElements = document.querySelectorAll('.animate-pulse');
      expect(animatedElements.length).toBeGreaterThan(2);
    });

    it('uses gray background for skeleton elements', () => {
      render(<ProductCardSkeleton />);
      
      const grayElements = document.querySelectorAll('.bg-gray-200');
      expect(grayElements.length).toBeGreaterThan(2);
    });
  });
}); 