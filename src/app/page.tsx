import { Layout, PageLayout } from '@/components/layout';
import { 
  ProductGrid, 
  ProductStats, 
  SearchBar, 
  CategoryFilter, 
  Pagination, 
  QuickCategoryFilter 
} from '@/components/features';
import { Button } from '@/components/ui';
import { useProductsContext } from '@/context';

export default function ProductsPage() {
  const {
    products,
    filteredProducts,
    allProducts,
    isLoading,
    error,
    filters,
    pagination,
    hasActiveFilters,
    resetFilters,
    totalProductsCount,
    isSearching
  } = useProductsContext();

  return (
    <Layout>
      <PageLayout maxWidth="7xl" padding="md">
        {/* Page Header with Search */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
              <p className="text-lg text-gray-600 mt-1">
                Discover amazing products at great prices
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center space-x-4">
              {hasActiveFilters && (
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <SearchBar
              placeholder="Search products by name, category, or description..."
              showSuggestions={true}
              className="w-full"
            />
          </div>
        </div>

        {/* Quick Category Filter - Mobile/Tablet */}
        <div className="lg:hidden mb-6">
          <QuickCategoryFilter className="w-full" />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20 space-y-6">
              {/* Category Filters */}
              <CategoryFilter
                title="Product Categories"
                variant="checkbox"
                showCounts={true}
                showClearAll={true}
                maxVisible={8}
              />

              {/* Filter Summary */}
              {hasActiveFilters && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">
                    Active Filters
                  </h4>
                  <div className="space-y-2">
                    {filters?.searchTerm && (
                      <div className="text-sm text-blue-800">
                        Search: "{filters.searchTerm}"
                      </div>
                    )}
                    {filters?.selectedCategories && filters.selectedCategories.length > 0 && (
                      <div className="text-sm text-blue-800">
                        Categories: {filters.selectedCategories.length} selected
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Product Stats and Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <ProductStats
                totalProducts={allProducts?.length || 0}
                filteredProducts={filteredProducts?.length || 0}
                currentPage={pagination?.currentPage || 1}
                pageSize={pagination?.pageSize || 50}
              />

              {/* Loading Indicator */}
              {(isLoading || isSearching) && (
                <div className="flex items-center space-x-2 text-sm text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                  <span>{isSearching ? 'Searching...' : 'Loading...'}</span>
                </div>
              )}
            </div>

            {/* Product Grid */}
            <div className="mb-8">
              <ProductGrid
                products={products || []}
                isLoading={isLoading}
                error={error}
                emptyMessage={
                  hasActiveFilters
                    ? 'No products match your current filters. Try adjusting your search or category selection.'
                    : 'No products available at the moment.'
                }
                gridCols={{
                  mobile: 2,
                  tablet: 3,
                  desktop: 4
                }}
                showDescription={false}
              />
            </div>

            {/* Pagination */}
            {!isLoading && products && products.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <Pagination
                  showPageSize={true}
                  showFirstLast={true}
                  showTotal={true}
                  maxVisiblePages={5}
                  variant="default"
                  className="mb-4"
                />
              </div>
            )}

            {/* Empty State - No Products Found */}
            {!isLoading && (!products || products.length === 0) && hasActiveFilters && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                    <div className="flex items-center justify-center mb-4">
                      <svg
                        className="h-16 w-16 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      We couldn't find any products matching your search criteria.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Try:</p>
                      <ul className="text-sm text-gray-500 space-y-1">
                        <li>• Adjusting your search terms</li>
                        <li>• Selecting different categories</li>
                        <li>• Clearing all filters</li>
                      </ul>
                    </div>
                    <Button
                      onClick={resetFilters}
                      variant="primary"
                      size="sm"
                      className="mt-4"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Pagination */}
        <div className="lg:hidden mt-8">
          {!isLoading && products && products.length > 0 && (
            <Pagination
              variant="simple"
              showPageSize={true}
              showTotal={false}
              className="bg-white border border-gray-200 rounded-lg p-4"
            />
          )}
        </div>

        {/* Performance Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
            <h4 className="font-medium mb-2">Debug Info:</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Total Products:</strong> {allProducts?.length || 0}
              </div>
              <div>
                <strong>Filtered Products:</strong> {filteredProducts?.length || 0}
              </div>
              <div>
                <strong>Displayed Products:</strong> {products?.length || 0}
              </div>
              <div>
                <strong>Current Page:</strong> {pagination?.currentPage || 1}
              </div>
              <div>
                <strong>Page Size:</strong> {pagination?.pageSize || 50}
              </div>
              <div>
                <strong>Active Filters:</strong> {hasActiveFilters ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        )}
      </PageLayout>
    </Layout>
  );
}
