// components/molecules/EmptyState.tsx
"use client";

import { ProductFilters } from "@/hooks/useProductFilters";

interface EmptyStateProps {
  filters: ProductFilters;
  hasActiveFilters: boolean;
  onClearSearch: () => void;
  onClearAllFilters: () => void;
}

export function EmptyState({
  filters,
  hasActiveFilters,
  onClearSearch,
  onClearAllFilters,
}: EmptyStateProps) {
  const currentCategoryLabel = filters.selectedCategory
    ? filters.selectedCategory
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";

  const getMessage = () => {
    if (filters.searchQuery && filters.selectedCategory) {
      return `No products found matching "${filters.searchQuery}" in ${currentCategoryLabel}`;
    }
    if (filters.searchQuery) {
      return `No products found matching "${filters.searchQuery}"`;
    }
    if (filters.selectedCategory) {
      return `No products found in ${currentCategoryLabel}`;
    }
    return "No products found with current filters";
  };

  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground text-lg mb-4">{getMessage()}</p>
      <p className="text-sm text-muted-foreground mb-4">
        Try adjusting your search terms or filters
      </p>
      <div className="flex gap-2 justify-center flex-wrap">
        {filters.searchQuery && (
          <button
            onClick={onClearSearch}
            className="text-primary hover:underline"
          >
            Clear search
          </button>
        )}
        {hasActiveFilters && (
          <button
            onClick={onClearAllFilters}
            className="text-primary hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
