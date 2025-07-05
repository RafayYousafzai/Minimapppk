
"use client";

import { useCart } from "@/hooks/useCart";
import CartItemCard from "@/components/cart/CartItemCard";
import CartSummary from "@/components/cart/CartSummary";
import RecommendedProducts from "@/components/cart/RecommendedProducts";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingCart, Sparkles, Trash2 } from "lucide-react";

export default function CartPage() {
  const { cartItems, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="mx-auto w-32 h-32 bg-secondary rounded-full flex items-center justify-center mb-8">
              <ShoppingCart className="w-16 h-16 text-muted-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Discover amazing products and start building your perfect
              collection.
            </p>
            <Link href="/products" passHref>
              <Button
                size="lg"
                className="h-14 px-8 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Sparkles className="mr-2 h-6 w-6" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Shopping Cart</h1>
            <p className="text-lg text-muted-foreground mt-2">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <Button
            onClick={clearCart}
            disabled={cartItems.length === 0}
            variant="outline"
          >
            <Trash2 className="mr-2 h-5 w-5" />
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>

          <div className="lg:col-span-1 lg:sticky lg:top-8">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
