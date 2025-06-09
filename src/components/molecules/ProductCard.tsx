"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Plus } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product);
    console.log('add to cart');
    
    toast.success("Product has been added.", {
      description: `${product.title} added to your cart`,
    });
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader className="p-4">
        <div className="aspect-square relative mb-4 overflow-hidden rounded-md">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardTitle className="line-clamp-2 text-base">
          {product.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 p-4 pt-0">
        <div className="flex items-center justify-between mb-2">
          <Badge className="capitalize">{product.category}</Badge>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-muted-foreground">
              {product.rating.toFixed(1)} ({product.stock} in stock)
            </span>
          </div>
        </div>
        
        {product.discountPercentage > 0 && (
          <div className="flex items-center space-x-2 mb-2">
            <Badge className="text-xs">
              -{product.discountPercentage.toFixed(0)}% OFF
            </Badge>
            <span className="text-sm text-muted-foreground line-through">
              ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <span className="text-2xl font-bold">
            ${product.price.toFixed(2)}
          </span>
          <Button onClick={handleAddToCart} size="sm" disabled={product.stock === 0}>
            <Plus className="h-4 w-4 mr-1" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}