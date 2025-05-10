import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { mockProducts } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const featuredProducts = mockProducts.slice(0, 4); // Show first 4 products as featured
  const heroProduct = mockProducts.length > 4 ? mockProducts[4] : mockProducts[0]; // Example hero product

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      {heroProduct && (
        <section className="bg-secondary rounded-lg shadow-md overflow-hidden">
          <div className="container mx-auto px-0 md:px-6 py-8 md:py-12 grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1 p-6 md:p-0">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                Discover {heroProduct.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {heroProduct.description} Check out our latest arrival!
              </p>
              <Link href={`/products/${heroProduct.id}`} passHref>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="order-1 md:order-2 relative h-64 md:h-96 rounded-lg overflow-hidden group">
              <Image
                src={heroProduct.images[0]}
                alt={heroProduct.name}
                fill
                priority
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                data-ai-hint="product lifestyle"
              />
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Featured Products</h2>
          <Link href="/products" passHref>
            <Button variant="outline">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories Section - Example */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Apparel', 'Electronics', 'Home Goods', 'Accessories'].map(category => (
            <Link key={category} href={`/products?category=${encodeURIComponent(category)}`} passHref>
              <div className="bg-card p-6 rounded-lg shadow hover:shadow-xl transition-shadow text-center cursor-pointer aspect-square flex flex-col justify-center items-center">
                {/* Basic category icon placeholder */}
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                   <Package2Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{category}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

// Placeholder icon, replace with actual icons if available
const Package2Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>
);

