
"use client";

import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link'; // Import Link

const CartSummary: React.FC = () => {
  const { getTotalPrice, getItemCount } = useCart();

  const totalItems = getItemCount();
  const subtotal = getTotalPrice();
  // Example fees, adjust as needed or calculate dynamically
  const shipping = totalItems > 0 ? 250.00 : 0; 
  const taxes = totalItems > 0 ? subtotal * 0.00 : 0; // Assuming 0 tax for now, or use region-specific logic
  const total = subtotal + shipping + taxes;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal ({totalItems} items)</span>
          <span>₨{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping > 0 ? `₨${shipping.toFixed(2)}` : 'Calculated at next step'}</span>
        </div>
        {taxes > 0 && (
          <div className="flex justify-between">
            <span>Estimated Taxes</span>
            <span>₨{taxes.toFixed(2)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₨{total.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          size="lg" 
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          disabled={totalItems === 0}
          asChild // Use asChild to make Button behave like Link
        >
          <Link href="/checkout">
            <ShoppingBag className="mr-2 h-5 w-5" /> Proceed to Checkout
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CartSummary;
