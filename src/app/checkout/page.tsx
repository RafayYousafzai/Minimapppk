
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutFormSchema, type CheckoutFormData } from "@/lib/checkoutTypes";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import BillingDetailsForm from "@/components/checkout/BillingDetailsForm";
import ShippingDetailsForm from "@/components/checkout/ShippingDetailsForm";
import OrderSummaryCard from "@/components/checkout/OrderSummaryCard";
import { AlertCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export default function CheckoutPage() {
  const { cartItems, clearCart, getItemCount } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      billingCountry: "PK",
      billingState: "Sindh",
      shippingCountry: "PK",
      shippingState: "Sindh",
      shipToDifferentAddress: false,
      paymentMethod: "cod",
      agreeToTerms: false,
      // Explicitly set optionals to undefined or empty strings if needed
      billingCompanyName: "",
      billingStreetAddress2: "",
      shippingFirstName: "",
      shippingLastName: "",
      shippingCompanyName: "",
      shippingStreetAddress1: "",
      shippingStreetAddress2: "",
      shippingCity: "",
      shippingPostcode: "",
      orderNotes: "",
    },
  });

  const watchShipToDifferentAddress = form.watch("shipToDifferentAddress");

  async function onSubmit(data: CheckoutFormData) {
    setIsSubmitting(true);
    // In a real application, you would send this data to your backend to process the order.
    // For now, we'll simulate an order placement.
    console.log("Checkout Data:", data);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Order Placed Successfully!",
      description: "Thank you for your purchase. Your order details have been recorded.",
      variant: "default", 
    });
    clearCart();
    router.push("/order-confirmation"); // Redirect to an order confirmation page (to be created)
    setIsSubmitting(false);
  }

  if (getItemCount() === 0 && !isSubmitting) { // Don't show if submitting (already past this check)
    return (
      <div className="text-center py-12">
        <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-semibold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">
          You need to add items to your cart before proceeding to checkout.
        </p>
        <Link href="/products" passHref>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">Start Shopping</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <BillingDetailsForm form={form} />

            <FormField
              control={form.control}
              name="shipToDifferentAddress"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer">
                      Ship to a different address?
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {watchShipToDifferentAddress && (
              <ShippingDetailsForm form={form} />
            )}

            <FormField
              control={form.control}
              name="orderNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notes about your order, e.g. special notes for delivery."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <OrderSummaryCard form={form} isSubmitting={isSubmitting} />
          </div>
        </form>
      </Form>
    </div>
  );
}
