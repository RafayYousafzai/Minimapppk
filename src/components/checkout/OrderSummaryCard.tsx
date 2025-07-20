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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
    <Card className="bg-card border rounded-lg shadow-sm">
      {/* Header */}
      <CardHeader className="bg-primary text-primary-foreground p-6 rounded-lg">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          Your Order
          <Sparkles className="w-5 h-5 ml-auto" />
        </CardTitle>
        <p className="text-primary-foreground/80 text-sm">
          Review your amazing selections! ✨
        </p>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
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
                    className="flex justify-between items-center p-3 bg-secondary rounded-lg border"
                  >
                    <div className="flex-1">
                      <span className="font-medium text-foreground">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Qty: {item.quantity}</span>
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
            <div className="bg-secondary p-4 rounded-lg border">
              <div className="space-y-3">
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
                <div className="h-px bg-border"></div>
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-bold text-primary text-xl">
                    ₨{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">
                  Payment Method
                </h3>
              </div>
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0 p-4 bg-secondary rounded-lg border hover:border-primary/50 transition-colors">
                        <FormControl>
                          <RadioGroupItem value="cod" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-foreground">
                              Cash on Delivery
                            </span>
                            <span className="text-2xl">💰</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Pay with cash when your order arrives safely! 📦
                          </p>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Privacy Notice */}
            <div className="bg-secondary p-4 rounded-lg border">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
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
                <FormItem className="bg-card border rounded-lg p-4">
                  <div className="flex items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1"
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
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Your cart is empty! 🛒</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add some amazing products to get started!
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 bg-secondary border-t">
        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
              Place Order
              <Sparkles className="w-5 h-5" />
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderSummaryCard;
