export const dynamic = "force-dynamic";


import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  ShoppingBag,
  Users,
  PackageSearch,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";
import {
  getTotalRevenue,
  getTotalOrdersCount,
  getActiveCustomersCount,
  getRecentOrders,
} from "@/services/orderService";
import type { Order } from "@/lib/types";
import { format } from "date-fns";
import OrderStatusBadge from "@/components/admin/orders/OrderStatusBadge";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default async function AdminDashboardPage() {
  const totalRevenue = await getTotalRevenue();
  const totalOrdersCount = await getTotalOrdersCount();
  const activeCustomersCount = await getActiveCustomersCount();
  const recentOrders: Order[] = await getRecentOrders(5);

  // Mock data for percentage changes (you can replace with real calculations)
  const revenueChange = 12.5;
  const ordersChange = 8.2;
  const customersChange = -2.1;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <LineChart className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₨{totalRevenue.toLocaleString()}
            </div>
          </CardContent>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-green-500 to-green-600" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalOrdersCount.toLocaleString()}
            </div>

            <Button size="sm" variant="outline" className="mt-3 w-full" asChild>
              <Link href="/admin/orders">View All Orders</Link>
            </Button>
          </CardContent>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Customers
            </CardTitle>
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeCustomersCount.toLocaleString()}
            </div>
          </CardContent>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600" />
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Latest orders from your customers
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/orders">
                  View All
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                        <PackageSearch className="h-5 w-5 text-white" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Order #{order.id.substring(0, 8)}...
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.billingFirstName} {order.billingLastName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          ₨{order.orderTotal.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.createdAt instanceof Date
                            ? format(order.createdAt, "MMM d, h:mm a")
                            : "Invalid Date"}
                        </p>
                      </div>
                      <OrderStatusBadge status={order.orderStatus} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <PackageSearch className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  No recent orders to display
                </p>
                <p className="text-sm text-muted-foreground">
                  Orders will appear here once customers start purchasing
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/products">
                <PackageSearch className="mr-2 h-4 w-4" />
                Add New Product
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/orders">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Process Orders
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/customers">
                <Users className="mr-2 h-4 w-4" />
                View Customers
              </Link>
            </Button>
            {/* <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/analytics">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
