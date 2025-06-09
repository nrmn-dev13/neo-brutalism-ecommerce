"use client";

import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/molecules/Header";
import { ProductCard } from "@/components/molecules/ProductCard";
import { SortCombobox } from "@/components/molecules/SortCombobox";
import { CategoryCombobox } from "@/components/molecules/CategoryCombobox";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { ProductsResponse } from "@/types";
import { getProducts, searchProducts, getProductsByCategory, getCategories } from "@/lib/api";
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

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        setCategoriesLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error loading categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const fetchData = useCallback(async (page: number, query: string, sort: string, category: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get sort parameters
      const sortOption = sortOptions.find(option => option.value === sort);
      const sortBy = sortOption?.sortBy;
      const order = sortOption?.order;
      
      let data: ProductsResponse;
      
      // Determine which API to call based on search query and category
      if (query.trim()) {
        // If there's a search query, use search API (note: search API doesn't support category filtering in DummyJSON)
        data = await searchProducts(query, page, PRODUCTS_PER_PAGE, sortBy, order);
        
        // If category is selected, filter results client-side
        if (category && data.products.length > 0) {
          data.products = data.products.filter(product => product.category === category);
          data.total = data.products.length;
        }
      } else if (category) {
        // If category is selected but no search query, use category API
        data = await getProductsByCategory(category, page, PRODUCTS_PER_PAGE, sortBy, order);
      } else {
        // No search query and no category, get all products
        data = await getProducts(page, PRODUCTS_PER_PAGE, sortBy, order);
      }
      
      setProductsData(data);
    } catch (err) {
      setError("Failed to load products");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage, searchQuery, sortValue, selectedCategory);
  }, [currentPage, searchQuery, sortValue, selectedCategory, fetchData]);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          searchQuery={searchQuery} 
          onSearchChange={handleSearchChange}
        />
        <div className="flex">
          {/* Static Sidebar */}
          <aside className="w-64 min-h-[calc(100vh-3.5rem)] bg-muted/30 border-r border-border p-6">
            <h1 className="text-2xl font-bold mb-6">This is sidebar</h1>
            <CategoryCombobox
              categories={categories}
              value={selectedCategory}
              onValueChange={handleCategoryChange}
              loading={categoriesLoading}
            />
          </aside>

          {/* Main Content */}
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
          {/* Static Sidebar */}
          <aside className="w-64 min-h-[calc(100vh-3.5rem)] bg-muted/30 border-r border-border p-6">
            <h1 className="text-2xl font-bold mb-6">This is sidebar</h1>
            <CategoryCombobox
              categories={categories}
              value={selectedCategory}
              onValueChange={handleCategoryChange}
              loading={categoriesLoading}
            />
          </aside>

          {/* Main Content */}
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
        {/* Static Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-3.5rem)] bg-muted/30 border-r border-border p-6">
          <h1 className="text-2xl font-bold mb-6">This is sidebar</h1>
          <CategoryCombobox
            categories={categories}
            value={selectedCategory}
            onValueChange={handleCategoryChange}
            loading={categoriesLoading}
          />
        </aside>

        {/* Main Content */}
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
                    {totalPages > 1 && (
                      <span className="ml-2">• Page {currentPage} of {totalPages}</span>
                    )}
                  </>
                ) : selectedCategory ? (
                  <>
                    {productsData?.total || 0} product{(productsData?.total || 0) !== 1 ? "s" : ""} in {currentCategoryLabel}
                    {totalPages > 1 && (
                      <span className="ml-2">• Page {currentPage} of {totalPages}</span>
                    )}
                  </>
                ) : (
                  <>
                    Discover our amazing collection of {productsData?.total || 0} products
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

          {products.length === 0 && (searchQuery || selectedCategory) ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                {searchQuery && selectedCategory
                  ? `No products found matching "${searchQuery}" in ${currentCategoryLabel}`
                  : searchQuery
                  ? `No products found matching "${searchQuery}"`
                  : `No products found in ${currentCategoryLabel}`
                }
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Try searching with different keywords or selecting a different category
              </p>
              <div className="flex gap-2 justify-center">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-primary hover:underline"
                  >
                    Clear search
                  </button>
                )}
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory("")}
                    className="text-primary hover:underline"
                  >
                    Clear category filter
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