// components/molecules/CategoryCombobox.tsx
"use client";

import { Filter, X } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";

interface CategoryComboboxProps {
  categories: string[];
  value: string;
  onValueChange: (value: string) => void;
  loading?: boolean;
}

export function CategoryCombobox({ categories, value, onValueChange, loading }: CategoryComboboxProps) {
  // Format categories for combobox options
  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((category) => ({
      value: category,
      label: category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }))
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold">Categories</h3>
        </div>
        {value && (
          <Button
            size="sm"
            onClick={() => onValueChange("")}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <Combobox
        options={categoryOptions}
        value={value}
        onValueChange={onValueChange}
        placeholder={loading ? "Loading..." : "Select category..."}
        searchPlaceholder="Search categories..."
        emptyText="No category found."
        className="w-full"
      />
      
      {value && (
        <div className="text-xs text-muted-foreground">
          Filtering by: <span className="font-medium">{categoryOptions.find(opt => opt.value === value)?.label}</span>
        </div>
      )}
    </div>
  );
}