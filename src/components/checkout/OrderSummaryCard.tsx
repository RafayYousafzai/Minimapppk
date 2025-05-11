
"use client";

import type { UseFormReturn } from "react-hook-form";
import type { CheckoutFormData } from "@/lib/checkoutTypes";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Link from "next/link";

interface OrderSummaryCardProps {
  form: UseFormReturn<CheckoutFormData>;
  isSubmitting: boolean;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ form, isSubmitting }) => {
  const { cartItems, getTotalPrice, getItemCount } = useCart();

  const subtotal = getTotalPrice();
  const shippingCharges = getItemCount() > 0 ? 250.00 : 0; // Example shipping cost
  const total = subtotal + shippingCharges;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Your order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cartItems.length > 0 ? (
          <>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span>
                    {item.name} <span className="text-muted-foreground">× {item.quantity}</span>
                  </span>
                  <span>₨{item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Subtotal</span>
              <span>₨{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {shippingCharges > 0 ? `Shipping Charges: ₨${shippingCharges.toFixed(2)}` : 'Free Shipping'}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₨{total.toFixed(2)}</span>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground">Your cart is empty.</p>
        )}

        {cartItems.length > 0 && (
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-3 mt-6">
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1 bg-muted p-4 rounded-md"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="cod" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Cash on delivery
                      <p className="text-xs text-muted-foreground">Pay with cash upon delivery.</p>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <p className="text-xs text-muted-foreground mt-4">
          Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <Link href="/privacy-policy" className="text-primary hover:underline">privacy policy</Link>.
        </p>

        <FormField
          control={form.control}
          name="agreeToTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="cursor-pointer">
                  I have read and agree to the website <Link href="/terms-and-conditions" className="text-primary hover:underline">terms and conditions</Link> *
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          size="lg"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          disabled={cartItems.length === 0 || isSubmitting}
        >
          {isSubmitting ? 'Placing Order...' : 'Place order'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderSummaryCard;
