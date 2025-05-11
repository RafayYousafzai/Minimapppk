
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function OrderConfirmationPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader>
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold">Order Confirmed!</CardTitle>
          <CardDescription className="text-muted-foreground text-lg pt-2">
            Thank you for your purchase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Your order has been placed successfully. You will receive an email confirmation shortly with your order details.
          </p>
          <p className="text-sm text-muted-foreground">
            For any queries, please contact our support team.
          </p>
          <Button size="lg" className="w-full bg-primary hover:bg-primary/90" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Go to Homepage</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
