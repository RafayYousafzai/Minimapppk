
export const dynamic = "force-dynamic";

import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import type { Product, Review } from "@/lib/types";
import {
  getFeaturedProducts,
  getAllCategories,
  getRecentReviews,
} from "@/services/productService";
import { ArrowRight, Package, Heart, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import TestimonialSection from "@/components/home/TestimonialSection";
import Carousal from "@/components/embla-carousal/index";

// Category icons
const CategoryIcon = ({ category }: { category: string }) => {
  const iconClass = "w-8 h-8 text-primary";

  switch (category.toLowerCase()) {
    case "jewelry":
      return <Sparkles className={iconClass} />;
    case "accessories":
      return <Heart className={iconClass} />;
    default:
      return <Package className={iconClass} />;
  }
};

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(20);
  const categories = await getAllCategories();
  const displayCategories = categories.slice(0, 8);
  const recentReviews: Review[] = await getRecentReviews(3);

  return (
    <div className="flex-1">
      <Carousal products={featuredProducts} />

      <div className="mx-auto px-4 md:px-8 space-y-24 pb-24 pt-12">
        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section>
            <div className="flex flex-col items-center text-center mb-16">
              <span className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
                Curated For You
              </span>
              <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6">
                Best Selling Products
              </h2>
              <div className="w-16 h-0.5 bg-primary/20 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mb-12">
              {featuredProducts.map((product: Product) => (
                <div
                  key={product.id}
                  className="group"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" size="lg" className="rounded-full px-8 hover:bg-primary hover:text-primary-foreground transition-colors" asChild>
                <Link href="/products">
                  View All Products <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>
        )}

        {/* Categories Section */}
        {displayCategories.length > 0 && (
          <section>
            <div className="flex flex-col items-center text-center mb-16">
              <span className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
                Collections
              </span>
              <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6">
                Shop by Category
              </h2>
              <div className="w-16 h-0.5 bg-primary/20 rounded-full mb-6"></div>
              <p className="text-muted-foreground max-w-2xl font-light leading-relaxed">
                Discover our hand-picked collections, crafted to elevate your style for every occasion.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {displayCategories.map((category) => (
                <Link
                  key={category}
                  href={`/products?categories=${encodeURIComponent(category)}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-secondary/20 hover:bg-secondary/40 transition-colors duration-500 aspect-[4/5] flex flex-col items-center justify-center p-6 border border-transparent hover:border-border/50">
                    <div className="mb-6 p-5 bg-background/80 backdrop-blur-sm rounded-full shadow-sm group-hover:shadow-md transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-110">
                      <CategoryIcon category={category} />
                    </div>
                    
                    <h3 className="font-medium text-lg tracking-wide text-foreground mb-3 capitalize group-hover:text-primary transition-colors">
                      {category}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Testimonial Section */}
        {recentReviews.length > 0 && (
          <div className="">
             <TestimonialSection reviews={recentReviews} />
          </div>
        )}

        {/* Stats Section */}
        <section className="relative overflow-hidden rounded-3xl bg-secondary/5 border border-border/40 p-12 md:p-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative z-10">
            {/* Stat 1 */}
            <div className="flex flex-col items-center justify-center text-center group">
              <div className="mb-4 p-4 bg-background rounded-full shadow-sm border border-border/50 group-hover:scale-110 transition-transform duration-300">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">
                  2k+
                </h4>
                <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-muted-foreground">
                  Orders Shipped
                </p>
              </div>
            </div>
            
            {/* Stat 2 */}
            <div className="flex flex-col items-center justify-center text-center group">
              <div className="mb-4 p-4 bg-background rounded-full shadow-sm border border-border/50 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">
                  1.5k+
                </h4>
                <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-muted-foreground">
                  Happy Customers
                </p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center justify-center text-center group">
              <div className="mb-4 p-4 bg-background rounded-full shadow-sm border border-border/50 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-6 h-6 text-primary fill-primary/20" />
              </div>
              <div className="space-y-1">
                <h4 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">
                  4.9
                </h4>
                <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-muted-foreground">
                  Average Rating
                </p>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col items-center justify-center text-center group">
              <div className="mb-4 p-4 bg-background rounded-full shadow-sm border border-border/50 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">
                  24/7
                </h4>
                <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-muted-foreground">
                  Support
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
