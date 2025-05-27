"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cartStore";
import { Cart } from "./Cart";
import { useState, useEffect } from "react";

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const totalItems = useCartStore((state) => state.getTotalItems());
  const hasHydrated = useCartStore((state) => state.hasHydrated);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Jangan render total items sampai hydration selesai
  const displayTotalItems = mounted && hasHydrated ? totalItems : 0;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between mx-auto">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold">Neo Ecommerce</h1>
          </div>

          <Button
            size="sm"
            className="relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-4 w-4" />
            {displayTotalItems > 0 && (
              <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs">
                {displayTotalItems}
              </Badge>
            )}
          </Button>
        </div>
      </header>

      {mounted && (
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}
    </>
  );
}
