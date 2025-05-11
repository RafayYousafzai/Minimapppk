
import ProductForm from '@/components/admin/products/ProductForm';
import { getAllCategories, getProductById } from '@/services/productService';
import { notFound } from 'next/navigation';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = params;
  const product = await getProductById(id);
  const categories = await getAllCategories();

  if (!product) {
    notFound(); // Or redirect to a "not found" page if you have one
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">
          Update the details for "{product.name}".
        </p>
      </div>
      <ProductForm 
        initialData={product} 
        existingCategories={categories} 
        productId={id} 
      />
    </div>
  );
}
