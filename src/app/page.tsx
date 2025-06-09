"use client";

import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/molecules/Header";
import { ProductCard } from "@/components/molecules/ProductCard";
import { SortCombobox } from "@/components/molecules/SortCombobox";
import { Sidebar } from "@/components/molecules/Sidebar";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { ProductsResponse, PriceRange } from "@/types";
import { getProducts, searchProducts, getProductsByCategory, getCategories, getPriceRange } from "@/lib/api";
import { sortOptions } from "@/components/molecules/SortCombobox";

const PRODUCTS_PER_PAGE = 20;

export default function Home() {
  const [productsData, setProductsData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortValue, setSortValue] = useState("default");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [availablePriceRange, setAvailablePriceRange] = useState<PriceRange>({ min: 0, max: 5000 });
  const [selectedRating, setSelectedRating] = useState(0);

  // Fetch categories and price range on mount
  useEffect(() => {
    async function fetchInitialData() {
      try {
        setCategoriesLoading(true);
        
        // Fetch categories and price range in parallel
        const [categoriesData, priceRangeData] = await Promise.all([
          getCategories(),
          getPriceRange()
        ]);
        
        setCategories(categoriesData);
        setAvailablePriceRange(priceRangeData);
        setPriceRange([priceRangeData.min, priceRangeData.max]);
      } catch (err) {
        console.error("Error loading initial data:", err);
      } finally {
        setCategoriesLoading(false);
      }
    }

    fetchInitialData();
  }, []);

  const fetchData = useCallback(async (
    page: number, 
    query: string, 
    sort: string, 
    category: string, 
    currentPriceRange: [number, number],
    rating: number
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get sort parameters
      const sortOption = sortOptions.find(option => option.value === sort);
      const sortBy = sortOption?.sortBy;
      const order = sortOption?.order;
      
      // Create price range object if filtering is applied
      const priceFilter: PriceRange | undefined = 
        (currentPriceRange[0] !== availablePriceRange.min || currentPriceRange[1] !== availablePriceRange.max)
          ? { min: currentPriceRange[0], max: currentPriceRange[1] }
          : undefined;
      
      // Use rating filter if selected
      const minRating = rating > 0 ? rating : undefined;
      
      let data: ProductsResponse;
      
      // Determine which API to call based on search query and category
      if (query.trim()) {
        // If there's a search query, use search API
        data = await searchProducts(query, page, PRODUCTS_PER_PAGE, sortBy, order, priceFilter, minRating);
        
        // If category is selected, filter results client-side (since search API doesn't support category filtering)
        if (category && data.products.length > 0) {
          data.products = data.products.filter(product => product.category === category);
          data.total = data.products.length;
        }
      } else if (category) {
        // If category is selected but no search query, use category API
        data = await getProductsByCategory(category, page, PRODUCTS_PER_PAGE, sortBy, order, priceFilter, minRating);
      } else {
        // No search query and no category, get all products
        data = await getProducts(page, PRODUCTS_PER_PAGE, sortBy, order, priceFilter, minRating);
      }
      
      setProductsData(data);
    } catch (err) {
      setError("Failed to load products");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  }, [availablePriceRange]);

  useEffect(() => {
    if (availablePriceRange.min !== undefined && availablePriceRange.max !== undefined) {
      fetchData(currentPage, searchQuery, sortValue, selectedCategory, priceRange, selectedRating);
    }
  }, [currentPage, searchQuery, sortValue, selectedCategory, priceRange, selectedRating, fetchData, availablePriceRange]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSortChange = (value: string) => {
    setSortValue(value);
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePriceRangeChange = (newPriceRange: [number, number]) => {
    setPriceRange(newPriceRange);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearAllFilters = () => {
    setSelectedCategory("");
    setPriceRange([availablePriceRange.min, availablePriceRange.max]);
    setSelectedRating(0);
    setCurrentPage(1);
  };

  // Calculate pagination values
  const totalPages = productsData ? Math.ceil(productsData.total / PRODUCTS_PER_PAGE) : 0;
  const products = productsData?.products || [];

  // Get current sort label
  const currentSortLabel = sortOptions.find(option => option.value === sortValue)?.label || "Default";

  // Get current category label
  const currentCategoryLabel = selectedCategory 
    ? selectedCategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : "All Categories";

  // Check if any filters are applied
  const hasActiveFilters = Boolean(selectedCategory) || 
    (priceRange[0] !== availablePriceRange.min || priceRange[1] !== availablePriceRange.max) ||
    selectedRating > 0;

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const delta = 2; // Number of pages to show around current page
    const pages: (number | string)[] = [];
    
    // Always show first page
    if (totalPages <= 7) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex pagination logic
      pages.push(1);
      
      if (currentPage > delta + 2) {
        pages.push('...');
      }
      
      const start = Math.max(2, currentPage - delta);
      const end = Math.min(totalPages - 1, currentPage + delta);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - delta - 1) {
        pages.push('...');
      }
      
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Sidebar props
  const sidebarProps = {
    categories,
    selectedCategory,
    onCategoryChange: handleCategoryChange,
    categoriesLoading,
    priceRange,
    onPriceRangeChange: handlePriceRangeChange,
    availablePriceRange,
    selectedRating,
    onRatingChange: handleRatingChange,
    hasActiveFilters,
    onClearAllFilters: handleClearAllFilters,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          searchQuery={searchQuery} 
          onSearchChange={handleSearchChange}
        />
        <div className="flex">
          <Sidebar {...sidebarProps} />
          <main className="flex-1 py-8 px-6">
            <div className="mb-8">
              <div className="h-8 bg-muted animate-pulse rounded mb-2 w-48"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-64"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          searchQuery={searchQuery} 
          onSearchChange={handleSearchChange}
        />
        <div className="flex">
          <Sidebar {...sidebarProps} />
          <main className="flex-1 py-8 px-6">
            <div className="text-center py-12">
              <p className="text-destructive text-lg mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={handleSearchChange}
      />
      <div className="flex">
        <Sidebar {...sidebarProps} />
        <main className="flex-1 py-8 px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">
              {searchQuery ? `Search Results` : selectedCategory ? currentCategoryLabel : "Products"}
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-muted-foreground">
                {searchQuery ? (
                  <>
                    {productsData?.total || 0} result{(productsData?.total || 0) !== 1 ? "s" : ""} found for "{searchQuery}"
                    {selectedCategory && <span className="ml-2">in {currentCategoryLabel}</span>}
                    {(priceRange[0] !== availablePriceRange.min || priceRange[1] !== availablePriceRange.max) && (
                      <span className="ml-2">from ${priceRange[0]} to ${priceRange[1]}</span>
                    )}
                    {selectedRating > 0 && (
                      <span className="ml-2">with {selectedRating}+ star{selectedRating !== 1 ? 's' : ''}</span>
                    )}
                    {totalPages > 1 && (
                      <span className="ml-2">• Page {currentPage} of {totalPages}</span>
                    )}
                  </>
                ) : selectedCategory ? (
                  <>
                    {productsData?.total || 0} product{(productsData?.total || 0) !== 1 ? "s" : ""} in {currentCategoryLabel}
                    {(priceRange[0] !== availablePriceRange.min || priceRange[1] !== availablePriceRange.max) && (
                      <span className="ml-2">from ${priceRange[0]} to ${priceRange[1]}</span>
                    )}
                    {selectedRating > 0 && (
                      <span className="ml-2">with {selectedRating}+ star{selectedRating !== 1 ? 's' : ''}</span>
                    )}
                    {totalPages > 1 && (
                      <span className="ml-2">• Page {currentPage} of {totalPages}</span>
                    )}
                  </>
                ) : (
                  <>
                    Discover our amazing collection of {productsData?.total || 0} products
                    {(priceRange[0] !== availablePriceRange.min || priceRange[1] !== availablePriceRange.max) && (
                      <span className="ml-2">from ${priceRange[0]} to ${priceRange[1]}</span>
                    )}
                    {selectedRating > 0 && (
                      <span className="ml-2">with {selectedRating}+ star{selectedRating !== 1 ? 's' : ''}</span>
                    )}
                    {totalPages > 1 && (
                      <span className="ml-2">• Page {currentPage} of {totalPages}</span>
                    )}
                  </>
                )}
              </p>
              {products.length > 0 && (
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    Sorted by: <span className="font-medium">{currentSortLabel}</span>
                  </p>
                  <SortCombobox value={sortValue} onValueChange={handleSortChange} />
                </div>
              )}
            </div>
          </div>

          {products.length === 0 && (searchQuery || selectedCategory || hasActiveFilters) ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                {searchQuery && selectedCategory
                  ? `No products found matching "${searchQuery}" in ${currentCategoryLabel}`
                  : searchQuery
                  ? `No products found matching "${searchQuery}"`
                  : selectedCategory
                  ? `No products found in ${currentCategoryLabel}`
                  : "No products found with current filters"
                }
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your search terms or filters
              </p>
              <div className="flex gap-2 justify-center flex-wrap">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-primary hover:underline"
                  >
                    Clear search
                  </button>
                )}
                {hasActiveFilters && (
                  <button
                    onClick={handleClearAllFilters}
                    className="text-primary hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {generatePageNumbers().map((page, index) => (
                      <PaginationItem key={index}>
                        {page === '...' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            onClick={() => handlePageChange(page as number)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}