
"use client";

import type { CustomerSummary } from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CustomersTableProps {
  customers: CustomerSummary[];
}

const CustomersTable: React.FC<CustomersTableProps> = ({ customers }) => {
  if (!customers || customers.length === 0) {
    return (
         <Card className="mt-6">
            <CardHeader>
                <CardTitle>No Customers Found</CardTitle>
                <CardDescription>There are currently no customers to display.</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  return (
    <Card className="mt-6 shadow-md">
        <CardHeader>
            <CardTitle>Customer List</CardTitle>
            <CardDescription>Overview of all customers who have placed orders.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[60px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Total Orders</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {customers.map((customer) => (
                <TableRow key={customer.id}>
                    <TableCell>
                    <Avatar className="h-9 w-9">
                        {/* <AvatarImage src={customer.avatarUrl || undefined} alt={customer.name} /> */}
                        <AvatarFallback>{customer.avatarFallback}</AvatarFallback>
                    </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell className="text-center">{customer.totalOrders}</TableCell>
                    <TableCell className="text-right">₨{customer.totalSpent.toFixed(2)}</TableCell>
                    <TableCell>
                    {customer.lastOrderDate 
                        ? format(new Date(customer.lastOrderDate), 'MMM d, yyyy')
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/customers/${encodeURIComponent(customer.email)}`}>
                        <Eye className="mr-1 h-4 w-4" /> View
                        </Link>
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
};

export default CustomersTable;
