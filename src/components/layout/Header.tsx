
"use client";

import Link from 'next/link';
import { ShoppingCart, Search, Menu, Package2Icon, UserCircle } from 'lucide-react'; // Added UserCircle
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useRouter, useSearchParams, usePathname } from 'next/navigation'; 
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const Header = () => {
  const { getItemCount, cartInitialized } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname(); 
  
  const initialSearchFromParams = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearchFromParams);
  
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    // Only update searchQuery from params if the path is not related to product search itself
    // to avoid clearing the input when navigating within /products page with filters.
    if (!pathname.startsWith('/products')) {
      setSearchQuery(searchParams.get('search') || '');
    }
  }, [searchParams, pathname]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      router.push(`/products?search=${encodeURIComponent(trimmedQuery)}`);
    } else {
      // If search is cleared on products page, remove search param
      if (pathname === '/products') {
         const newParams = new URLSearchParams(searchParams.toString());
         newParams.delete('search');
         router.push(`${pathname}?${newParams.toString()}`);
      } else {
        // If search is cleared on other pages, just go to products page without search
        router.push('/products');
      }
    }
    setIsSheetOpen(false); 
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    // { href: '/categories', label: 'Categories' }, // Example, if you add a categories page
    // { href: '/about', label: 'About Us' },
  ];

  const secondaryNavItems = [
    { href: '/cart', label: 'Cart' },
    { href: '/checkout', label: 'Checkout' },
    // Simple link to admin, in a real app this would be conditional based on user role
    { href: '/admin', label: 'Admin' }, 
  ];
  
  const currentItemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
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
              {navItems.concat(secondaryNavItems).map((item) => ( // Combine nav items for mobile
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "hover:text-foreground",
                    pathname === item.href ? "text-foreground font-semibold" : "text-muted-foreground"
                  )}
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

        <Link href="/" className="hidden md:flex items-center gap-2">
          <Package2Icon className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">ShopWave</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                 "transition-colors hover:text-foreground",
                 pathname === item.href ? "text-foreground" : "text-foreground/70"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 w-36 md:w-48 lg:w-64 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          {secondaryNavItems.map((item) => (
             <Link
              key={item.href}
              href={item.href}
              className={cn(
                 "hidden md:block text-sm font-medium transition-colors hover:text-foreground",
                 pathname === item.href ? "text-foreground" : "text-foreground/70"
              )}
            >
              {item.label === 'Cart' ? (
                 <Button variant="outline" size="icon" className="relative h-9 w-9">
                  <ShoppingCart className="h-4 w-4" />
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
              ) : item.label}
            </Link>
          ))}
           {/* Mobile Cart Icon */}
           <Link href="/cart" passHref legacyBehavior>
            <Button variant="outline" size="icon" className="relative md:hidden h-9 w-9">
              <ShoppingCart className="h-4 w-4" />
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
          {/* User/Auth Icon - Placeholder */}
          {/* <Button variant="outline" size="icon" className="h-9 w-9">
            <UserCircle className="h-5 w-5" />
            <span className="sr-only">My Account</span>
          </Button> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
