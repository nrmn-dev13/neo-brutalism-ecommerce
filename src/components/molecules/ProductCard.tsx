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
import { Star, Plus, Eye } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

export function ProductCard({ product, onProductClick }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    addItem(product);

    toast.success("Product has been added.", {
      description: `${product.title} added to your cart`,
    });
  };

  const handleCardClick = () => {
    onProductClick(product);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    onProductClick(product);
  };

  return (
    <Card
      className="flex flex-col h-full hover:shadow-lg transition-all cursor-pointer group hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      <CardHeader className="p-4">
        <div className="aspect-square relative mb-4 overflow-hidden rounded-md">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Quick View Button - Shows on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              size="sm"
              variant="neutral"
              onClick={handleViewDetails}
              className="bg-white/90 text-black hover:bg-white"
            >
              <Eye className="h-4 w-4 mr-1" />
              Quick View
            </Button>
          </div>
        </div>

        <CardTitle className="line-clamp-2 text-base group-hover:text-primary transition-colors">
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
            <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
              -{product.discountPercentage.toFixed(0)}% OFF
            </Badge>
            <span className="text-sm text-muted-foreground line-through">
              $
              {(product.price / (1 - product.discountPercentage / 100)).toFixed(
                2
              )}
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
