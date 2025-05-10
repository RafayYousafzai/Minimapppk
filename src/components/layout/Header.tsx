"use client";

import Link from 'next/link';
import { ShoppingCart, Search, Menu, Package2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const { getItemCount, cartInitialized } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize searchQuery directly from URL's 'search' parameter
  const initialSearchFromParams = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearchFromParams);
  
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Effect to update searchQuery if the 'search' URL parameter changes (e.g., back/forward navigation)
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      router.push(`/products?search=${encodeURIComponent(trimmedQuery)}`);
    } else {
      // If search query is empty, navigate to products page, removing search param if present
      const currentPathname = window.location.pathname;
      if (currentPathname === '/products') {
         const newParams = new URLSearchParams(searchParams.toString());
         newParams.delete('search');
         router.push(`${currentPathname}?${newParams.toString()}`);
      } else {
        router.push('/products');
      }
    }
    setIsSheetOpen(false); // Close mobile menu on search
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    // Add more navigation items here if needed
  ];
  
  const currentItemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Mobile Menu */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pt-12">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold mb-4"
                onClick={() => setIsSheetOpen(false)}
              >
                <Package2Icon className="h-6 w-6 text-primary" />
                <span className="font-bold">ShopWave</span>
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setIsSheetOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <form onSubmit={handleSearch} className="mt-6 flex gap-2">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="outline" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </SheetContent>
        </Sheet>

        {/* Desktop Logo & Navigation */}
        <Link href="/" className="hidden md:flex items-center gap-2">
          <Package2Icon className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">ShopWave</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search and Cart - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <Link href="/cart" passHref legacyBehavior>
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartInitialized && currentItemCount > 0 && (
                <Badge
                  variant="default" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground"
                >
                  {currentItemCount}
                </Badge>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Button>
          </Link>
        </div>

        {/* Cart Icon - Mobile (always visible except when menu open) */}
        <div className="md:hidden">
           <Link href="/cart" passHref legacyBehavior>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {cartInitialized && currentItemCount > 0 && (
                <Badge
                  variant="default"
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground"
                >
                  {currentItemCount}
                </Badge>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
