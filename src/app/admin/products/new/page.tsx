
import ProductForm from '@/components/admin/products/ProductForm';
import { getAllCategories } from '@/services/productService';

export default async function NewProductPage() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground">
          Fill in the details below to add a new product to your store.
        </p>
      </div>
      <ProductForm existingCategories={categories} />
    </div>
  );
}
