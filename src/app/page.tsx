"use client";

import { useEffect, useState, useMemo } from "react";
import { Header } from "@/components/molecules/Header";
import { ProductCard } from "@/components/molecules/ProductCard";
import { Product } from "@/types";
import { getProducts } from "@/lib/api";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }

    const query = searchQuery.toLowerCase().trim();
    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />
        <main className="container py-8">
          <div className="mb-8">
            <div className="h-8 bg-muted animate-pulse rounded mb-2 w-48"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-64"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />
        <main className="container py-8">
          <div className="text-center py-12">
            <p className="text-destructive text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      <main className="container py-8 mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            {searchQuery ? `Search Results` : "Products"}
          </h2>
          <p className="text-muted-foreground">
            {searchQuery ? (
              <>
                {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} found for "{searchQuery}"
              </>
            ) : (
              <>
                Discover our amazing collection of {products.length} products
              </>
            )}
          </p>
        </div>

        {filteredProducts.length === 0 && searchQuery ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              No products found matching "{searchQuery}"
            </p>
            <p className="text-sm text-muted-foreground">
              Try searching with different keywords or browse all products
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-primary hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}