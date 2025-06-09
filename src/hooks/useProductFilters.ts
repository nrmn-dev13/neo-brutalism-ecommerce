// hooks/useProductFilters.ts
import { useState, useEffect } from "react";
import { getCategories, getPriceRange } from "@/lib/api";
import { PriceRange } from "@/types";

export interface ProductFilters {
  searchQuery: string;
  currentPage: number;
  sortValue: string;
  selectedCategory: string;
  priceRange: [number, number];
  selectedRating: number;
}

const DEFAULT_FILTERS: ProductFilters = {
  searchQuery: "",
  currentPage: 1,
  sortValue: "default",
  selectedCategory: "",
  priceRange: [0, 5000],
  selectedRating: 0,
};

export function useProductFilters() {
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [availablePriceRange, setAvailablePriceRange] = useState<PriceRange>({
    min: 0,
    max: 5000,
  });

  // Initialize categories and price range
  useEffect(() => {
    async function fetchInitialData() {
      try {
        setCategoriesLoading(true);
        const [categoriesData, priceRangeData] = await Promise.all([
          getCategories(),
          getPriceRange(),
        ]);

        setCategories(categoriesData);
        setAvailablePriceRange(priceRangeData);
        setFilters((prev) => ({
          ...prev,
          priceRange: [priceRangeData.min, priceRangeData.max],
        }));
      } catch (err) {
        console.error("Error loading initial data:", err);
      } finally {
        setCategoriesLoading(false);
      }
    }

    fetchInitialData();
  }, []);

  const updateFilters = (updates: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const clearAllFilters = () => {
    setFilters({
      ...DEFAULT_FILTERS,
      priceRange: [availablePriceRange.min, availablePriceRange.max],
    });
  };

  const hasActiveFilters =
    Boolean(filters.selectedCategory) ||
    filters.priceRange[0] !== availablePriceRange.min ||
    filters.priceRange[1] !== availablePriceRange.max ||
    filters.selectedRating > 0;

  return {
    filters,
    categories,
    categoriesLoading,
    availablePriceRange,
    hasActiveFilters,
    updateFilters,
    clearAllFilters,
  };
}
