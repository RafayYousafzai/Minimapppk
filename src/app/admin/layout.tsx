
import type { Metadata } from 'next';
import Link from 'next/link';
import { Package2, ShoppingBag, PackagePlus, Tags } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ShopWave Admin',
  description: 'Admin dashboard for ShopWave e-commerce store.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <Package2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ShopWave Admin</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium md:gap-6">
            <Link href="/admin/orders" className="text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1">
              <ShoppingBag className="h-4 w-4" /> Orders
            </Link>
            <Link href="/admin/products" className="text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1">
              <PackagePlus className="h-4 w-4" /> Products
            </Link>
            {/* <Link href="/admin/categories" className="text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1">
              <Tags className="h-4 w-4" /> Categories
            </Link> */}
            {/* Add more admin navigation links here as needed */}
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6">
        {children}
      </main>
    </div>
  );
}
