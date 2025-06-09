// components/molecules/SortCombobox.tsx
"use client";

import { ArrowUpDown } from "lucide-react";
import { Combobox } from "../ui/combobox";
import { SortOption } from "@/types";

const sortOptions: SortOption[] = [
  {
    value: "default",
    label: "Default",
  },
  {
    value: "price-low",
    label: "Price: Low to High",
    sortBy: "price",
    order: "asc",
  },
  {
    value: "price-high",
    label: "Price: High to Low",
    sortBy: "price",
    order: "desc",
  },
  {
    value: "rating-high",
    label: "Rating: High to Low",
    sortBy: "rating",
    order: "desc",
  },
  {
    value: "rating-low",
    label: "Rating: Low to High",
    sortBy: "rating",
    order: "asc",
  },
  {
    value: "title-az",
    label: "Name: A to Z",
    sortBy: "title",
    order: "asc",
  },
  {
    value: "title-za",
    label: "Name: Z to A",
    sortBy: "title",
    order: "desc",
  },
];

interface SortComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function SortCombobox({ value, onValueChange }: SortComboboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      <Combobox
        options={sortOptions}
        value={value}
        onValueChange={onValueChange}
        placeholder="Sort by..."
        searchPlaceholder="Search sort options..."
        emptyText="No sort option found."
        className="w-[180px]"
      />
    </div>
  );
}

export { sortOptions };