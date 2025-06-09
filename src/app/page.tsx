"use client";

import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/molecules/Header";
import { ProductCard } from "@/components/molecules/ProductCard";
import { SortCombobox } from "@/components/molecules/SortCombobox";
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
import { getProducts, searchProducts } from "@/lib/api";
import { sortOptions } from "@/components/molecules/SortCombobox";

const PRODUCTS_PER_PAGE = 20;

export default function Home() {
  const [productsData, setProductsData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortValue, setSortValue] = useState("default");

  const fetchData = useCallback(async (page: number, query: string, sort: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get sort parameters
      const sortOption = sortOptions.find(option => option.value === sort);
      const sortBy = sortOption?.sortBy;
      const order = sortOption?.order;
      
      let data: ProductsResponse;
      if (query.trim()) {
        data = await searchProducts(query, page, PRODUCTS_PER_PAGE, sortBy, order);
      } else {
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
    fetchData(currentPage, searchQuery, sortValue);
  }, [currentPage, searchQuery, sortValue, fetchData]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSortChange = (value: string) => {
    setSortValue(value);
    setCurrentPage(1); // Reset to first page when sorting
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
        <main className="container py-8">
          <div className="mb-8">
            <div className="h-8 bg-muted animate-pulse rounded mb-2 w-48"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-64"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </main>
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
        <main className="container py-8">
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
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={handleSearchChange}
      />
      <main className="container py-8 mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            {searchQuery ? `Search Results` : "Products"}
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-muted-foreground">
              {searchQuery ? (
                <>
                  {productsData?.total || 0} result{(productsData?.total || 0) !== 1 ? "s" : ""} found for "{searchQuery}"
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

        {products.length === 0 && searchQuery ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              No products found matching "{searchQuery}"
            </p>
            <p className="text-sm text-muted-foreground">
              Try searching with different keywords or browse all products
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-primary hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
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
  );
}