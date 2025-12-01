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
import { ShieldCheck, RotateCw, Truck, AlertTriangle } from "lucide-react";
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
          // Pre-select the first option for each variant by default
          if (foundProduct.variants && foundProduct.variants.length > 0) {
            const defaultVariants: { [key: string]: string } = {};
            foundProduct.variants.forEach((variant) => {
              if (variant.options && variant.options.length > 0) {
                defaultVariants[variant.type] = variant.options[0].value;
              }
            });
            setSelectedVariants(defaultVariants);
          }

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
    setQuantity(1); // Reset quantity when variant changes
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
                <Skeleton key={i} className="w-full aspect-square rounded-xl" />
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
    <div className="container mx-auto px-4 py-8 lg:py-16">
      <div className="space-y-20">
        {/* Main Product Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">
          <div className="lg:sticky lg:top-24">
            <div className="rounded-3xl overflow-hidden shadow-sm bg-card">
              <ProductImageGallery
                images={product.images}
                altText={product.name}
              />
            </div>
          </div>

          <div className="space-y-10">
            {/* Product Header */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant="secondary"
                  className="px-3 py-1 text-sm font-medium rounded-full"
                >
                  {product.category}
                </Badge>
                {product.stock < 10 && product.stock > 0 && (
                  <Badge
                    variant="destructive"
                    className="px-3 py-1 text-sm rounded-full"
                  >
                    Only {product.stock} left
                  </Badge>
                )}
                {product.rating > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-full border border-yellow-100 dark:border-yellow-900/50">
                    <StarRating rating={product.rating} size={16} />
                    <span className="text-sm font-medium text-yellow-700 dark:text-yellow-500">
                      {product.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews} reviews)
                    </span>
                  </div>
                )}
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.1]">
                {product.name}
              </h1>
            </div>

            {/* Pricing & Description */}
            <div className="space-y-6">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl lg:text-5xl font-bold text-primary">
                  ₨{currentPrice.toFixed(2)}
                </span>
                {product.originalPrice &&
                  product.originalPrice > currentPrice && (
                    <div className="flex items-center gap-3">
                      <span className="text-xl text-muted-foreground line-through decoration-2">
                        ₨{product.originalPrice.toFixed(2)}
                      </span>
                      <Badge
                        variant="destructive"
                        className="text-sm font-bold px-2 py-0.5 rounded-md"
                      >
                        {discountPercentage}% OFF
                      </Badge>
                    </div>
                  )}
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator className="bg-border/50" />

            {/* Variants & Actions */}
            <div className="space-y-8">
              {product.variants && (
                <div className="space-y-6">
                  {product.variants.map((variant) => (
                    <VariantSelector
                      key={variant.type}
                      variant={variant}
                      selectedValue={selectedVariants[variant.type]}
                      onValueChange={(value) =>
                        handleVariantSelect(variant.type, value)
                      }
                    />
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  maxQuantity={product.stock}
                  className="h-14"
                />
                <AddToCartButton
                  product={product}
                  quantity={quantity}
                  selectedVariants={selectedVariants}
                  className="flex-1 h-14 text-lg font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                  size="lg"
                />
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    product.stock > 0 ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
                {product.stock > 0
                  ? `${product.stock} items in stock`
                  : "Out of stock"}
              </p>
            </div>

            {/* Trust Badges - Clean Grid */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              {[
                {
                  icon: ShieldCheck,
                  title: "Secure Checkout",
                  desc: "SSL encrypted",
                  color: "text-green-600",
                },
                {
                  icon: Truck,
                  title: "Free Shipping",
                  desc: "On orders over ₨2000",
                  color: "text-blue-600",
                },
                {
                  icon: RotateCw,
                  title: "Easy Returns",
                  desc: "30-day policy",
                  color: "text-orange-600",
                },
                {
                  icon: ShieldCheck,
                  title: "Authentic",
                  desc: "100% original",
                  color: "text-purple-600",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <item.icon className={`w-6 h-6 ${item.color} mt-0.5`} />
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Details - Clean Section */}
        <section className="bg-muted/30 rounded-[2.5rem] p-8 lg:p-16">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                Product Highlights
              </h2>
              <div className="w-20 h-1 bg-primary mx-auto rounded-full opacity-20"></div>
            </div>

            <div className="prose prose-lg max-w-none dark:prose-invert text-muted-foreground leading-relaxed">
              <p>{product.longDescription || product.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-border/50">
              <div className="space-y-2 text-center sm:text-left">
                <p className="font-semibold text-foreground">Category</p>
                <p className="text-muted-foreground">{product.category}</p>
              </div>
              {product.tags && product.tags.length > 0 && (
                <div className="space-y-2 text-center sm:text-left">
                  <p className="font-semibold text-foreground">Tags</p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {product.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs font-normal bg-background"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2 text-center sm:text-left">
                <p className="font-semibold text-foreground">SKU</p>
                <p className="text-muted-foreground font-mono text-sm">
                  {product.id.substring(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="max-w-4xl mx-auto space-y-12">
          <div className="flex items-center justify-between border-b pb-6">
            <h2 className="text-3xl font-bold text-foreground">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-2">
              <StarRating rating={product.rating} size={20} />
              <span className="font-bold text-lg">
                {product.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="space-y-12">
            <ReviewList
              productId={productId}
              refreshReviewsSignal={refreshReviewsSignal}
            />
            <div className="bg-card rounded-3xl p-8 shadow-sm border border-border/50">
              <h3 className="text-xl font-semibold mb-6">Write a Review</h3>
              <ReviewForm
                productId={productId}
                onReviewSubmit={handleReviewSubmitted}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
