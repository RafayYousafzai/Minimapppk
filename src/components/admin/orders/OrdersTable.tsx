
"use client";

import { useState } from 'react';
import type { Order, OrderStatus } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { MoreHorizontal, FileText, Undo2, Loader2, Trash2, Eye } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';
import OrderStatusSelector from './OrderStatusSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { updateOrderStatus, deleteOrder as deleteOrderAction } from '@/services/orderService';
import ClientFormattedDate from './ClientFormattedDate';

interface OrdersTableProps {
  initialOrders: Order[];
}

const OrdersTable: React.FC<OrdersTableProps> = ({ initialOrders }) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [isRefunding, setIsRefunding] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, orderStatus: newStatus } : order
      )
    );
  };

  const handleRefundOrder = async (orderId: string) => {
    setIsRefunding(prev => ({ ...prev, [orderId]: true }));
    try {
      await updateOrderStatus(orderId, 'cancelled');
      toast({
        title: "Order Refunded (Status Updated)",
        description: `Order ${orderId} status has been changed to 'cancelled'.`,
      });
      handleStatusUpdate(orderId, 'cancelled'); // Update local state
    } catch (error) {
      console.error("Failed to refund order (update status):", error);
      toast({
        title: "Refund Failed",
        description: "Could not update order status to cancelled. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefunding(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const openDeleteDialog = (orderId: string) => {
    setOrderToDelete(orderId);
    setIsAlertOpen(true);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    const orderId = orderToDelete;

    setIsDeleting(prev => ({ ...prev, [orderId]: true }));
    setIsAlertOpen(false); // Close dialog

    try {
      await deleteOrderAction(orderId);
      setOrders(prevOrders => prevOrders.filter(o => o.id !== orderId));
      toast({ title: "Order Deleted", description: `Order #${orderId.substring(0,8)} has been deleted.` });
    } catch (error) {
      console.error("Failed to delete order:", error);
      toast({
        title: "Deletion Failed",
        description: "Could not delete order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(prev => ({ ...prev, [orderId]: false }));
      setOrderToDelete(null);
    }
  };


  if (orders.length === 0) {
    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>No Orders Found</CardTitle>
                <CardDescription>There are currently no orders to display.</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  return (
    <>
    <Card className="mt-6 shadow-md">
      <CardHeader>
        <CardTitle>Manage Orders</CardTitle>
        <CardDescription>View and update customer orders.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Mobile View - Cards */}
        <div className="space-y-4 md:hidden">
          {orders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <Link href={`/admin/orders/${order.id}`} className="font-semibold text-primary hover:underline">
                    #{order.id.substring(0, 8)}...
                  </Link>
                  <p className="text-sm text-muted-foreground">{order.billingFirstName} {order.billingLastName}</p>
                </div>
                <OrderStatusBadge status={order.orderStatus} />
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span><ClientFormattedDate date={order.createdAt} formatString="MMM d, yyyy" /></span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium">₨{order.orderTotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                  <OrderStatusSelector 
                    orderId={order.id} 
                    currentStatus={order.orderStatus}
                    onStatusChange={(newStatus) => handleStatusUpdate(order.id, newStatus)} 
                  />
              </div>
              <div className="mt-2 flex gap-2">
                 <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/admin/orders/${order.id}`}>
                        <Eye className="mr-1 h-4 w-4" /> View
                    </Link>
                 </Button>
                 <Button variant="destructive" size="sm" className="flex-1" onClick={() => openDeleteDialog(order.id)} disabled={isDeleting[order.id]}>
                    {isDeleting[order.id] ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Trash2 className="mr-1 h-4 w-4" />}
                    Delete
                 </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Update Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline" title={`View details for order ${order.id}`}>
                      #{order.id.substring(0, 8)}...
                    </Link>
                  </TableCell>
                  <TableCell>
                      <div>{order.billingFirstName} {order.billingLastName}</div>
                      <div className="text-xs text-muted-foreground">{order.billingEmail}</div>
                  </TableCell>
                  <TableCell>
                    <ClientFormattedDate date={order.createdAt} />
                  </TableCell>
                  <TableCell className="text-right">₨{order.orderTotal.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <OrderStatusBadge status={order.orderStatus} />
                  </TableCell>
                  <TableCell>
                    <OrderStatusSelector 
                      orderId={order.id} 
                      currentStatus={order.orderStatus}
                      onStatusChange={(newStatus) => handleStatusUpdate(order.id, newStatus)} 
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isRefunding[order.id] || isDeleting[order.id]}>
                          <span className="sr-only">Open menu</span>
                          {isRefunding[order.id] || isDeleting[order.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/orders/${order.id}`}>
                            <FileText className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleRefundOrder(order.id)}
                          disabled={order.orderStatus === 'cancelled' || order.orderStatus === 'delivered' || isRefunding[order.id]}
                          className="text-orange-600 focus:text-orange-700 focus:bg-orange-50"
                        >
                          {isRefunding[order.id] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Undo2 className="mr-2 h-4 w-4" />}
                          {isRefunding[order.id] ? 'Refunding...' : 'Refund Order'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(order.id)}
                          disabled={isDeleting[order.id]}
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                          {isDeleting[order.id] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                          {isDeleting[order.id] ? 'Deleting...' : 'Delete Order'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the order
            and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOrderToDelete(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDeleteOrder}>
            Yes, delete order
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
};

export default OrdersTable;
