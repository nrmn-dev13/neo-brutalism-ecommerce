// components/molecules/ErrorState.tsx
"use client";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface ErrorStateProps {
  error: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRetry: () => void;
  sidebarProps: any;
}

export function ErrorState({
  error,
  searchQuery,
  onSearchChange,
  onRetry,
  sidebarProps,
}: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={onSearchChange} />
      <div className="flex">
        <Sidebar {...sidebarProps} />
        <main className="flex-1 py-8 px-6">
          <div className="text-center py-12">
            <p className="text-destructive text-lg mb-4">{error}</p>
            <button onClick={onRetry} className="text-primary hover:underline">
              Try again
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
