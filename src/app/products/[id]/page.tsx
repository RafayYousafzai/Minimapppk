
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  getProductById,
  getProductsByCategory,
} from "@/services/productService";
import type { Product as ProductType } from "@/lib/types";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import QuantitySelector from "@/components/products/QuantitySelector";
import VariantSelector from "@/components/products/VariantSelector";
import StarRating from "@/components/ui/StarRating";
import { Separator } from "@/components/ui/separator";
import {
  ShieldCheck,
  RotateCw,
  Truck,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AddToCartButton from "@/components/shared/AddToCartButton";
import { Skeleton } from "@/components/ui/skeleton";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<ProductType | null | undefined>(
    undefined
  );
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});
  const [refreshReviewsSignal, setRefreshReviewsSignal] = useState(0);

  useEffect(() => {
    if (productId) {
      const fetchProductData = async () => {
        setLoading(true);
        setSelectedVariants({}); // Reset variants on new product load
        const foundProduct = await getProductById(productId);
        setProduct(foundProduct);

        if (foundProduct) {
          // No longer setting initial variants here to allow user selection
          const fetchedRelatedProducts = await getProductsByCategory(
            foundProduct.category
          );
          setRelatedProducts(
            fetchedRelatedProducts
              .filter((p) => p.id !== foundProduct.id)
              .slice(0, 4)
          );
        }
        setLoading(false);
      };
      fetchProductData();
    }
  }, [productId]);

  const handleVariantSelect = (variantType: string, optionValue: string) => {
    setSelectedVariants((prev) => ({ ...prev, [variantType]: optionValue }));
    setQuantity(1);
  };

  const currentPrice = useMemo(() => {
    if (!product) return 0;
    let price = product.price;
    if (product.variants && Object.keys(selectedVariants).length > 0) {
      product.variants.forEach((variant) => {
        const selectedOptionValue = selectedVariants[variant.type];
        if (selectedOptionValue) {
          const option = variant.options.find(
            (opt) => opt.value === selectedOptionValue
          );
          if (option?.additionalPrice) {
            price += option.additionalPrice;
          }
        }
      });
    }
    return price;
  }, [product, selectedVariants]);

  const handleReviewSubmitted = useCallback(() => {
    setRefreshReviewsSignal((prev) => prev + 1);
  }, []);

  if (loading || product === undefined) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 xl:gap-16">
          <div className="space-y-6">
            <Skeleton className="w-full aspect-square rounded-2xl" />
            <div className="grid grid-cols-5 gap-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-full aspect-square rounded-xl"
                />
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            <Skeleton className="h-24 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center py-12 px-6">
          <div className="mx-auto w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Product Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            The product you are looking for does not exist or may have been
            removed.
          </p>
        </div>
      </div>
    );
  }

  const discountPercentage =
    product.originalPrice && product.originalPrice > currentPrice
      ? Math.round(
          ((product.originalPrice - currentPrice) / product.originalPrice) * 100
        )
      : 0;

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="space-y-16">
        {/* Main Product Section */}
        <section className="grid md:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">
          <div className="md:sticky md:top-8">
            <ProductImageGallery
              images={product.images}
              altText={product.name}
            />
          </div>

          <div className="space-y-8">
            {/* Product Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-sm font-medium">
                  {product.category}
                </Badge>
                {product.stock < 10 && product.stock > 0 && (
                  <Badge variant="destructive" className="text-sm">
                    Only {product.stock} left
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                {product.name}
              </h1>

              {product.rating > 0 && (
                <div className="flex items-center gap-3">
                  <StarRating rating={product.rating} size={24} />
                  <span className="text-lg text-muted-foreground">
                    {product.rating.toFixed(1)} ({product.reviews} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-foreground">
                  ₨{currentPrice.toFixed(2)}
                </span>
                {product.originalPrice &&
                  product.originalPrice > currentPrice && (
                    <>
                      <span className="text-2xl text-muted-foreground line-through">
                        ₨{product.originalPrice.toFixed(2)}
                      </span>
                      <Badge
                        variant="destructive"
                        className="text-sm font-semibold"
                      >
                        {discountPercentage}% OFF
                      </Badge>
                    </>
                  )}
              </div>
              <p className="text-lg text-muted-foreground">
                {product.stock > 0
                  ? `${product.stock} items available`
                  : "Out of stock"}
              </p>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants && (
              <div className="space-y-6">
                {product.variants.map((variant) => (
                  <VariantSelector
                    key={variant.type}
                    variant={variant}
                    selectedOptionValue={selectedVariants[variant.type]}
                    onOptionSelect={handleVariantSelect}
                  />
                ))}
              </div>
            )}

            {/* Purchase Section */}
            <div className="space-y-6 p-6 bg-card border rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row items-center gap-4 flex-wrap">
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  maxQuantity={product.stock}
                />
                <AddToCartButton
                  product={product}
                  quantity={quantity}
                  selectedVariants={selectedVariants}
                  className="flex-1 h-12 px-8 text-lg font-semibold min-w-[200px]"
                  size="lg"
                />
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-secondary rounded-xl border">
                <ShieldCheck className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-secondary-foreground">
                    Secure Checkout
                  </p>
                  <p className="text-sm text-muted-foreground">
                    SSL encrypted transactions
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-secondary rounded-xl border">
                <Truck className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-secondary-foreground">Free Shipping</p>
                  <p className="text-sm text-muted-foreground">
                    On orders over ₨2000
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-secondary rounded-xl border">
                <RotateCw className="w-8 h-8 text-orange-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-secondary-foreground">
                    Easy Returns
                  </p>
                  <p className="text-sm text-muted-foreground">
                    30-day return policy
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-secondary rounded-xl border">
                <ShieldCheck className="w-8 h-8 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-secondary-foreground">
                    Quality Guarantee
                  </p>
                  <p className="text-sm text-muted-foreground">
                    100% authentic products
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-16" />

        {/* Product Details */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-foreground">
            Product Details
          </h2>
          <Card>
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {product.longDescription || product.description}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t">
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">Category</p>
                  <p className="text-muted-foreground">{product.category}</p>
                </div>
                {product.tags && product.tags.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-sm"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">Availability</p>
                  <p className="text-muted-foreground">
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-16" />

        {/* Reviews Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-foreground">
            Customer Reviews
          </h2>
          <div className="space-y-8">
            <ReviewList
              productId={productId}
              refreshReviewsSignal={refreshReviewsSignal}
            />
            <ReviewForm
              productId={productId}
              onReviewSubmit={handleReviewSubmitted}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
