"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Plus, Minus, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

interface ProductDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDialog({ product, isOpen, onClose }: ProductDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  if (!product) return null;

  const handleAddToCart = () => {
    // Add the specified quantity to cart
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    
    toast.success("Added to cart!", {
      description: `${quantity} x ${product.title} added to your cart`,
    });
    
    // Reset quantity and close dialog
    setQuantity(1);
    onClose();
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const discountedPrice = product.price;
  const originalPrice = product.discountPercentage > 0 
    ? product.price / (1 - product.discountPercentage / 100)
    : product.price;

  // Use the main thumbnail if no additional images, otherwise use images array
  const displayImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.thumbnail];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left">{product.title}</DialogTitle>
          <DialogDescription className="text-left">
            {product.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Image Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative overflow-hidden rounded-lg border-2 border-border">
              <Image
                src={displayImages[selectedImageIndex]}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Thumbnail Images */}
            {displayImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 relative overflow-hidden rounded-md border-2 transition-colors ${
                      selectedImageIndex === index 
                        ? "border-primary" 
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            {/* Category and Rating */}
            <div className="flex items-center justify-between">
              <Badge className="capitalize">{product.category}</Badge>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">rating</span>
              </div>
            </div>

            <Separator />

            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold">${discountedPrice.toFixed(2)}</span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      -{product.discountPercentage.toFixed(0)}% OFF
                    </Badge>
                  </>
                )}
              </div>
              
              {product.discountPercentage > 0 && (
                <p className="text-sm text-green-600">
                  You save ${(originalPrice - discountedPrice).toFixed(2)}
                </p>
              )}
            </div>

            <Separator />

            {/* Stock Information */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Availability:</span>
                <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
              
              {product.brand && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Brand:</span>
                  <span className="text-sm capitalize">{product.brand}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="icon"
                      variant="neutral"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="h-8 w-8"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    
                    <Button
                      size="icon"
                      variant="neutral"
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="h-8 w-8"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Total:</span>
                  <span className="text-xl font-bold">
                    ${(discountedPrice * quantity).toFixed(2)}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <Button 
                  onClick={handleAddToCart}
                  size="lg" 
                  className="w-full"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add {quantity} to Cart
                </Button>
              </div>
            )}

            {product.stock === 0 && (
              <Button size="lg" className="w-full" disabled>
                Out of Stock
              </Button>
            )}

            {/* Product Description */}
            <div className="space-y-2">
              <h4 className="font-medium">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}