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
import {
  ShoppingBagIcon,
  TruckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
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
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBagIcon className="w-6 h-6 text-[#9b78e8]" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Subtotal ({totalItems} items)</span>
            <span className="font-semibold text-gray-900">
              ₨{subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TruckIcon className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">Shipping</span>
            </div>
            <div className="text-right">
              {shipping > 0 ? (
                <span className="font-semibold text-gray-900">
                  ₨{shipping.toFixed(2)}
                </span>
              ) : subtotal > 2000 ? (
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    FREE
                  </Badge>
                </div>
              ) : (
                <span className="text-sm text-gray-500">
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
              <span className="text-gray-700">Estimated Taxes</span>
              <span className="font-semibold text-gray-900">
                ₨{taxes.toFixed(2)}
              </span>
            </div>
          )}

          <Separator className="my-4" />

          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-[#9b78e8]">
              ₨{total.toFixed(2)}
            </span>
          </div>

          {subtotal < 2000 && subtotal > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <TruckIcon className="w-4 h-4 inline mr-1" />
                Add ₨{(2000 - subtotal).toFixed(2)} more for FREE shipping!
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-6">
          <Button
            size="lg"
            className="w-full h-14 text-lg font-semibold  bg-[#9b78e8]   rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={totalItems === 0}
            asChild
          >
            <Link href="/checkout">
              <ShoppingBagIcon className="mr-2 h-6 w-6" />
              Proceed to Checkout
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Trust Indicators */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
          <ShieldCheckIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="text-sm font-medium text-green-800">
            Secure checkout guaranteed
          </span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
          <TruckIcon className="w-5 h-5 text-[#9b78e8] flex-shrink-0" />
          <span className="text-sm font-medium text-blue-800">
            Free returns within 30 days
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
