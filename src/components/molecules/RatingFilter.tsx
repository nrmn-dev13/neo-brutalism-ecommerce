// components/molecules/RatingFilter.tsx
"use client";

import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RatingFilterProps {
  value: number;
  onValueChange: (value: number) => void;
}

export function RatingFilter({ value, onValueChange }: RatingFilterProps) {
  const ratings = [1, 2, 3, 4, 5];

  const handleStarClick = (rating: number) => {
    // If clicking the same rating, clear the filter
    if (value === rating) {
      onValueChange(0);
    } else {
      onValueChange(rating);
    }
  };

  const handleClear = () => {
    onValueChange(0);
  };

  const isFiltered = value > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Star className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold">Rating</h3>
        </div>
        {isFiltered && (
          <Button
            size="sm"
            onClick={handleClear}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {/* Star Rating Selection */}
        <div className="flex flex-col space-y-2">
          {ratings.reverse().map((rating) => (
            <button
              key={rating}
              onClick={() => handleStarClick(rating)}
              className={`flex items-center space-x-2 p-2 rounded-md transition-colors hover:bg-accent text-left ${
                value === rating ? 'bg-accent' : ''
              }`}
            >
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${
                      index < rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm">
                {rating === 5 ? '5 stars' : `${rating}+ stars`}
              </span>
            </button>
          ))}
        </div>

        {/* Show selected rating */}
        {isFiltered && (
          <div className="text-xs text-muted-foreground">
            Showing products with <span className="font-medium">{value}+ star{value !== 1 ? 's' : ''}</span> rating
          </div>
        )}
      </div>
    </div>
  );
}