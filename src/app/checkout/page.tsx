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
      paymentMethod: "cod",
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
      orderTotal: getTotalPrice() + (getItemCount() > 0 ? 250.0 : 0),
      orderStatus: "pending",
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "orders"), orderData);
      console.log("Order placed with ID: ", docRef.id);

      toast({
        title: "Order Placed Successfully! 🎉",
        description: `Thank you for your purchase! Your order ID is ${docRef.id}. ✨`,
        variant: "default",
      });
      clearCart();
      router.push("/order-confirmation");
    } catch (error) {
      console.error("Error placing order: ", error);
      toast({
        title: "Error Placing Order 😔",
        description:
          "There was an issue processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (getItemCount() === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center py-12 max-w-md mx-auto">
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ShoppingCart className="h-16 w-16 text-purple-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Your Cart is Empty! 🛒
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Looks like you haven't added any amazing products to your cart yet.
            Let's fix that! ✨
          </p>

          <Link href="/products">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Heart className="mr-2 h-5 w-5 fill-white" />
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  ">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-8 py-4 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
            <Sparkles className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
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
              <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-100 rounded-2xl p-6 shadow-lg">
                <FormField
                  control={form.control}
                  name="shipToDifferentAddress"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-4 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value || false}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 mt-1"
                        />
                      </FormControl>
                      <div className="space-y-2 leading-none flex-1">
                        <FormLabel className="cursor-pointer text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <Package className="w-5 h-5 text-purple-500" />
                          Ship to a different address?
                        </FormLabel>
                        <p className="text-sm text-gray-600">
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
              <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-100 rounded-2xl p-6 shadow-lg">
                <FormField
                  control={form.control}
                  name="orderNotes"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-purple-500 fill-purple-500" />
                        Order Notes (optional)
                      </FormLabel>
                      <p className="text-sm text-gray-600">
                        Any special instructions for your order? We're here to
                        make your experience perfect! ✨
                      </p>
                      <FormControl>
                        <Textarea
                          placeholder="Notes about your order, e.g. special notes for delivery, gift wrapping requests, or any other special instructions... 💝"
                          className="resize-none border-2 border-purple-200 focus:border-purple-400 rounded-xl min-h-[120px] text-lg transition-all duration-300 hover:border-purple-300"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage className="text-pink-500" />
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
