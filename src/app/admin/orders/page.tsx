
export const dynamic = "force-dynamic";


import { getAllOrders } from '@/services/orderService';
import OrdersTable from '@/components/admin/orders/OrdersTable';

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Orders</h1>
      <p className="text-muted-foreground mb-6">
        Here you can view and manage all customer orders.
      </p>
      <OrdersTable initialOrders={orders} />
    </div>
  );
}
