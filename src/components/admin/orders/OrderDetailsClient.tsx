
"use client";

import type { Order, OrderItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import OrderStatusBadge from './OrderStatusBadge';
import { AlertCircle, Building, CalendarDays, CreditCard, Hash, Home, Mail, MessageSquare, Package, Phone, ShoppingBag, Truck, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface OrderDetailsClientProps {
  order: Order;
}

const DetailItem: React.FC<{ label: string; value?: string | number | null; icon?: React.ElementType, children?: React.ReactNode }> = ({ label, value, icon: Icon, children }) => (
  <div className="flex flex-col">
    <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
        {Icon && <Icon className="h-4 w-4" />} 
        {label}
    </dt>
    <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0">{children || value || <span className="italic">N/A</span>}</dd>
  </div>
);

const AddressCard: React.FC<{ title: string; order: Order; type: 'billing' | 'shipping' }> = ({ title, order, type }) => {
  const prefix = type;
  const firstName = order[`${prefix}FirstName` as keyof Order] as string;
  const lastName = order[`${prefix}LastName` as keyof Order] as string;
  const company = order[`${prefix}CompanyName` as keyof Order] as string | undefined;
  const address1 = order[`${prefix}StreetAddress1` as keyof Order] as string;
  const address2 = order[`${prefix}StreetAddress2` as keyof Order] as string | undefined;
  const city = order[`${prefix}City` as keyof Order] as string;
  const state = order[`${prefix}State` as keyof Order] as string;
  const postcode = order[`${prefix}Postcode` as keyof Order] as string;
  const country = order[`${prefix}Country` as keyof Order] as string;
  const email = type === 'billing' ? order.billingEmail : undefined;
  const phone = type === 'billing' ? order.billingPhone : undefined;

  if (type === 'shipping' && !order.shipToDifferentAddress && !firstName) {
    return (
         <Card>
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Same as billing address.</p>
            </CardContent>
        </Card>
    )
  }
   if (!firstName && !address1) { // If no primary shipping details
    return null;
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="font-semibold">{firstName} {lastName}</p>
        {company && <p>{company}</p>}
        <p>{address1}</p>
        {address2 && <p>{address2}</p>}
        <p>{city}, {state} {postcode}</p>
        <p>{country}</p>
        {email && <p className="flex items-center gap-1.5 mt-2"><Mail className="h-3 w-3" /> {email}</p>}
        {phone && <p className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {phone}</p>}
      </CardContent>
    </Card>
  );
};


const OrderDetailsClient: React.FC<OrderDetailsClientProps> = ({ order }) => {
  const itemCount = order.cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <div className="flex items-center justify-between">
                 <CardDescription>
                    Order placed on {order.createdAt instanceof Date ? format(order.createdAt, 'PPPp') : 'N/A'}
                </CardDescription>
                <OrderStatusBadge status={order.orderStatus} className="text-base px-3 py-1" />
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
              <DetailItem label="Order ID" value={order.id} icon={Hash}/>
              <DetailItem label="Status" icon={AlertCircle}>
                <OrderStatusBadge status={order.orderStatus} />
              </DetailItem>
              <DetailItem label="Payment Method" value={order.paymentMethod?.toUpperCase()} icon={CreditCard} />
              <DetailItem label="Total Items" value={itemCount} icon={ShoppingBag} />
              <DetailItem label="Order Total" value={`₨${order.orderTotal.toFixed(2)}`} icon={CreditCard} />
            </dl>
            {order.orderNotes && (
                 <div className="mt-6 pt-4 border-t">
                    <DetailItem label="Order Notes" icon={MessageSquare}>
                        <p className="italic whitespace-pre-wrap">{order.orderNotes}</p>
                    </DetailItem>
                 </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items Ordered ({itemCount})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.cartItems.map((item: OrderItem) => (
                <div key={item.productId + (item.selectedVariants ? JSON.stringify(item.selectedVariants) : '')} className="flex items-start gap-4 p-4 border rounded-lg">
                  <Image
                    src={item.image || 'https://placehold.co/80x80.png'}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover aspect-square border"
                    data-ai-hint="product thumbnail"
                  />
                  <div className="flex-1">
                    <Link href={`/products/${item.productId}`} target="_blank" className="font-semibold text-primary hover:underline">
                        {item.name}
                    </Link>
                    {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {Object.entries(item.selectedVariants).map(([type, value]) => `${type}: ${value}`).join(', ')}
                      </p>
                    )}
                    <p className="text-sm">Quantity: {item.quantity}</p>
                    <p className="text-sm">Price per item: ₨{item.price.toFixed(2)}</p>
                  </div>
                  <p className="font-semibold text-lg">₨{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-1 space-y-6">
        <AddressCard title="Billing Address" order={order} type="billing" />
        {order.shipToDifferentAddress ? (
            <AddressCard title="Shipping Address" order={order} type="shipping" />
        ) : (
            <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Truck className="h-5 w-5"/>Shipping Address</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Same as billing address.</p></CardContent>
            </Card>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsClient;
