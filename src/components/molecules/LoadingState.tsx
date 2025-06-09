// components/molecules/LoadingState.tsx
"use client";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sidebarProps: any;
}

export function LoadingState({
  searchQuery,
  onSearchChange,
  sidebarProps,
}: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={onSearchChange} />
      <div className="flex">
        <Sidebar {...sidebarProps} />
        <main className="flex-1 py-8 px-6">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <Skeleton className="h-4 w-64" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-[180px]" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
