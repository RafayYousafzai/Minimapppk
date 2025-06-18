
"use client";

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { format } from 'date-fns';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { deleteProduct } from '@/services/productService';

interface ProductsTableProps {
  initialProducts: Product[];
}

const ProductsTable: React.FC<ProductsTableProps> = ({ initialProducts }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleDeleteProduct = async (productId: string, productName: string) => {
    console.log(`[Delete Product TABLE] Initiating delete for: ${productName} (ID: ${productId})`);

    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      console.log("[Delete Product TABLE] User cancelled deletion.");
      return;
    }
    console.log("[Delete Product TABLE] User confirmed deletion.");

    setIsDeleting(prev => ({ ...prev, [productId]: true }));
    console.log(`[Delete Product TABLE] State isDeleting for ${productId} set to true.`);
    try {
      console.log(`[Delete Product TABLE] Calling service to delete product ${productId}.`);
      const success = await deleteProduct(productId);
      console.log(`[Delete Product TABLE] Service call finished. Success: ${success}`);

      if (success) {
        setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
        toast({ title: "Product Deleted", description: `"${productName}" has been successfully deleted.` });
        console.log(`[Delete Product TABLE] Product ${productId} removed from local state and success toast shown.`);
      } else {
        toast({ title: "Error Deleting Product", description: "Failed to delete product. It might have already been removed or an error occurred on the server.", variant: "destructive" });
        console.log(`[Delete Product TABLE] Service reported failure for ${productId}. Error toast shown.`);
      }
    } catch (error) {
        console.error("[Delete Product TABLE] Error during product deletion in component:", error);
        toast({ title: "Client Error", description: "An unexpected error occurred while trying to delete the product.", variant: "destructive" });
    } finally {
        setIsDeleting(prev => ({ ...prev, [productId]: false }));
        console.log(`[Delete Product TABLE] State isDeleting for ${productId} set to false in finally block.`);
    }
  };

  if (products.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>No Products Found</CardTitle>
          <CardDescription>There are currently no products to display. <Link href="/admin/products/new" className="text-primary hover:underline">Add a new product</Link>.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mt-6 shadow-md">
      <CardHeader>
        <CardTitle>Product List</CardTitle>
        <CardDescription>View and manage your store's products.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Image
                    src={product.images[0] || 'https://placehold.co/50x50.png'}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-md object-cover aspect-square"
                    data-ai-hint="product admin table"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/products/${product.id}`} target="_blank" className="hover:underline" title={`View ${product.name} on site`}>
                    {product.name}
                  </Link>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right">₨{product.price.toFixed(2)}</TableCell>
                <TableCell className="text-center">{product.stock}</TableCell>
                <TableCell>
                  <Badge variant={product.stock > 0 ? 'default' : 'destructive'} className={product.stock > 0 ? 'bg-green-500/20 text-green-700 border-green-400' : 'bg-red-500/20 text-red-700 border-red-400'}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0" disabled={isDeleting[product.id]}>
                        <span className="sr-only">Open menu</span>
                         {isDeleting[product.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                         <Link href={`/admin/products/edit/${product.id}`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Product
                         </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteProduct(product.id, product.name)} 
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        disabled={isDeleting[product.id]}
                      >
                        {isDeleting[product.id] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                        {isDeleting[product.id] ? 'Deleting...' : 'Delete Product'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductsTable;
