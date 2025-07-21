# Task 007: Product Listing and Search/Filter Features

## Overview
Implement the main product listing page with search functionality, category filtering, pagination, and responsive product grid using client-side operations.

## Priority: High
**Estimated Time**: 8 hours  
**Dependencies**: Task 004 (Context Providers), Task 006 (Layout Components)  
**Completion Criteria**: Fully functional product listing with search, filters, and pagination

## Implementation Details

### 1. Product Grid Component (`/src/components/features/ProductGrid.tsx`)

#### Product Grid Features
- **Responsive Grid**: Desktop (4 columns), tablet (3 columns), mobile (2 columns)
- **Loading States**: Skeleton loaders for initial loading
- **Empty States**: "No products found" message for filtered results
- **Image Optimization**: Next.js Image component for product images

#### Implementation Requirements
```typescript
interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}
```

#### Grid Layout
- Use CSS Grid with Tailwind classes
- Responsive breakpoints for different screen sizes
- Consistent spacing between product cards
- Proper aspect ratio for product images

### 2. Product Card Component (`/src/components/features/ProductCard.tsx`)

#### Product Card Features
- **Product Image**: Optimized with Next.js Image component
- **Product Title**: Truncated for consistent card height
- **Price Display**: Formatted currency display
- **Category Badge**: Visual category indicator
- **Rating Display**: Star rating visualization
- **Click Navigation**: Navigate to product details page

#### Implementation Requirements
```typescript
interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}
```

#### Card Design
- Consistent card height and width
- Hover effects for interactive feedback
- Image placeholder for loading states
- Proper text truncation for long titles
- Price formatting using utility functions

### 3. Search Bar Component (`/src/components/features/SearchBar.tsx`)

#### Search Features
- **Debounced Search**: 1-second delay using useDebounce hook
- **Real-time Results**: Immediate filtering of product list
- **Clear Functionality**: Button to clear search input
- **Search Suggestions**: Optional search suggestions display

#### Implementation Requirements
```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
```

#### Context Integration
- Integrate with ProductsContext for search state
- Use debounced search to avoid excessive filtering
- Filter products by title match (case-insensitive)
- Update URL with search parameters (optional)

### 4. Category Filter Component (`/src/components/features/CategoryFilter.tsx`)

#### Filter Features
- **Multi-Select Categories**: Checkbox-based category selection
- **Real-time Filtering**: Immediate results when categories change
- **Category Count**: Show product count per category
- **Clear Filters**: Reset all category selections

#### Implementation Requirements
```typescript
interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  productCounts?: Record<string, number>;
}
```

#### Filter Logic
- Load categories from ProductsContext
- Support multiple category selection
- Combine with search filters
- Show product count for each category

### 5. Pagination Component (`/src/components/features/Pagination.tsx`)

#### Pagination Features
- **Page Size Options**: 50, 100, 200 items per page
- **Page Navigation**: Previous, next, direct page selection
- **Total Count Display**: Show total products and current range
- **Responsive Design**: Stack controls on mobile

#### Implementation Requirements
```typescript
interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}
```

#### Pagination Logic
- Calculate total pages based on filtered results
- Implement page size selection dropdown
- Handle edge cases (empty results, single page)
- Maintain pagination state in ProductsContext

### 6. Products Page Implementation (`/src/app/page.tsx`)

#### Page Features
- **Layout Integration**: Use Layout component wrapper
- **Context Consumption**: Access ProductsContext for data and state
- **Filter Sidebar**: Desktop sidebar, mobile drawer for filters
- **Responsive Design**: Adapt layout for different screen sizes

#### Page Structure
```typescript
// Page component structure
export default function ProductsPage() {
  // Context integration
  // Search and filter state management
  // Product loading and error handling
  // Render components with proper data flow
}
```

#### State Management
- Use ProductsContext for all product-related state
- Handle loading states during initial data fetch
- Manage search and filter state updates
- Implement pagination state persistence during session

## Implementation Guidelines

### Client-Side Filtering Logic
- **Search Filtering**: Case-insensitive title matching
- **Category Filtering**: Include products matching any selected category
- **Combined Filters**: Apply search and category filters together
- **Performance**: Optimize filtering for large product datasets

### Responsive Design Requirements
- **Mobile Layout**: Stack filters above product grid
- **Tablet Layout**: Sidebar filters with grid layout
- **Desktop Layout**: Fixed sidebar with main content area
- **Touch Interactions**: Mobile-friendly filter controls

### Loading State Management
- **Initial Load**: Show skeleton loaders for product grid
- **Filter Updates**: Show loading indicators during filtering
- **Empty States**: Display appropriate messages for no results
- **Error States**: Handle API failures gracefully

### Search Implementation
```typescript
// Debounced search integration
const debouncedSearchTerm = useDebounce(searchTerm, 1000);

useEffect(() => {
  setFilters({ ...filters, search: debouncedSearchTerm });
}, [debouncedSearchTerm]);
```

## Acceptance Criteria
- [ ] Product grid displays all products in responsive layout
- [ ] Search functionality works with 1-second debounce
- [ ] Category filters support multi-select with real-time updates
- [ ] Pagination controls work with configurable page sizes
- [ ] Loading states show during data fetching
- [ ] Empty states display when no products match filters
- [ ] Product cards navigate to details page on click
- [ ] Layout is responsive across all screen sizes
- [ ] All filtering is performed client-side
- [ ] No state persistence (resets on page refresh)

## Code Quality Checklist
- [ ] Each component file under 300 lines
- [ ] All imports at top of files
- [ ] Descriptive component and prop names
- [ ] Proper TypeScript interfaces
- [ ] No unused imports or variables
- [ ] Consistent naming conventions
- [ ] Context integration follows patterns

## File Structure After Completion
```
/src
  /components
    /features
      ProductGrid.tsx       # Main product grid layout
      ProductCard.tsx       # Individual product card
      SearchBar.tsx         # Product search functionality
      CategoryFilter.tsx    # Category filtering component
      Pagination.tsx        # Pagination controls
      index.ts             # Export all feature components
  /app
    page.tsx              # Main products listing page
```

## Performance Considerations
- **Image Loading**: Use Next.js Image optimization
- **Filter Performance**: Optimize filtering algorithms for large datasets
- **Memory Usage**: Monitor memory consumption with large product lists
- **Render Optimization**: Use React.memo for expensive components

## Testing Strategy
- Test product grid rendering with different data sets
- Verify search functionality with various search terms
- Test category filtering with multiple selections
- Validate pagination with different page sizes
- Test responsive behavior across screen sizes
- Verify loading and empty states

## Integration Points
This implementation will integrate with:
- ProductsContext for state management
- Layout components for page structure
- UI components for interactive elements
- Product details page for navigation
- Cart functionality for future enhancement

## Next Steps
After completion, this task enables:
- Task 008: Product Details Page Implementation
- Task 009: Shopping Cart Functionality
- Task 010: User Profile Implementation

## Accessibility Requirements
- Keyboard navigation for all interactive elements
- Screen reader support for filter controls
- ARIA labels for search and filter components
- Focus management for pagination controls
- Color contrast compliance for all text and buttons 