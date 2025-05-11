
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, ShoppingBag, Users, PackageSearch } from 'lucide-react';
import Link from 'next/link';
import { getTotalRevenue, getTotalOrdersCount, getActiveCustomersCount, getRecentOrders } from '@/services/orderService';
import type { Order } from '@/lib/types';
import { format } from 'date-fns';
import OrderStatusBadge from '@/components/admin/orders/OrderStatusBadge';

export default async function AdminDashboardPage() {
  const totalRevenue = await getTotalRevenue();
  const totalOrdersCount = await getTotalOrdersCount();
  const activeCustomersCount = await getActiveCustomersCount();
  const recentOrders: Order[] = await getRecentOrders(5);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the ShopWave admin panel. Manage your store efficiently.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <LineChart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₨{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From completed orders
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrdersCount}</div>
            <p className="text-xs text-muted-foreground">
              All-time orders
            </p>
            <Button size="sm" variant="outline" className="mt-4" asChild>
              <Link href="/admin/orders">Manage Orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCustomersCount}</div>
            <p className="text-xs text-muted-foreground">
              Unique customers from orders
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Overview of the latest store events.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <ul className="space-y-4">
                {recentOrders.map((order) => (
                  <li key={order.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                    <div className="flex items-center gap-3">
                      <PackageSearch className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-medium">Order #{order.id.substring(0, 8)}...</p>
                        <p className="text-sm text-muted-foreground">
                          {order.billingFirstName} {order.billingLastName} - ₨{order.orderTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <OrderStatusBadge status={order.orderStatus} />
                      <p className="text-xs text-muted-foreground mt-1">
                        {order.createdAt instanceof Date ? format(order.createdAt, 'MMM d, yyyy, h:mm a') : 'Invalid Date'}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No recent activity to display.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
