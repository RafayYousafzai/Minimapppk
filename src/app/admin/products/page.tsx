
export const dynamic = "force-dynamic";


import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import ProductsTable from '@/components/admin/products/ProductsTable';
import { getAllProducts } from '@/services/productService';

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your store's products here.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Product
          </Link>
        </Button>
      </div>
      <ProductsTable initialProducts={products} />
    </div>
  );
}
