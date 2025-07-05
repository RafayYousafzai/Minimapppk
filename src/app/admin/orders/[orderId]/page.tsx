
export const dynamic = "force-dynamic";


import { getOrderById } from '@/services/orderService';
import { notFound } from 'next/navigation';
import OrderDetailsClient from '@/components/admin/orders/OrderDetailsClient';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface AdminOrderDetailPageProps {
  params: {
    orderId: string;
  };
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { orderId } = params;
  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/admin/orders">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back to orders</span>
                </Link>
            </Button>
            <div>
                <h1 className="text-3xl font-bold">Order Details</h1>
                <p className="text-muted-foreground">
                Viewing order #{order.id.substring(0, 8)}...
                </p>
            </div>
        </div>
        {/* Add actions like "Print Invoice" or "Resend Confirmation" here if needed */}
      </div>
      <OrderDetailsClient order={order} />
    </div>
  );
}
