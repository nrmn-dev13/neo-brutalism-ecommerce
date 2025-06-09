// components/molecules/Sidebar.tsx
"use client";

import { CategoryCombobox } from "./CategoryCombobox";
import { PriceRangeSlider } from "./PriceRangeSlider";
import { RatingFilter } from "./RatingFilter";
import { Separator } from "@/components/ui/separator";
import { PriceRange } from "@/types";

interface SidebarProps {
  // Category filter props
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categoriesLoading: boolean;

  // Price range filter props
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  availablePriceRange: PriceRange;

  // Rating filter props
  selectedRating: number;
  onRatingChange: (rating: number) => void;

  // Clear all filters
  hasActiveFilters: boolean;
  onClearAllFilters: () => void;
}

export function Sidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  categoriesLoading,
  priceRange,
  onPriceRangeChange,
  availablePriceRange,
  selectedRating,
  onRatingChange,
  hasActiveFilters,
  onClearAllFilters,
}: SidebarProps) {
  return (
    <aside className="w-64 sticky top-14 h-[calc(100vh-3.5rem)] bg-muted/30 border-r border-border overflow-y-auto">
      <div className="p-6">
        <div className="space-y-6">
          {/* Category Filter */}
          <CategoryCombobox
            categories={categories}
            value={selectedCategory}
            onValueChange={onCategoryChange}
            loading={categoriesLoading}
          />

          <Separator />

          {/* Price Range Filter */}
          <PriceRangeSlider
            value={priceRange}
            onValueChange={onPriceRangeChange}
            min={availablePriceRange.min}
            max={availablePriceRange.max}
          />

          <Separator />

          {/* Rating Filter */}
          <RatingFilter value={selectedRating} onValueChange={onRatingChange} />

          {/* Clear All Filters */}
          {hasActiveFilters && (
            <>
              <Separator />
              <button
                onClick={onClearAllFilters}
                className="w-full text-sm text-primary hover:underline"
              >
                Clear all filters
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
