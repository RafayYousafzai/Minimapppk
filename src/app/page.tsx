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
import Image from "next/image";
import Link from "next/link";
// import SeedButton from "@/components/dev/SeedButton";
import TestimonialSection from "@/components/home/TestimonialSection";

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
  const featuredProducts = await getFeaturedProducts(4);

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
  const displayCategories = categories.slice(0, 4);

  const recentReviews: Review[] = await getRecentReviews(3);

  return (
    <div className="flex-1 ">
      {/* Developer Zone */}
      {/* <div className="container mx-auto px-4 pt-8">
        <div className="my-4 p-6 border-2 border-dashed border-purple-300 rounded-2xl bg-purple-50/50 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-purple-700 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Developer Zone
          </h3>
          <p className="text-sm text-purple-600 mb-3 mt-2">
            Use this button to populate your Firestore database with mock
            product data if it's empty. This should only be used in development.
          </p>
          <SeedButton />
          <p className="text-xs text-purple-500 mt-3 leading-relaxed">
            If you encounter Firestore errors (like "INVALID_ARGUMENT"), please
            ensure your Firebase Project ID is correctly set in your{" "}
            <code className="bg-purple-200 px-1 rounded">.env</code> file,
            Firestore is enabled in Native Mode in your Firebase project
            console, and necessary indexes are created (check console logs for
            hints).
          </p>
        </div>
      </div> */}

      <div className="mx-auto px-4 space-y-16 pb-16">
        {/* Hero Section */}
        {heroProduct && (
          <section className="relative overflow-hidden">
            <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 rounded-md shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
                <div className="order-2 md:order-1 text-white z-10">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    <span className="text-sm font-medium">
                      Featured Product
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                    Discover
                    <span className="block text-yellow-300">
                      {heroProduct.name}
                    </span>
                  </h1>
                  <p className="text-lg md:text-xl text-purple-100 mb-8 leading-relaxed">
                    {heroProduct.description} Check out our latest arrival and
                    fall in love! ✨
                  </p>
                  <Link href={`/products/${heroProduct.id}`}>
                    <Button
                      size="lg"
                      className="bg-white text-purple-600 hover:bg-purple-50 rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <div className="order-1 md:order-2 relative">
                  <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden group shadow-2xl">
                    <Image
                      src={heroProduct.images[0] || "/placeholder.svg"}
                      alt={heroProduct.name}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      data-ai-hint="product lifestyle"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
                  </div>
                  {/* Floating decorative elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-300 rounded-full animate-bounce"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-300 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                ✨ Best Seller Products ✨
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our most loved items that customers can't get enough
                of!
              </p>
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

        {/* Testimonial Section */}
        {recentReviews.length > 0 && (
          <section className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl">
            <TestimonialSection reviews={recentReviews} />
          </section>
        )}

        {/* Categories Section */}
        {displayCategories.length > 0 && (
          <section>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Shop by Category 🛍️
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

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">2000+</div>
              <div className="text-purple-100">Orders Shipped</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">1500+</div>
              <div className="text-purple-100">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">5★</div>
              <div className="text-purple-100">Average Rating</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">24/7</div>
              <div className="text-purple-100">Support</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
