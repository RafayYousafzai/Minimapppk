
"use client";

import type React from "react";

import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
      <Card className="shadow-lg border bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-card-foreground flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
            <span className="font-semibold text-foreground">
              ₨{subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Shipping</span>
            </div>
            <div className="text-right">
              {shipping > 0 ? (
                <span className="font-semibold text-foreground">
                  ₨{shipping.toFixed(2)}
                </span>
              ) : subtotal > 2000 ? (
                <Badge variant="secondary">
                    FREE
                </Badge>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Calculated at checkout
                </span>
              )}
            </div>
          </div>

          {savings > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span className="font-medium">You saved</span>
              <span className="font-semibold">-₨{savings.toFixed(2)}</span>
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

          <Separator className="my-4" />

          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-foreground">Total</span>
            <span className="text-2xl font-bold text-foreground">
              ₨{total.toFixed(2)}
            </span>
          </div>

          {subtotal < 2000 && subtotal > 0 && (
            <div className="bg-secondary border rounded-xl p-4">
              <p className="text-sm text-secondary-foreground">
                <Truck className="w-4 h-4 inline mr-1" />
                Add ₨{(2000 - subtotal).toFixed(2)} more for FREE shipping!
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-6">
          <Button
            size="lg"
            className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={totalItems === 0}
            asChild
          >
            <Link href="/checkout">
              <ShoppingBag className="mr-2 h-6 w-6" />
              Proceed to Checkout
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Trust Indicators */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl border">
          <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="text-sm font-medium text-secondary-foreground">
            Secure checkout guaranteed
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
