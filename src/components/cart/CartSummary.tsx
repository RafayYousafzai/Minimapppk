"use client";

import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag } from 'lucide-react';

const CartSummary: React.FC = () => {
  const { getTotalPrice, getItemCount, clearCart } = useCart();
  const { toast } = useToast();

  const totalItems = getItemCount();
  const subtotal = getTotalPrice();
  const shipping = totalItems > 0 ? 5.00 : 0; // Example shipping cost
  const taxes = totalItems > 0 ? subtotal * 0.08 : 0; // Example 8% tax
  const total = subtotal + shipping + taxes;

  const handleCheckout = () => {
    // Mock checkout
    toast({
      title: "Checkout Initiated!",
      description: "This is a mock checkout. No real transaction will occur.",
    });
    // Potentially clear cart after successful mock checkout
    // clearCart(); 
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal ({totalItems} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Estimated Taxes</span>
          <span>${taxes.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          size="lg" 
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" 
          onClick={handleCheckout}
          disabled={totalItems === 0}
        >
          <ShoppingBag className="mr-2 h-5 w-5" /> Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CartSummary;
