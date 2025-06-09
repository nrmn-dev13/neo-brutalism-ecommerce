// components/molecules/ProductsHeader.tsx
"use client";

import { SortCombobox } from "./SortCombobox";
import { sortOptions } from "./SortCombobox";
import { ProductsResponse, PriceRange } from "@/types";
import { ProductFilters } from "@/hooks/useProductFilters";

interface ProductsHeaderProps {
  filters: ProductFilters;
  productsData: ProductsResponse | null;
  totalPages: number;
  availablePriceRange: PriceRange;
  onSortChange: (value: string) => void;
}

export function ProductsHeader({
  filters,
  productsData,
  totalPages,
  availablePriceRange,
  onSortChange,
}: ProductsHeaderProps) {
  const products = productsData?.products || [];
  const currentSortLabel =
    sortOptions.find((option) => option.value === filters.sortValue)?.label ||
    "Default";

  const currentCategoryLabel = filters.selectedCategory
    ? filters.selectedCategory
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "All Categories";

  const getHeaderTitle = () => {
    if (filters.searchQuery) return "Search Results";
    if (filters.selectedCategory) return currentCategoryLabel;
    return "Products";
  };

  const getDescription = () => {
    const total = productsData?.total || 0;
    const hasPriceFilter =
      filters.priceRange[0] !== availablePriceRange.min ||
      filters.priceRange[1] !== availablePriceRange.max;
    const hasRatingFilter = filters.selectedRating > 0;

    let description = "";

    if (filters.searchQuery) {
      description = `${total} result${total !== 1 ? "s" : ""} found for "${
        filters.searchQuery
      }"`;
      if (filters.selectedCategory) {
        description += ` in ${currentCategoryLabel}`;
      }
    } else if (filters.selectedCategory) {
      description = `${total} product${
        total !== 1 ? "s" : ""
      } in ${currentCategoryLabel}`;
    } else {
      description = `Discover our amazing collection of ${total} products`;
    }

    if (hasPriceFilter) {
      description += ` from $${filters.priceRange[0]} to $${filters.priceRange[1]}`;
    }

    if (hasRatingFilter) {
      description += ` with ${filters.selectedRating}+ star${
        filters.selectedRating !== 1 ? "s" : ""
      }`;
    }

    if (totalPages > 1) {
      description += ` • Page ${filters.currentPage} of ${totalPages}`;
    }

    return description;
  };

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold tracking-tight">{getHeaderTitle()}</h2>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-muted-foreground">{getDescription()}</p>
        {products.length > 0 && (
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Sorted by: <span className="font-medium">{currentSortLabel}</span>
            </p>
            <SortCombobox
              value={filters.sortValue}
              onValueChange={onSortChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
