// components/molecules/ProductCard.tsx
"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void; // Optional click handler for opening details
}

export function ProductCard({ product, onProductClick }: ProductCardProps) {

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  return (
    <Card 
      className={`flex flex-col h-full hover:shadow-lg transition-shadow ${
        onProductClick ? 'cursor-pointer' : ''
      }`}
      onClick={handleCardClick}
    >
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
        </div>
      </CardFooter>
    </Card>
  );
}