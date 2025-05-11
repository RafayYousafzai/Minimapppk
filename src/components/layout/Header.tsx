
"use client";

import React, { useState, useEffect } from 'react'; // Added React import
import Link from 'next/link';
import { ShoppingCart, Search, Menu, UserCircle, PackageSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useRouter, useSearchParams, usePathname } from 'next/navigation'; 
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// Re-added Package2Icon as it's used in the header
const Package2Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>
);


const Header = () => {
  const { getItemCount, cartInitialized } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname(); 
  
  const initialSearchFromParams = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearchFromParams);
  
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    // Only update searchQuery from params if not on products page or if it's an initial load on products page
     if (pathname !== '/products' || (pathname === '/products' && searchQuery !== (searchParams.get('search') || ''))) {
      setSearchQuery(searchParams.get('search') || '');
    }
  }, [searchParams, pathname, searchQuery]);


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
    { href: '/track-order', label: 'Track Order', icon: <PackageSearch/> },
  ];

  const secondaryNavItems = [
    { href: '/checkout', label: 'Checkout' },
    { href: '/admin', label: 'Admin' }, 
  ];
  
  const currentItemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pt-12 bg-background text-foreground"> {/* Mobile sheet keeps original background */}
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold mb-4 text-primary" // Primary color for logo in sheet
                onClick={() => setIsSheetOpen(false)}
              >
                <Package2Icon className="h-6 w-6" />
                <span className="font-bold">ShopWave</span>
              </Link>
              {navItems.concat(secondaryNavItems).map((item) => ( 
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "hover:text-foreground flex items-center gap-2", 
                    pathname === item.href ? "text-foreground font-semibold" : "text-muted-foreground"
                  )}
                  onClick={() => setIsSheetOpen(false)}
                >
                  {item.icon && React.cloneElement(item.icon as React.ReactElement<any>, { className: "h-5 w-5"})}
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

        <Link href="/" className="hidden md:flex items-center gap-2 text-primary-foreground">
          <Package2Icon className="h-6 w-6" />
          <span className="text-xl font-bold">ShopWave</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                 "transition-colors hover:text-primary-foreground/80 flex items-center gap-1.5",
                 pathname === item.href ? "text-primary-foreground font-semibold" : "text-primary-foreground/70"
              )}
            >
              {item.icon && React.cloneElement(item.icon as React.ReactElement<any>, { className: "h-4 w-4"})}
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
              className="pl-10 w-36 md:w-48 lg:w-64 h-9 bg-background/20 text-primary-foreground placeholder:text-primary-foreground/60 border-primary-foreground/30 focus:bg-background/30" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          {secondaryNavItems.map((item) => (
             <Link
              key={item.href}
              href={item.href}
              className={cn(
                 "hidden md:block text-sm font-medium transition-colors hover:text-primary-foreground/80",
                 pathname === item.href ? "text-primary-foreground font-semibold" : "text-primary-foreground/70"
              )}
            >
             {item.label}
            </Link>
          ))}
           
           <Link href="/cart" passHref legacyBehavior>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
              <ShoppingCart className="h-5 w-5" />
              {cartInitialized && currentItemCount > 0 && (
                <Badge
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
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
