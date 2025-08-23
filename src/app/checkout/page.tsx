
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutFormSchema, type CheckoutFormData } from "@/lib/checkoutTypes";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import BillingDetailsForm from "@/components/checkout/BillingDetailsForm";
import ShippingDetailsForm from "@/components/checkout/ShippingDetailsForm";
import OrderSummaryCard from "@/components/checkout/OrderSummaryCard";
import {
  ShoppingCart,
  Heart,
  Sparkles,
  Package,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CheckoutPage() {
  const { cartItems, clearCart, getItemCount, getTotalPrice } = useCart();
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
      agreeToTerms: false,
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
    const orderTotal = getTotalPrice() + (getItemCount() > 0 ? 250.0 : 0);
    
    const orderData = {
      ...data,
      cartItems: cartItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        selectedVariants: item.selectedVariants || null,
        image: item.image,
      })),
      orderTotal: orderTotal,
      orderStatus: "pending payment",
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "orders"), orderData);
      const orderId = docRef.id;
      console.log("Order placed with ID: ", orderId);

      toast({
        title: "Order Placed! Redirecting...",
        description: `Your order #${orderId.substring(0,8)} is confirmed. Redirecting to WhatsApp for payment.`,
        variant: "default",
      });

      // Construct WhatsApp message
      const WHATSAPP_NUMBER = "923289462807"; // Your number in international format without + or 00
      let message = `Hello! I've just placed an order on Minimapppk.\n\n*Order ID:* ${orderId}\n\n*Order Summary:*\n`;
      cartItems.forEach(item => {
        const variantString = item.selectedVariants ? ` (${Object.values(item.selectedVariants).join(', ')})` : '';
        message += `- ${item.name}${variantString} (x${item.quantity}) - ₨${(item.price * item.quantity).toFixed(2)}\n`;
      });
      message += `\n*Total Amount:* ₨${orderTotal.toFixed(2)}\n\n`;
      message += `Please provide me with the payment details (Bank Account or JazzCash). I will send a screenshot after payment to confirm my order. Thank you!`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      
      clearCart();

      // Redirect to WhatsApp
      window.location.href = whatsappUrl;

    } catch (error) {
      console.error("Error placing order: ", error);
      toast({
        title: "Error Placing Order 😔",
        description:
          "There was an issue processing your order. Please try again.",
        variant: "destructive",
      });
       setIsSubmitting(false);
    }
  }

  if (getItemCount() === 0 && !isSubmitting) {
    return (
      <div className="px-4 min-h-screen bg-background flex items-center justify-center">
        <div className="text-center py-12 max-w-md mx-auto">
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ShoppingCart className="h-16 w-16 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            Your Cart is Empty! 🛒
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Looks like you haven't added any amazing products to your cart yet.
            Let's fix that! ✨
          </p>

          <Link href="/products">
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Heart className="mr-2 h-5 w-5 fill-primary-foreground" />
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-secondary rounded-full px-8 py-4 mb-6">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            You're almost there! Just a few more details and your amazing
            products will be on their way to you! 🚚💕
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid lg:grid-cols-3 gap-8 items-start"
          >
            <div className="lg:col-span-2 space-y-8">
              <BillingDetailsForm form={form} />

              {/* Ship to Different Address */}
              <div className="bg-card border rounded-lg p-6 shadow-sm">
                <FormField
                  control={form.control}
                  name="shipToDifferentAddress"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-4 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value || false}
                          onCheckedChange={field.onChange}
                          className="mt-1"
                        />
                      </FormControl>
                      <div className="space-y-2 leading-none flex-1">
                        <FormLabel className="cursor-pointer text-base font-semibold text-foreground flex items-center gap-2">
                          <Package className="w-5 h-5 text-primary" />
                          Ship to a different address?
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Check this if you want your order delivered to a
                          different address than your billing address.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {watchShipToDifferentAddress && (
                <ShippingDetailsForm form={form} />
              )}

              {/* Order Notes */}
              <div className="bg-card border rounded-lg p-6 shadow-sm">
                <FormField
                  control={form.control}
                  name="orderNotes"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Heart className="w-5 h-5 text-primary fill-primary" />
                        Order Notes (optional)
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Any special instructions for your order? We're here to
                        make your experience perfect! ✨
                      </p>
                      <FormControl>
                        <Textarea
                          placeholder="Notes about your order, e.g. special notes for delivery, gift wrapping requests, or any other special instructions... 💝"
                          className="resize-none min-h-[120px]"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="lg:col-span-1 lg:sticky lg:top-24">
              <OrderSummaryCard form={form} isSubmitting={isSubmitting} />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
