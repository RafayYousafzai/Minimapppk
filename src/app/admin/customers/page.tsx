
import { getAllCustomerSummaries } from '@/services/customerService';
import CustomersTable from '@/components/admin/customers/CustomersTable';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminCustomersPage() {
  const customers = await getAllCustomerSummaries();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">
          View and manage your customer base.
        </p>
      </div>
      {customers.length > 0 ? (
        <CustomersTable customers={customers} />
      ) : (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>No Customers Found</CardTitle>
                <CardDescription>No customers have placed orders yet.</CardDescription>
            </CardHeader>
        </Card>
      )}
    </div>
  );
}
