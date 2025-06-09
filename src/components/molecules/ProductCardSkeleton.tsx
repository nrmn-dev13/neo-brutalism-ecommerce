import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="p-4">
        {/* Image skeleton */}
        <div className="aspect-square relative mb-4 overflow-hidden rounded-md">
          <Skeleton className="w-full h-full" />
        </div>
        
        {/* Title skeleton - two lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        {/* Description skeleton */}
        <div className="space-y-2 mt-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 pt-0">
        <div className="flex items-center justify-between mb-2">
          {/* Category badge skeleton */}
          <Skeleton className="h-5 w-20 rounded-full" />
          
          {/* Rating skeleton */}
          <div className="flex items-center space-x-1">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        
        {/* Discount badge skeleton */}
        <div className="flex items-center space-x-2 mb-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-3 w-12" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          {/* Price skeleton */}
          <Skeleton className="h-6 w-20" />
          
          {/* Button skeleton */}
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </CardFooter>
    </Card>
  );
}