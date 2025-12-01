"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/services/orderService";
import type { Order } from "@/lib/types";
import {
  AlertCircle,
  Loader2,
  PackageSearch,
  CheckCircle,
  Truck,
  ShoppingCart,
  Search,
} from "lucide-react";
import OrderStatusBadge from "@/components/admin/orders/OrderStatusBadge";
import { format } from "date-fns";

export default function OrderTrackingClient() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError("Please enter an Order ID.");
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
        setError("Order not found. Please check the ID and try again.");
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setError(
        "An error occurred while fetching your order. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: Order["orderStatus"]) => {
    switch (status) {
      case "pending":
        return <ShoppingCart className="h-6 w-6 text-yellow-500" />;
      case "processing":
        return <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />;
      case "shipped":
        return <Truck className="h-6 w-6 text-indigo-500" />;
      case "delivered":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "cancelled":
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <PackageSearch className="h-6 w-6 text-muted-foreground" />;
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-muted/30 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <PackageSearch className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Track Your Order
          </h1>
          <p className="text-muted-foreground text-lg">
            Enter your Order ID to check the current status of your shipment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g., abc123xyz789)"
              className="h-14 pl-12 bg-background border-transparent focus:border-primary rounded-2xl shadow-sm text-lg transition-all"
              aria-label="Order ID"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Searching...
              </>
            ) : (
              "Track Order"
            )}
          </Button>
        </form>
      </div>

      {searched && !isLoading && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {error && (
            <div className="bg-destructive/5 border border-destructive/10 rounded-3xl p-6 flex items-center gap-4 text-destructive">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Order Not Found</h3>
                <p className="text-destructive/80">{error}</p>
              </div>
            </div>
          )}

          {order && !error && (
            <div className="bg-muted/30 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Order Status
                  </h2>
                  <p className="text-muted-foreground">
                    ID:{" "}
                    <span className="font-mono text-foreground">
                      {order.id}
                    </span>
                  </p>
                </div>
                <div className="bg-background p-3 rounded-2xl shadow-sm">
                  {getStatusIcon(order.orderStatus)}
                </div>
              </div>

              <div className="bg-background rounded-3xl p-6 shadow-sm space-y-4 mb-6">
                <div className="flex justify-between items-center p-2">
                  <span className="font-medium text-muted-foreground">
                    Current Status
                  </span>
                  <OrderStatusBadge
                    status={order.orderStatus}
                    className="px-4 py-1.5 text-sm rounded-full"
                  />
                </div>
                <div className="h-px bg-border/50" />
                <div className="flex justify-between items-center p-2">
                  <span className="font-medium text-muted-foreground">
                    Order Date
                  </span>
                  <span className="font-semibold">
                    {order.createdAt instanceof Date
                      ? format(order.createdAt, "MMM d, yyyy, h:mm a")
                      : "N/A"}
                  </span>
                </div>
                <div className="h-px bg-border/50" />
                <div className="flex justify-between items-center p-2">
                  <span className="font-medium text-muted-foreground">
                    Total Amount
                  </span>
                  <span className="font-bold text-primary text-lg">
                    ₨{order.orderTotal.toFixed(2)}
                  </span>
                </div>
                <div className="h-px bg-border/50" />
                <div className="flex justify-between items-center p-2">
                  <span className="font-medium text-muted-foreground">
                    Items Count
                  </span>
                  <span className="font-semibold">
                    {order.cartItems.reduce(
                      (acc, item) => acc + item.quantity,
                      0
                    )}{" "}
                    items
                  </span>
                </div>
              </div>

              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                <p className="text-center text-primary/80 font-medium">
                  {order.orderStatus === "pending" &&
                    "Your order has been received and is awaiting processing."}
                  {order.orderStatus === "processing" &&
                    "Your order is currently being processed by our team."}
                  {order.orderStatus === "shipped" &&
                    "Your order has been shipped and is on its way!"}
                  {order.orderStatus === "delivered" &&
                    "Your order has been successfully delivered. Thank you!"}
                  {order.orderStatus === "cancelled" &&
                    "This order has been cancelled."}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
