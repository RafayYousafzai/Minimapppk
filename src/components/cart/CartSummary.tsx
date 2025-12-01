"use client";

import type React from "react";

import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Truck, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const CartSummary: React.FC = () => {
  const { getTotalPrice, getItemCount } = useCart();

  const totalItems = getItemCount();
  const subtotal = getTotalPrice();
  const shipping = totalItems > 0 ? (subtotal > 2000 ? 0 : 250.0) : 0;
  const taxes = totalItems > 0 ? subtotal * 0.0 : 0;
  const total = subtotal + shipping + taxes;

  const savings = subtotal > 2000 ? 250 : 0;

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 rounded-[2rem] p-8">
        <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-primary" />
          </div>
          Order Summary
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-muted-foreground">
            <span>Subtotal ({totalItems} items)</span>
            <span className="font-medium text-foreground">
              ₨{subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center text-muted-foreground">
            <span className="flex items-center gap-2">
              Shipping
              {subtotal > 2000 && (
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                >
                  FREE
                </Badge>
              )}
            </span>
            <span className="font-medium text-foreground">
              {shipping > 0
                ? `₨${shipping.toFixed(2)}`
                : subtotal > 2000
                ? "Free"
                : "Calculated at checkout"}
            </span>
          </div>

          {savings > 0 && (
            <div className="flex justify-between items-center text-green-600 bg-green-50 dark:bg-green-900/10 p-3 rounded-xl">
              <span className="font-medium text-sm">Total Savings</span>
              <span className="font-bold">-₨{savings.toFixed(2)}</span>
            </div>
          )}

          {taxes > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Estimated Taxes</span>
              <span className="font-semibold text-foreground">
                ₨{taxes.toFixed(2)}
              </span>
            </div>
          )}

          <div className="h-px bg-border/50 my-6" />

          <div className="flex justify-between items-end">
            <span className="text-lg font-semibold text-muted-foreground">
              Total
            </span>
            <span className="text-4xl font-bold text-foreground">
              ₨{total.toFixed(2)}
            </span>
          </div>

          {subtotal < 2000 && subtotal > 0 && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl text-sm text-blue-700 dark:text-blue-300 flex items-start gap-3">
              <Truck className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>
                Add <strong>₨{(2000 - subtotal).toFixed(2)}</strong> more to
                unlock <span className="font-bold">FREE Shipping</span>!
              </p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <Button
            size="lg"
            className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
            disabled={totalItems === 0}
            asChild
          >
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <ShieldCheck className="w-4 h-4" />
        Secure checkout guaranteed
      </div>
    </div>
  );
};

export default CartSummary;
