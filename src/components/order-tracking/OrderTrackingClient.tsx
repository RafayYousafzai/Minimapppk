
"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getOrderById } from '@/services/orderService';
import type { Order } from '@/lib/types';
import { AlertCircle, Loader2, PackageSearch, CheckCircle, Truck, ShoppingCart } from 'lucide-react';
import OrderStatusBadge from '@/components/admin/orders/OrderStatusBadge';
import { format } from 'date-fns';

export default function OrderTrackingClient() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter an Order ID.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setOrder(null);
    setSearched(true);
    try {
      const fetchedOrder = await getOrderById(orderId.trim());
      setOrder(fetchedOrder);
      if (!fetchedOrder) {
        setError('Order not found. Please check the ID and try again.');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('An error occurred while fetching your order. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: Order['orderStatus']) => {
    switch (status) {
      case 'pending':
        return <ShoppingCart className="h-6 w-6 text-yellow-500" />;
      case 'processing':
        return <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />;
      case 'shipped':
        return <Truck className="h-6 w-6 text-indigo-500" />;
      case 'delivered':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <PackageSearch className="h-6 w-6 text-muted-foreground" />;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Enter your Order ID</CardTitle>
          <CardDescription>
            Check the status of your recent order. You can find the Order ID in your confirmation email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g., abc123xyz789"
              className="text-base"
              aria-label="Order ID"
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Track Order'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {searched && !isLoading && (
        <div className="mt-8">
          {error && (
            <Card className="border-destructive bg-destructive/10">
              <CardHeader className="flex flex-row items-center gap-3">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <CardTitle className="text-destructive text-lg">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          {order && !error && (
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">Order Status</CardTitle>
                  {getStatusIcon(order.orderStatus)}
                </div>
                <CardDescription>Order ID: {order.id.substring(0, 12)}...</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Current Status:</span>
                  <OrderStatusBadge status={order.orderStatus} className="text-sm px-3 py-1" />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date:</span>
                  <span>
                    {order.createdAt instanceof Date 
                      ? format(order.createdAt, 'MMM d, yyyy, h:mm a')
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span>₨{order.orderTotal.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between">
                  <span className="text-muted-foreground">Items:</span>
                  <span>{order.cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    {order.orderStatus === 'pending' && 'Your order has been received and is awaiting processing.'}
                    {order.orderStatus === 'processing' && 'Your order is currently being processed by our team.'}
                    {order.orderStatus === 'shipped' && 'Your order has been shipped and is on its way!'}
                    {order.orderStatus === 'delivered' && 'Your order has been successfully delivered. Thank you!'}
                    {order.orderStatus === 'cancelled' && 'This order has been cancelled.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
