// components/molecules/PriceRangeSlider.tsx
"use client";

import { DollarSign, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface PriceRangeSliderProps {
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function PriceRangeSlider({ 
  value, 
  onValueChange, 
  min = 0, 
  max = 5000, 
  step = 10 
}: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSliderChange = (newValue: number[]) => {
    const range: [number, number] = [newValue[0], newValue[1]];
    setLocalValue(range);
    onValueChange(range);
  };

  const handleClear = () => {
    const defaultRange: [number, number] = [min, max];
    setLocalValue(defaultRange);
    onValueChange(defaultRange);
  };

  const isFiltered = localValue[0] !== min || localValue[1] !== max;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold">Price Range</h3>
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

      <div className="px-2">
        <Slider
          value={localValue}
          onValueChange={handleSliderChange}
          max={max}
          min={min}
          step={step}
          className="w-full"
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex flex-col">
          <span className="text-muted-foreground">Min</span>
          <span className="font-medium">${localValue[0]}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-muted-foreground">Max</span>
          <span className="font-medium">${localValue[1]}</span>
        </div>
      </div>

      {isFiltered && (
        <div className="text-xs text-muted-foreground">
          Showing products from <span className="font-medium">${localValue[0]}</span> to <span className="font-medium">${localValue[1]}</span>
        </div>
      )}
    </div>
  );
}