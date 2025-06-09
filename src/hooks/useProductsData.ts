// hooks/useProductsData.ts
import { useState, useEffect, useCallback } from "react";
import { ProductsResponse, PriceRange } from "@/types";
import { getProducts, searchProducts, getProductsByCategory } from "@/lib/api";
import { sortOptions } from "@/components/molecules/SortCombobox";
import { ProductFilters } from "./useProductFilters";

export function useProductsData(filters: ProductFilters, itemsPerPage: number) {
  const [productsData, setProductsData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get sort parameters
      const sortOption = sortOptions.find(option => option.value === filters.sortValue);
      const sortBy = sortOption?.sortBy;
      const order = sortOption?.order;
      
      // Create price range object if filtering is applied
      const priceFilter: PriceRange | undefined = 
        (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 5000)
          ? { min: filters.priceRange[0], max: filters.priceRange[1] }
          : undefined;
      
      // Use rating filter if selected
      const minRating = filters.selectedRating > 0 ? filters.selectedRating : undefined;
      
      let data: ProductsResponse;
      
      // Determine which API to call
      if (filters.searchQuery.trim()) {
        data = await searchProducts(
          filters.searchQuery, 
          filters.currentPage, 
          itemsPerPage, 
          sortBy, 
          order, 
          priceFilter, 
          minRating
        );
        
        // Filter by category if selected (client-side)
        if (filters.selectedCategory && data.products.length > 0) {
          data.products = data.products.filter(product => product.category === filters.selectedCategory);
          data.total = data.products.length;
        }
      } else if (filters.selectedCategory) {
        data = await getProductsByCategory(
          filters.selectedCategory, 
          filters.currentPage, 
          itemsPerPage, 
          sortBy, 
          order, 
          priceFilter, 
          minRating
        );
      } else {
        data = await getProducts(
          filters.currentPage, 
          itemsPerPage, 
          sortBy, 
          order, 
          priceFilter, 
          minRating
        );
      }
      
      setProductsData(data);
    } catch (err) {
      setError("Failed to load products");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, itemsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    fetchData();
  };

  return {
    productsData,
    loading,
    error,
    refetch
  };
}