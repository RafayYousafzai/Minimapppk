"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartItem } from "@/lib/types";
import { useCart } from "@/hooks/useCart";
import QuantitySelector from "@/components/products/QuantitySelector";
import { Button } from "@/components/ui/button";
import { X, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface CartItemCardProps {
  item: CartItem;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();
  const { toast } = useToast();

  const handleRemove = () => {
    removeFromCart(item.id);
    toast({
      title: "Item Removed",
      description: `${item.name} has been removed from your cart.`,
    });
  };

  return (
    <div className="group relative bg-muted/30 hover:bg-muted/50 rounded-3xl p-4 sm:p-6 transition-all duration-300">
      <div className="flex gap-6">
        {/* Product Image */}
        <Link href={`/products/${item.productId}`} className="flex-shrink-0">
          <div className="relative h-24 w-24 sm:h-32 sm:w-32 overflow-hidden rounded-2xl bg-white shadow-sm">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              data-ai-hint="product cart item"
            />
            {item.availableStock < 5 && (
              <div className="absolute top-2 right-2">
                <Badge
                  variant="destructive"
                  className="text-[10px] px-2 py-0.5 h-5 shadow-sm"
                >
                  Low Stock
                </Badge>
              </div>
            )}
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex-grow min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-4">
              <Link href={`/products/${item.productId}`}>
                <h3 className="text-lg sm:text-xl font-bold text-foreground hover:text-primary transition-colors line-clamp-2 leading-tight">
                  {item.name}
                </h3>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 -mt-2 -mr-2 rounded-full transition-all"
                aria-label="Remove item"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Variants */}
            {item.selectedVariants &&
              Object.keys(item.selectedVariants).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(item.selectedVariants).map(
                    ([type, value]) => (
                      <Badge
                        key={type}
                        variant="secondary"
                        className="text-xs font-normal bg-background/50 text-muted-foreground hover:bg-background transition-colors"
                      >
                        {type}: {value}
                      </Badge>
                    )
                  )}
                </div>
              )}
          </div>

          {/* Price and Quantity */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-4">
            <div className="flex items-center gap-4">
              <QuantitySelector
                quantity={item.quantity}
                onQuantityChange={(newQuantity) =>
                  updateQuantity(item.id, newQuantity)
                }
                maxQuantity={item.availableStock}
                className="h-10 bg-background shadow-sm border-transparent"
              />
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  ₨{item.price.toFixed(2)}
                </span>{" "}
                / each
              </div>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                ₨{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
