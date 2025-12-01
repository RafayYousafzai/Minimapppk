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
      const shortOrderId = orderId.substring(0, 8).toUpperCase();
      console.log("Order placed with ID: ", orderId);

      toast({
        title: "Order Placed! Redirecting...",
        description: `Your order #${orderId} is confirmed. Redirecting to WhatsApp for payment.`,
        variant: "default",
      });

      // Construct WhatsApp message
      const WHATSAPP_NUMBER = "923245699838"; // Your number in international format without + or 00
      const baseUrl = window.location.origin;
      const adminOrderUrl = `${baseUrl}/admin/orders/${orderId}`;

      let message = `Hello! I've just placed an order on Minimapppk.\n\n*Order ID:* ${orderId}\n\n*Order Summary:*\n`;
      cartItems.forEach((item) => {
        const variantString = item.selectedVariants
          ? ` (${Object.values(item.selectedVariants).join(", ")})`
          : "";
        message += `- ${item.name}${variantString} (x${item.quantity}) - ₨${(
          item.price * item.quantity
        ).toFixed(2)}\n`;
      });
      message += `\n*Total Amount:* ₨${orderTotal.toFixed(2)}\n\n`;
      message += `Please provide me with the payment details (Bank Account or JazzCash). I will send a screenshot after payment to confirm my order. Thank you!\n\n`;
      message += `-------------------\n`;
      message += `*For Admin:*\n`;
      message += `View Order Details: ${adminOrderUrl}`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        message
      )}`;

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
      <div className="px-4 min-h-[80vh] bg-background flex items-center justify-center">
        <div className="text-center py-12 max-w-md mx-auto space-y-8">
          <div className="relative">
            <div className="w-40 h-40 bg-muted/30 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <ShoppingCart className="h-20 w-20 text-muted-foreground/50" />
            </div>
            <div className="absolute bottom-0 right-1/2 translate-x-12 translate-y-2 bg-background p-2 rounded-full shadow-lg">
              <Sparkles className="h-8 w-8 text-yellow-400 fill-yellow-400" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground tracking-tight">
              Your Cart is Empty
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Looks like you haven't added any items yet.
              <br />
              Discover our amazing collection today!
            </p>
          </div>

          <Link href="/products" className="inline-block">
            <Button
              size="lg"
              className="h-14 px-10 text-lg font-semibold rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1"
            >
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Checkout
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span className="w-12 h-1 bg-primary/20 rounded-full"></span>
            <p className="text-lg font-medium">Almost there!</p>
            <span className="w-12 h-1 bg-primary/20 rounded-full"></span>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          >
            <div className="lg:col-span-7 xl:col-span-8 space-y-10">
              <div className="bg-muted/30 rounded-[2rem] p-6 sm:p-10 space-y-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    1
                  </div>
                  <h2 className="text-2xl font-bold">Billing Details</h2>
                </div>
                <BillingDetailsForm form={form} />
              </div>

              {/* Ship to Different Address */}
              <div className="bg-muted/30 rounded-[2rem] p-6 sm:p-10">
                <FormField
                  control={form.control}
                  name="shipToDifferentAddress"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-4 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value || false}
                          onCheckedChange={field.onChange}
                          className="mt-1 w-5 h-5 rounded-md border-2"
                        />
                      </FormControl>
                      <div className="space-y-2 leading-none flex-1">
                        <FormLabel className="cursor-pointer text-lg font-semibold text-foreground flex items-center gap-2">
                          Ship to a different address?
                        </FormLabel>
                        <p className="text-muted-foreground">
                          Select this if you want your order delivered to a
                          different address.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {watchShipToDifferentAddress && (
                <div className="bg-muted/30 rounded-[2rem] p-6 sm:p-10 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      2
                    </div>
                    <h2 className="text-2xl font-bold">Shipping Details</h2>
                  </div>
                  <ShippingDetailsForm form={form} />
                </div>
              )}

              {/* Order Notes */}
              <div className="bg-muted/30 rounded-[2rem] p-6 sm:p-10">
                <FormField
                  control={form.control}
                  name="orderNotes"
                  render={({ field }) => (
                    <FormItem className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                          {watchShipToDifferentAddress ? "3" : "2"}
                        </div>
                        <div>
                          <FormLabel className="text-2xl font-bold text-foreground block">
                            Order Notes
                          </FormLabel>
                          <p className="text-muted-foreground mt-1">
                            Optional special instructions for delivery
                          </p>
                        </div>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="e.g. Special notes for delivery, gift wrapping requests..."
                          className="resize-none min-h-[150px] bg-background border-transparent focus:border-primary rounded-xl p-4 text-base shadow-sm transition-all"
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

            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
              <OrderSummaryCard form={form} isSubmitting={isSubmitting} />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
