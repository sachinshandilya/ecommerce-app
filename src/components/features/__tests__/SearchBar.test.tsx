import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { SearchBar, AdvancedSearchBar, QuickSearch } from '../SearchBar';

// Mock the debounce hook
jest.mock('@/hooks', () => ({
  useSearchDebounce: jest.fn((value) => value), // Return value immediately for testing
}));

// Mock the context
const mockProductsContext = {
  updateSearchTerm: jest.fn(),
  updateCategories: jest.fn(),
  filters: {
    searchTerm: '',
    categories: [],
  },
  allProducts: [
    {
      id: 1,
      title: 'iPhone 14',
      category: 'electronics',
      price: 999,
      description: 'Latest iPhone model',
      image: 'iphone.jpg',
      rating: { rate: 4.5, count: 100 }
    },
    {
      id: 2,
      title: 'Samsung Galaxy S23',
      category: 'electronics',
      price: 899,
      description: 'Latest Samsung phone',
      image: 'samsung.jpg',
      rating: { rate: 4.3, count: 80 }
    },
    {
      id: 3,
      title: 'Gold Necklace',
      category: 'jewelry',
      price: 299,
      description: 'Beautiful gold necklace',
      image: 'necklace.jpg',
      rating: { rate: 4.8, count: 50 }
    }
  ],
  categories: ['electronics', 'jewelry', 'clothing'],
  isSearching: false,
};

jest.mock('@/context', () => ({
  useProductsContext: () => mockProductsContext,
}));

describe('SearchBar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProductsContext.filters.searchTerm = '';
    mockProductsContext.isSearching = false;
  });

  describe('Basic Functionality', () => {
    it('renders with default placeholder', () => {
      render(<SearchBar />);
      
      expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
      render(<SearchBar placeholder="Find your product..." />);
      
      expect(screen.getByPlaceholderText('Find your product...')).toBeInTheDocument();
    });

    it('shows search input field', () => {
      render(<SearchBar />);
      
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<SearchBar className="custom-search" />);
      
      const container = screen.getByRole('searchbox').closest('.custom-search');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Search Input Handling', () => {
    it('updates input value when typing', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);
      
      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'iPhone');
      
      expect(searchInput).toHaveValue('iPhone');
    });

    it('calls updateSearchTerm when debounced value changes', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);
      
      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'iPhone');
      
      // Should call updateSearchTerm with debounced value
      await waitFor(() => {
        expect(mockProductsContext.updateSearchTerm).toHaveBeenCalledWith('iPhone');
      });
    });

    it('syncs with context search term', () => {
      mockProductsContext.filters.searchTerm = 'Samsung';
      
      render(<SearchBar />);
      
      expect(screen.getByRole('searchbox')).toHaveValue('Samsung');
    });

    it('clears input when clear is clicked', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);
      
      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'iPhone');
      
      const clearButton = screen.getByRole('button', { name: 'Clear search' });
      await user.click(clearButton);
      
      expect(searchInput).toHaveValue('');
    });
  });

  describe('Loading State', () => {
    it('shows loading indicator when isSearching is true', () => {
      mockProductsContext.isSearching = true;
      
      render(<SearchBar />);
      
      const spinner = document.querySelector('svg.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('hides loading indicator when isSearching is false', () => {
      mockProductsContext.isSearching = false;
      
      render(<SearchBar />);
      
      const spinner = document.querySelector('svg.animate-spin');
      expect(spinner).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('disables search input when disabled prop is true', () => {
      render(<SearchBar disabled />);
      
      expect(screen.getByRole('searchbox')).toBeDisabled();
    });

    it('does not call updateSearchTerm when disabled', async () => {
      const user = userEvent.setup();
      render(<SearchBar disabled />);
      
      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'iPhone');
      
      expect(mockProductsContext.updateSearchTerm).not.toHaveBeenCalled();
    });
  });

  describe('Suggestions', () => {
    it('shows suggestions when showSuggestions is true and there is input', async () => {
      const user = userEvent.setup();
      render(<SearchBar showSuggestions />);
      
      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'iP');
      
      await waitFor(() => {
        expect(screen.getByText('iPhone 14')).toBeInTheDocument();
      });
    });

    it('does not show suggestions when input is too short', async () => {
      const user = userEvent.setup();
      render(<SearchBar showSuggestions />);
      
      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'i');
      
      expect(screen.queryByText('iPhone 14')).not.toBeInTheDocument();
    });

    it('does not show suggestions when showSuggestions is false', async () => {
      const user = userEvent.setup();
      render(<SearchBar showSuggestions={false} />);
      
      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'iPhone');
      
      expect(screen.queryByText('iPhone 14')).not.toBeInTheDocument();
    });

    it('filters suggestions based on input', async () => {
      const user = userEvent.setup();
      render(<SearchBar showSuggestions />);
      
      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'Samsung');
      
      await waitFor(() => {
        expect(screen.getByText('Samsung Galaxy S23')).toBeInTheDocument();
        expect(screen.queryByText('iPhone 14')).not.toBeInTheDocument();
      });
    });

    it('includes category suggestions', async () => {
      const user = userEvent.setup();
      render(<SearchBar showSuggestions />);
      
      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'elec');
      
      await waitFor(() => {
        expect(screen.getByText('electronics')).toBeInTheDocument();
      });
    });

    it('clicking suggestion updates search input', async () => {
      const user = userEvent.setup();
      render(<SearchBar showSuggestions />);
      
      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'iP');
      
      await waitFor(() => {
        const suggestion = screen.getByText('iPhone 14');
        user.click(suggestion);
      });
      
      await waitFor(() => {
        expect(searchInput).toHaveValue('iPhone 14');
      });
    });
  });

  describe('Focus and Accessibility', () => {
    it('can receive focus', () => {
      render(<SearchBar autoFocus />);
      
      const searchInput = screen.getByRole('searchbox');
      searchInput.focus();
      expect(searchInput).toHaveFocus();
    });

    it('has proper aria-label', () => {
      render(<SearchBar />);
      
      expect(screen.getByRole('searchbox')).toHaveAttribute('aria-label', 'Search products...');
    });
  });
});

