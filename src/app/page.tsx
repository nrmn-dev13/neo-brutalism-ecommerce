"use client";

import { Header } from "@/components/molecules/Header";
import { ProductDialog } from "@/components/molecules/ProductDialog";
import { Sidebar } from "@/components/molecules/Sidebar";
import { ProductGrid } from "@/components/molecules/ProductGrid";
import { ProductsPagination } from "@/components/molecules/ProductsPagination";
import { ProductsHeader } from "@/components/molecules/ProductsHeader";
import { EmptyState } from "@/components/molecules/EmptyState";
import { ErrorState } from "@/components/molecules/ErrorState";
import { LoadingState } from "@/components/molecules/LoadingState";
import { Product } from "@/types";
import { useProductFilters } from "@/hooks/useProductFilters";
import { useProductsData } from "@/hooks/useProductsData";
import { useProductDialog } from "@/hooks/useProductDialog";

const PRODUCTS_PER_PAGE = 20;

export default function Home() {
  // Custom hooks for state management
  const {
    filters,
    categories,
    categoriesLoading,
    availablePriceRange,
    hasActiveFilters,
    updateFilters,
    clearAllFilters,
  } = useProductFilters();

  const { productsData, loading, error, refetch } = useProductsData(
    filters,
    PRODUCTS_PER_PAGE
  );

  const { selectedProduct, isDialogOpen, openDialog, closeDialog } =
    useProductDialog();

  // Event handlers
  const handleSearchChange = (query: string) => {
    updateFilters({ searchQuery: query, currentPage: 1 });
  };

  const handleSortChange = (value: string) => {
    updateFilters({ sortValue: value, currentPage: 1 });
  };

  const handleCategoryChange = (category: string) => {
    updateFilters({ selectedCategory: category, currentPage: 1 });
  };

  const handlePriceRangeChange = (newPriceRange: [number, number]) => {
    updateFilters({ priceRange: newPriceRange, currentPage: 1 });
  };

  const handleRatingChange = (rating: number) => {
    updateFilters({ selectedRating: rating, currentPage: 1 });
  };

  const handlePageChange = (page: number) => {
    updateFilters({ currentPage: page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductClick = (product: Product) => {
    openDialog(product);
  };

  // Derived values
  const products = productsData?.products || [];
  const totalPages = productsData
    ? Math.ceil(productsData.total / PRODUCTS_PER_PAGE)
    : 0;

  // Sidebar configuration
  const sidebarProps = {
    categories,
    selectedCategory: filters.selectedCategory,
    onCategoryChange: handleCategoryChange,
    categoriesLoading,
    priceRange: filters.priceRange,
    onPriceRangeChange: handlePriceRangeChange,
    availablePriceRange,
    selectedRating: filters.selectedRating,
    onRatingChange: handleRatingChange,
    hasActiveFilters,
    onClearAllFilters: clearAllFilters,
  };

  // Render states
  if (loading) {
    return (
      <LoadingState
        searchQuery={filters.searchQuery}
        onSearchChange={handleSearchChange}
        sidebarProps={sidebarProps}
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        searchQuery={filters.searchQuery}
        onSearchChange={handleSearchChange}
        onRetry={refetch}
        sidebarProps={sidebarProps}
      />
    );
  }

  const shouldShowEmptyState =
    products.length === 0 &&
    (filters.searchQuery || filters.selectedCategory || hasActiveFilters);

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchQuery={filters.searchQuery}
        onSearchChange={handleSearchChange}
      />

      <div className="flex">
        <Sidebar {...sidebarProps} />

        <main className="flex-1 py-8 px-6">
          <ProductsHeader
            filters={filters}
            productsData={productsData}
            totalPages={totalPages}
            availablePriceRange={availablePriceRange}
            onSortChange={handleSortChange}
          />

          {shouldShowEmptyState ? (
            <EmptyState
              filters={filters}
              hasActiveFilters={hasActiveFilters}
              onClearSearch={() => updateFilters({ searchQuery: "" })}
              onClearAllFilters={clearAllFilters}
            />
          ) : (
            <>
              <ProductGrid
                products={products}
                onProductClick={handleProductClick}
              />

              {totalPages > 1 && (
                <ProductsPagination
                  currentPage={filters.currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </main>
      </div>

      <ProductDialog
        product={selectedProduct}
        isOpen={isDialogOpen}
        onClose={closeDialog}
      />
    </div>
  );
}
