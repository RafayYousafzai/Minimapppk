
"use client";

import type { CustomerDetails } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import OrdersTable from '@/components/admin/orders/OrdersTable'; // Reusing this
import { format } from 'date-fns';
import { Briefcase, CalendarDays, Hash, Mail, Sigma, UserCircle } from 'lucide-react';

interface CustomerDetailsClientProps {
  customerDetails: CustomerDetails;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
  <Card className="flex-1 min-w-[180px]">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);


const CustomerDetailsClient: React.FC<CustomerDetailsClientProps> = ({ customerDetails }) => {
  const { summary, orders } = customerDetails;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Avatar className="h-20 w-20 text-3xl">
            {/* <AvatarImage src={summary.avatarUrl} alt={summary.name} /> */}
            <AvatarFallback>{summary.avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl">{summary.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4"/> {summary.email}
            </CardDescription>
             <CardDescription className="flex items-center gap-2 mt-1">
                <UserCircle className="h-4 w-4"/> Customer ID: {summary.id.substring(0, summary.id.indexOf('@'))}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
            <div className="flex flex-wrap gap-4">
                 <StatCard title="Total Orders" value={summary.totalOrders} icon={Briefcase} />
                 <StatCard title="Total Spent" value={`₨${summary.totalSpent.toFixed(2)}`} icon={Sigma} />
                 {summary.firstOrderDate && <StatCard title="First Order" value={format(new Date(summary.firstOrderDate), 'MMM d, yyyy')} icon={CalendarDays} />}
                 {summary.lastOrderDate && <StatCard title="Last Order" value={format(new Date(summary.lastOrderDate), 'MMM d, yyyy')} icon={CalendarDays} />}
            </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-3">Order History</h2>
        {orders.length > 0 ? (
          <OrdersTable initialOrders={orders} />
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">This customer has not placed any orders yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CustomerDetailsClient;
