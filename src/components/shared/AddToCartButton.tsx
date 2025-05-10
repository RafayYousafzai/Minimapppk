"use client";

import React, { useState } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import type { Product } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

interface AddToCartButtonProps extends ButtonProps {
  product: Product;
  quantity: number;
  selectedVariants?: { [key: string]: string };
  children?: React.ReactNode;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity,
  selectedVariants,
  children,
  className,
  variant = "default",
  ...props
}) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    // Basic validation for variants
    if (product.variants && product.variants.length > 0) {
      if (!selectedVariants || product.variants.some(v => !selectedVariants[v.type])) {
        toast({
          title: "Selection Incomplete",
          description: `Please select all options for ${product.name}.`,
          variant: "destructive",
        });
        return;
      }
    }
    
    addToCart(product, quantity, selectedVariants);
    toast({
      title: "Added to Cart!",
      description: `${product.name} ${selectedVariants ? `(${Object.values(selectedVariants).join(', ')})` : ''} has been added to your cart.`,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000); // Reset icon after 2 seconds
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={product.stock === 0 || isAdded}
      variant={variant}
      className={cn("gap-2", className)}
      {...props}
    >
      {isAdded ? <CheckCircle /> : <ShoppingCart />}
      {children ? children : (isAdded ? 'Added!' : (product.stock === 0 ? 'Out of Stock' : 'Add to Cart'))}
    </Button>
  );
};

export default AddToCartButton;
