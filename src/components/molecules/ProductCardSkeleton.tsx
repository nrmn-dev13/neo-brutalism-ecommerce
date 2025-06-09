// components/molecules/ProductCardSkeleton.tsx
"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="p-4">
        <Skeleton className="aspect-square w-full mb-4 rounded-md" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </CardHeader>

      <CardContent className="flex-1 p-4 pt-0">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <div className="flex items-center space-x-1">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mb-2">
          <Skeleton className="h-4 w-12 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      </CardFooter>
    </Card>
  );
}