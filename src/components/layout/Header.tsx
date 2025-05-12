"use client";

import React, { useState, useEffect } from "react";
import { Suspense } from "react"; // Add this import
import Link from "next/link";
import {
  ShoppingCart,
  Search,
  Menu,
  UserCircle,
  PackageSearch,
  Package2Icon as LogoIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// Create a separate component for the search params logic
function SearchParamsComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [inputValue, setInputValue] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    setInputValue(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = inputValue.trim();
    if (trimmedQuery) {
      router.push(`/products?search=${encodeURIComponent(trimmedQuery)}`);
    } else {
      if (pathname === "/products") {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete("search");
        router.push(`${pathname}?${newParams.toString()}`);
      } else {
        router.push("/products"); // Use router.push instead of pathname
      }
    }
  };

  return { inputValue, setInputValue, handleSearch };
}

const Header = () => {
  const { getItemCount, cartInitialized } = useCart();
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/track-order", label: "Track Order", icon: <PackageSearch /> },
  ];

  const secondaryNavItems = [
    { href: "/checkout", label: "Checkout" },
    { href: "/admin", label: "Admin" },
  ];

  const currentItemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="pt-12 bg-background text-foreground"
          >
            <nav className="grid gap-6 text-lg font-medium">
              <SheetClose asChild>
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold mb-4 text-primary"
                >
                  <LogoIcon className="h-6 w-6" />
                  <span className="font-bold">ShopWave</span>
                </Link>
              </SheetClose>
              {navItems.concat(secondaryNavItems).map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "hover:text-foreground flex items-center gap-2",
                      pathname === item.href
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.icon &&
                      React.cloneElement(item.icon as React.ReactElement<any>, {
                        className: "h-5 w-5",
                      })}
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
            <Suspense fallback={<div>Loading search...</div>}>
              <SearchForm />
            </Suspense>
          </SheetContent>
        </Sheet>

        <Link
          href="/"
          className="hidden md:flex items-center gap-2 text-primary-foreground"
        >
          <LogoIcon className="h-6 w-6" />
          <span className="text-xl font-bold">ShopWave</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-primary-foreground/80 flex items-center gap-1.5",
                pathname === item.href
                  ? "text-primary-foreground font-semibold"
                  : "text-primary-foreground/70"
              )}
            >
              {item.icon &&
                React.cloneElement(item.icon as React.ReactElement<any>, {
                  className: "h-4 w-4",
                })}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <Suspense
            fallback={
              <div className="w-36 md:w-48 lg:w-64 h-9 bg-background/20"></div>
            }
          >
            <DesktopSearchForm />
          </Suspense>
          {secondaryNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "hidden md:block text-sm font-medium transition-colors hover:text-primary-foreground/80",
                pathname === item.href
                  ? "text-primary-foreground font-semibold"
                  : "text-primary-foreground/70"
              )}
            >
              {item.label}
            </Link>
          ))}

          <Link href="/cart" passHref legacyBehavior>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
            >
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

// Mobile search form component
function SearchForm() {
  const { inputValue, setInputValue, handleSearch } = SearchParamsComponent();

  return (
    <form onSubmit={handleSearch} className="mt-6 flex gap-2">
      <Input
        type="search"
        placeholder="Search products..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="flex-1"
      />
      <SheetClose asChild>
        <Button type="submit" variant="outline" size="icon" aria-label="Search">
          <Search className="h-5 w-5" />
        </Button>
      </SheetClose>
    </form>
  );
}

// Desktop search form component
function DesktopSearchForm() {
  const { inputValue, setInputValue, handleSearch } = SearchParamsComponent();

  return (
    <form onSubmit={handleSearch} className="relative hidden sm:block">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        className="pl-10 w-36 md:w-48 lg:w-64 h-9 bg-background/20 text-primary-foreground placeholder:text-primary-foreground/60 border-primary-foreground/30 focus:bg-background/30"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </form>
  );
}

export default Header;
