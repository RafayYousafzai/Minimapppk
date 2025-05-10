"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { CartItem } from '@/lib/types';
import { useCart } from '@/hooks/useCart';
import QuantitySelector from '@/components/products/QuantitySelector';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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
    <div className="flex items-start gap-4 p-4 border rounded-lg shadow-sm bg-card">
      <Link href={`/products/${item.productId}`}>
        <Image
          src={item.image}
          alt={item.name}
          width={100}
          height={100}
          className="rounded-md object-cover aspect-square"
          data-ai-hint="product cart item"
        />
      </Link>
      <div className="flex-grow">
        <Link href={`/products/${item.productId}`}>
          <h3 className="text-lg font-semibold hover:text-primary transition-colors">{item.name}</h3>
        </Link>
        {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
          <p className="text-sm text-muted-foreground">
            {Object.entries(item.selectedVariants)
              .map(([type, value]) => `${type}: ${value}`)
              .join(', ')}
          </p>
        )}
        <p className="text-md font-medium text-primary mt-1">${item.price.toFixed(2)}</p>
        <div className="mt-2">
          <QuantitySelector
            quantity={item.quantity}
            onQuantityChange={(newQuantity) => updateQuantity(item.id, newQuantity)}
            maxQuantity={item.availableStock} // Use availableStock from CartItem
          />
        </div>
      </div>
      <div className="flex flex-col items-end justify-between h-full">
        <p className="text-lg font-semibold">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          className="text-muted-foreground hover:text-destructive"
          aria-label="Remove item from cart"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default CartItemCard;