describe('AdvancedSearchBar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProductsContext.filters.searchTerm = '';
  });

  describe('Basic Functionality', () => {
    it('renders main search input', () => {
      render(<AdvancedSearchBar />);
      
      expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    });

    it('renders filters toggle button', () => {
      render(<AdvancedSearchBar />);
      
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('initially hides expanded filters', () => {
      render(<AdvancedSearchBar />);
      
      expect(screen.queryByText('Category')).not.toBeInTheDocument();
      expect(screen.queryByText('Price Range:')).not.toBeInTheDocument();
    });
  });

  describe('Filters Expansion', () => {
    it('shows expanded filters when toggle is clicked', async () => {
      const user = userEvent.setup();
      render(<AdvancedSearchBar />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText(/Price Range:/)).toBeInTheDocument();
    });

    it('hides expanded filters when toggle is clicked again', async () => {
      const user = userEvent.setup();
      render(<AdvancedSearchBar />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      await user.click(filtersButton);
      
      expect(screen.queryByText('Category')).not.toBeInTheDocument();
    });

    it('rotates filter icon when expanded', async () => {
      const user = userEvent.setup();
      render(<AdvancedSearchBar />);
      
      const filtersButton = screen.getByText('Filters');
      const icon = filtersButton.querySelector('svg');
      
      await user.click(filtersButton);
      
      expect(icon).toHaveClass('rotate-180');
    });
  });

  describe('Category Filter', () => {
    it('renders category dropdown with options', async () => {
      const user = userEvent.setup();
      render(<AdvancedSearchBar />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      const categorySelect = screen.getByRole('combobox');
      expect(categorySelect).toBeInTheDocument();
      
      expect(screen.getByText('All Categories')).toBeInTheDocument();
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Jewelry')).toBeInTheDocument();
    });

    it('updates category filter when selection changes', async () => {
      const user = userEvent.setup();
      render(<AdvancedSearchBar />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      const categorySelect = screen.getByRole('combobox');
      await user.selectOptions(categorySelect, 'electronics');
      
      expect(mockProductsContext.updateCategories).toHaveBeenCalledWith(['electronics']);
    });

    it('clears category filter when "All Categories" is selected', async () => {
      const user = userEvent.setup();
      render(<AdvancedSearchBar />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      const categorySelect = screen.getByRole('combobox');
      await user.selectOptions(categorySelect, '');
      
      expect(mockProductsContext.updateCategories).toHaveBeenCalledWith([]);
    });
  });

  describe('Price Range Filter', () => {
    it('renders price range inputs', async () => {
      const user = userEvent.setup();
      render(<AdvancedSearchBar />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      const priceRangeInputs = screen.getAllByRole('slider');
      expect(priceRangeInputs).toHaveLength(2);
    });

    it('displays current price range values', async () => {
      const user = userEvent.setup();
      render(<AdvancedSearchBar />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      expect(screen.getByText(/Price Range: \$0 - \$1000/)).toBeInTheDocument();
    });

    it('updates price range when sliders change', async () => {
      const user = userEvent.setup();
      render(<AdvancedSearchBar />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      const priceRangeInputs = screen.getAllByRole('slider');
      
      // Clear and set value for range input
      fireEvent.change(priceRangeInputs[0], { target: { value: '100' } });
      
      // Should update the local state (implementation details)
      expect(priceRangeInputs[0]).toHaveValue('100');
    });
  });

  describe('Clear Filters', () => {
    it('renders clear filters button', async () => {
      const user = userEvent.setup();
      render(<AdvancedSearchBar />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      expect(screen.getByText('Clear All Filters')).toBeInTheDocument();
    });

    it('clears all filters when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<AdvancedSearchBar />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      const clearButton = screen.getByText('Clear All Filters');
      await user.click(clearButton);
      
      expect(mockProductsContext.updateSearchTerm).toHaveBeenCalledWith('');
      expect(mockProductsContext.updateCategories).toHaveBeenCalledWith([]);
    });
  });

  describe('Filters Change Callback', () => {
    it('calls onFiltersChange when search changes', async () => {
      const onFiltersChange = jest.fn();
      const user = userEvent.setup();
      
      render(<AdvancedSearchBar onFiltersChange={onFiltersChange} />);
      
      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'test');
      
      await waitFor(() => {
        expect(onFiltersChange).toHaveBeenCalledWith(
          expect.objectContaining({
            search: 'test'
          })
        );
      });
    });

    it('calls onFiltersChange when category changes', async () => {
      const onFiltersChange = jest.fn();
      const user = userEvent.setup();
      
      render(<AdvancedSearchBar onFiltersChange={onFiltersChange} />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      const categorySelect = screen.getByRole('combobox');
      await user.selectOptions(categorySelect, 'electronics');
      
      expect(onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          category: 'electronics'
        })
      );
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      render(<AdvancedSearchBar className="custom-advanced-search" />);
      
      const container = document.querySelector('.custom-advanced-search');
      expect(container).toBeInTheDocument();
    });
  });
});

describe('QuickSearch Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProductsContext.filters.searchTerm = '';
  });

  describe('Basic Functionality', () => {
    it('renders with default placeholder', () => {
      render(<QuickSearch />);
      
      expect(screen.getByPlaceholderText('Quick search...')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
      render(<QuickSearch placeholder="Find items..." />);
      
      expect(screen.getByPlaceholderText('Find items...')).toBeInTheDocument();
    });

    it('shows current search term from context', () => {
      mockProductsContext.filters.searchTerm = 'iPhone';
      
      render(<QuickSearch />);
      
      expect(screen.getByRole('searchbox')).toHaveValue('iPhone');
    });
  });

  describe('Size Variants', () => {
    it('applies medium size by default', () => {
      render(<QuickSearch />);
      
      const searchInput = screen.getByRole('searchbox');
      expect(searchInput).toHaveClass('text-sm', 'py-2', 'px-3');
    });

    it('applies small size', () => {
      render(<QuickSearch size="sm" />);
      
      const searchInput = screen.getByRole('searchbox');
      expect(searchInput).toHaveClass('text-sm', 'py-1', 'px-2');
    });

    it('applies large size', () => {
      render(<QuickSearch size="lg" />);
      
      const searchInput = screen.getByRole('searchbox');
      expect(searchInput).toHaveClass('text-base', 'py-3', 'px-4');
    });
  });

  describe('Search Functionality', () => {
    it('calls updateSearchTerm when value changes', async () => {
      const user = userEvent.setup();
      render(<QuickSearch />);
      
      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'test');
      
      await waitFor(() => {
        expect(mockProductsContext.updateSearchTerm).toHaveBeenCalledWith('t');
        expect(mockProductsContext.updateSearchTerm).toHaveBeenCalledTimes(4);
      });
    });

    it('handles empty updateSearchTerm gracefully', async () => {
      const contextWithoutUpdate = {
        ...mockProductsContext,
        updateSearchTerm: undefined,
      };
      
      // Temporarily override the mock
      const originalMock = require('@/context').useProductsContext;
      require('@/context').useProductsContext = () => contextWithoutUpdate;
      
      const user = userEvent.setup();
      render(<QuickSearch />);
      
      const searchInput = screen.getByRole('searchbox');
      
      // Should not throw an error when typing (even if updateSearchTerm is undefined)
      await expect(user.type(searchInput, 'test')).resolves.not.toThrow();
      
      // Restore the original mock
      require('@/context').useProductsContext = originalMock;
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      render(<QuickSearch className="custom-quick-search" />);
      
      const searchInput = screen.getByRole('searchbox');
      expect(searchInput).toHaveClass('custom-quick-search');
    });

    it('combines custom className with size classes', () => {
      render(<QuickSearch className="custom-class" size="lg" />);
      
      const searchInput = screen.getByRole('searchbox');
      expect(searchInput).toHaveClass('custom-class', 'text-base', 'py-3', 'px-4');
    });
  });

  describe('Integration with Context', () => {
    it('syncs with context search term changes', () => {
      const { rerender } = render(<QuickSearch />);
      
      expect(screen.getByRole('searchbox')).toHaveValue('');
      
      mockProductsContext.filters.searchTerm = 'Samsung';
      rerender(<QuickSearch />);
      
      expect(screen.getByRole('searchbox')).toHaveValue('Samsung');
    });

    it('handles undefined filters gracefully', () => {
      const contextWithUndefinedFilters = {
        ...mockProductsContext,
        filters: undefined,
      };
      
      // Temporarily override the mock
      const originalMock = require('@/context').useProductsContext;
      require('@/context').useProductsContext = () => contextWithUndefinedFilters;
      
      render(<QuickSearch />);
      
      expect(screen.getByRole('searchbox')).toHaveValue('');
      
      // Restore the original mock
      require('@/context').useProductsContext = originalMock;
    });
  });
}); 