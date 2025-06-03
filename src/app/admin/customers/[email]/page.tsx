
import { getCustomerDetailsByEmail } from '@/services/customerService';
import { notFound } from 'next/navigation';
import CustomerDetailsClient from '@/components/admin/customers/CustomerDetailsClient';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CustomerDetailPageProps {
  params: {
    email: string;
  };
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const customerEmail = decodeURIComponent(params.email);
  const customerDetails = await getCustomerDetailsByEmail(customerEmail);

  if (!customerDetails) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href="/admin/customers">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to customers</span>
            </Link>
        </Button>
        <div>
            <h1 className="text-3xl font-bold">Customer Details</h1>
            <p className="text-muted-foreground">
            Viewing details for {customerDetails.summary.name} ({customerDetails.summary.email})
            </p>
        </div>
      </div>
      <CustomerDetailsClient customerDetails={customerDetails} />
    </div>
  );
}

// Optional: Generate static paths if you have a small, known set of customers and want to pre-render.
// export async function generateStaticParams() {
//   // const customers = await getAllCustomerSummaries(); // You'd need a way to get all customer emails
//   // return customers.map(customer => ({ email: encodeURIComponent(customer.email) }));
//   return []; // Or disable static generation for this dynamic route for now
// }
