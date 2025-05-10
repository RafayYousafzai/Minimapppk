
"use client"; 

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { getProductById, getProductsByCategory } from '@/services/productService'; // Updated import
import type { Product as ProductType } from '@/lib/types';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import QuantitySelector from '@/components/products/QuantitySelector';
import VariantSelector from '@/components/products/VariantSelector';
import StarRating from '@/components/ui/StarRating';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AddToCartButton from '@/components/shared/AddToCartButton';
import ProductCard from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<ProductType | null | undefined>(undefined); // undefined for initial loading
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (productId) {
      const fetchProductData = async () => {
        setLoading(true);
        const foundProduct = await getProductById(productId);
        setProduct(foundProduct);

        if (foundProduct) {
          // Initialize selected variants
          if (foundProduct.variants) {
            const initialVariants: { [key: string]: string } = {};
            foundProduct.variants.forEach(variant => {
              if (variant.options.length > 0) {
                initialVariants[variant.type] = variant.options[0].value;
              }
            });
            setSelectedVariants(initialVariants);
          }
          // Fetch related products
          const fetchedRelatedProducts = await getProductsByCategory(foundProduct.category);
          setRelatedProducts(fetchedRelatedProducts.filter(p => p.id !== foundProduct.id).slice(0, 4));
        }
        setLoading(false);
      };
      fetchProductData();
    }
  }, [productId]);

  const handleVariantSelect = (variantType: string, optionValue: string) => {
    setSelectedVariants(prev => ({ ...prev, [variantType]: optionValue }));
    setQuantity(1); 
  };

  const currentPrice = useMemo(() => {
    if (!product) return 0;
    let price = product.price;
    if (product.variants && Object.keys(selectedVariants).length > 0) {
      product.variants.forEach(variant => {
        const selectedOptionValue = selectedVariants[variant.type];
        if (selectedOptionValue) {
          const option = variant.options.find(opt => opt.value === selectedOptionValue);
          if (option?.additionalPrice) {
            price += option.additionalPrice;
          }
        }
      });
    }
    return price;
  }, [product, selectedVariants]);

  if (loading || product === undefined) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <Skeleton className="w-full aspect-square rounded-lg" />
            <div className="grid grid-cols-5 gap-2 mt-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="w-full aspect-square rounded-md" />)}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold">Product Not Found</h2>
        <p className="text-muted-foreground">
          The product you are looking for does not exist or may have been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <ProductImageGallery images={product.images} altText={product.name} />
        
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
          
          <div className="flex items-center gap-4">
            <p className="text-3xl font-semibold text-primary">${currentPrice.toFixed(2)}</p>
            {product.originalPrice && product.originalPrice > currentPrice && (
              <p className="text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</p>
            )}
          </div>

          {product.rating > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={product.rating} size={20} />
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>
          )}
          
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {product.variants && product.variants.map(variant => (
            <VariantSelector
              key={variant.type}
              variant={variant}
              selectedOptionValue={selectedVariants[variant.type]}
              onOptionSelect={handleVariantSelect}
            />
          ))}

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
              maxQuantity={product.stock}
            />
            <AddToCartButton 
              product={product} 
              quantity={quantity} 
              selectedVariants={selectedVariants}
              className="w-full sm:w-auto"
              size="lg"
            />
          </div>
           <p className="text-sm text-muted-foreground">
            {product.stock > 0 ? `${product.stock} items in stock` : 'Out of stock'}
           </p>

          <div className="border p-4 rounded-lg space-y-2 bg-secondary/30">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="font-medium">Secure Checkout</span>
            </div>
            <p className="text-xs text-muted-foreground">Guaranteed safe and secure transactions.</p>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="font-medium">Easy Returns</span>
            </div>
            <p className="text-xs text-muted-foreground">30-day return policy on all orders.</p>
          </div>
        </div>
      </section>
      
      <Separator />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Product Details</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">
              {product.longDescription || product.description}
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><strong>Category:</strong> {product.category}</div>
              {product.tags && product.tags.length > 0 && (
                <div><strong>Tags:</strong> {product.tags.join(', ')}</div>
              )}
              <div><strong>Stock:</strong> {product.stock}</div>
            </div>
          </CardContent>
        </Card>
      </section>

      {relatedProducts.length > 0 && (
        <section>
          <Separator className="my-8" />
          <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProd) => (
              <ProductCard key={relatedProd.id} product={relatedProd} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
