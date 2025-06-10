"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Cart({ isOpen, onClose }: CartProps) {
  const [mounted, setMounted] = useState(false);

  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    hasHydrated,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Jangan render cart content sampai mounted dan hydrated
  if (!mounted || !hasHydrated) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
            <SheetDescription>Loading...</SheetDescription>
          </SheetHeader>
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
            <SheetDescription>Your cart is currently empty.</SheetDescription>
          </SheetHeader>
          <div className="flex items-center justify-center h-[50vh]">
            <p className="text-muted-foreground">No items in cart</p>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {items.length} item{items.length !== 1 ? "s" : ""} in your cart
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-md">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)}
                  </p>
                  {item.discountPercentage > 0 && (
                    <p className="text-xs text-green-600">
                      {item.discountPercentage.toFixed(0)}% off
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>

                  <Badge className="w-8 h-8 rounded-md flex items-center justify-center">
                    {item.quantity}
                  </Badge>

                  <Button
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>

                  <Button
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <Separator />

          <div className="flex items-center justify-between text-lg font-semibold px-4">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <div className="space-y-2 px-4 pb-4">
            <Button className="w-full" size="lg">
              Checkout
            </Button>
            <Button className="w-full" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}