"use client";

import type React from "react";
import type { UseFormReturn } from "react-hook-form";
import type { CheckoutFormData } from "@/lib/checkoutTypes";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ShoppingBag,
  CreditCard,
  Truck,
  Shield,
  Heart,
  Sparkles,
  Package,
  Loader2,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

interface OrderSummaryCardProps {
  form: UseFormReturn<CheckoutFormData>;
  isSubmitting: boolean;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  form,
  isSubmitting,
}) => {
  const { cartItems, getTotalPrice, getItemCount } = useCart();

  const subtotal = getTotalPrice();
  const shippingCharges = getItemCount() > 0 ? 250.0 : 0;
  const total = subtotal + shippingCharges;

  return (
    <div className="bg-muted/30 rounded-[2rem] p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          Your Order
        </h2>
        <p className="text-muted-foreground ml-14">
          Review your amazing selections! ✨
        </p>
      </div>

      <div className="space-y-6">
        {cartItems.length > 0 ? (
          <>
            {/* Order Items */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Order Items</h3>
              </div>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-4 bg-background rounded-2xl shadow-sm"
                  >
                    <div className="flex-1">
                      <span className="font-medium text-foreground block mb-1">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="bg-muted px-2 py-0.5 rounded-md text-xs font-medium">
                          Qty: {item.quantity}
                        </span>
                        <span>•</span>
                        <span>₨{item.price.toFixed(2)} each</span>
                      </div>
                    </div>
                    <span className="font-bold text-foreground">
                      ₨{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-background p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-foreground">
                  ₨{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Shipping</span>
                </div>
                <span className="font-semibold text-foreground">
                  {shippingCharges > 0
                    ? `₨${shippingCharges.toFixed(2)}`
                    : "Free! 🎉"}
                </span>
              </div>
              <div className="h-px bg-border/50"></div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-bold text-primary text-2xl">
                  ₨{total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">
                  Payment via WhatsApp
                </h3>
              </div>
              <p className="text-sm text-green-700 leading-relaxed">
                After confirming your order, you will be redirected to WhatsApp
                to complete your payment with one of our agents.
              </p>
            </div>

            {/* Privacy Notice */}
            <div className="bg-background p-4 rounded-2xl shadow-sm">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your personal data will be used to process your order, support
                  your experience throughout this website, and for other
                  purposes described in our{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-primary hover:underline font-medium"
                  >
                    privacy policy
                  </Link>
                  . We keep your information safe and secure! 🔒
                </p>
              </div>
            </div>

            {/* Terms Agreement */}
            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="bg-background rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none flex-1">
                      <FormLabel className="cursor-pointer text-sm text-muted-foreground leading-relaxed">
                        I have read and agree to the website{" "}
                        <Link
                          href="/terms-and-conditions"
                          className="text-primary hover:underline font-medium"
                        >
                          terms and conditions
                        </Link>{" "}
                        *
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </>
        ) : (
          <div className="text-center py-12 bg-background rounded-3xl shadow-sm">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground">
              Your cart is empty! 🛒
            </p>
            <p className="text-muted-foreground mt-2">
              Add some amazing products to get started!
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-border/50">
        <Button
          type="submit"
          size="lg"
          className="w-full rounded-xl py-7 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          disabled={cartItems.length === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Placing Your Order...
              <Heart className="w-4 h-4 fill-primary-foreground animate-pulse" />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 fill-primary-foreground" />
              Confirm Order & Pay
              <MessageSquare className="w-5 h-5" />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
