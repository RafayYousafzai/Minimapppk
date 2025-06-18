export const dynamic = "force-dynamic";

import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import type { Product, Review } from "@/lib/types";
import {
  getFeaturedProducts,
  getAllProducts,
  getAllCategories,
  getRecentReviews,
} from "@/services/productService";
import { ArrowRight, Package, Heart, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import TestimonialSection from "@/components/home/TestimonialSection";
import Carousal from "@/components/embla-carousal/index";

// Cute category icons
const CategoryIcon = ({ category }: { category: string }) => {
  const iconClass = "w-8 h-8 text-purple-600";

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
  // Fetch data from Firebase
  const featuredProducts = await getFeaturedProducts(20);

  let heroProduct: Product | null = null;
  if (featuredProducts.length > 0) {
    heroProduct = featuredProducts[0];
  } else {
    const allProds = await getAllProducts();
    if (allProds.length > 0) {
      heroProduct = allProds.find((p) => p.images.length > 1) || allProds[0];
    }
  }

  const categories = await getAllCategories();
  const displayCategories = categories.slice(0, 8);

  const recentReviews: Review[] = await getRecentReviews(3);

  return (
    <div className="flex-1 ">
      <Carousal />

      <div className="mx-auto px-4 space-y-16 pb-16">
        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Best Selling Products
              </h2>

              <div className="inline-flex items-center gap-2   px-6 py-2 mb-6">
                <span className="text-purple-700 font-semibold">
                  Most loved products
                </span>
                <Heart className="w-5 h-5 text-purple-500 fill-purple-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {featuredProducts.map((product: Product) => (
                <div
                  key={product.id}
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/products">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg font-semibold"
                >
                  View All Products <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </section>
        )}

        {/* Categories Section */}
        {displayCategories.length > 0 && (
          <section>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Shop by Collection
              </h2>
              <p className="text-lg text-gray-600">
                Find exactly what you're looking for in our curated collections
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {displayCategories.map((category) => (
                <Link
                  key={category}
                  href={`/products?categories=${encodeURIComponent(category)}`}
                >
                  <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center cursor-pointer aspect-square flex flex-col justify-center items-center border border-purple-100 hover:border-purple-300 transform hover:scale-105">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <CategoryIcon category={category} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition-colors">
                      {category}
                    </h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Testimonial Section */}
        {recentReviews.length > 0 && (
          <TestimonialSection reviews={recentReviews} />
        )}

        {/* Stats Section */}
        <section className="bg-gradient-to-br from-[#9b78e8] via-purple-600 to-[#9b78e8] rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl text-white md:text-4xl font-bold">
                2000+
              </div>
              <div className="text-gray-200">Orders Shipped</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl text-white md:text-4xl font-bold">
                1500+
              </div>
              <div className="text-gray-200">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl text-white md:text-4xl font-bold">
                5★
              </div>
              <div className="text-gray-200">Average Rating</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl text-white md:text-4xl font-bold">
                24/7
              </div>
              <div className="text-gray-200">Support</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
