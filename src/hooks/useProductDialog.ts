// hooks/useProductDialog.ts
import { useState } from "react";
import { Product } from "@/types";

export function useProductDialog() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  return {
    selectedProduct,
    isDialogOpen,
    openDialog,
    closeDialog
  };
}