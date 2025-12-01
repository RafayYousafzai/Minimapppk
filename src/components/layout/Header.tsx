"use client";

import React, { useState, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Input,
  Chip,
  Divider,
} from "@heroui/react";
import {
  ShoppingCart,
  Search,
  PackageSearch,
  Home,
  ListIcon,
  Menu,
  X,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  const { getItemCount, cartInitialized } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { href: "/products", label: "Collection", icon: <ListIcon className="w-4 h-4" /> },
    { href: "/track-order", label: "Track Order", icon: <PackageSearch className="w-4 h-4" /> },
  ];

  const currentItemCount = getItemCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchValue.trim();

    if (trimmedQuery) {
      router.push(`/products?search=${encodeURIComponent(trimmedQuery)}`);
    } else {
      if (pathname === "/products") {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete("search");
        router.push(`${pathname}?${newParams.toString()}`);
      } else {
        router.push("/products");
      }
    }

    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <Navbar
      isBordered={isScrolled}
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="xl"
      className={cn(
        "fixed top-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm py-2"
          : "bg-transparent border-transparent py-4"
      )}
      classNames={{
        wrapper: "px-4 md:px-8",
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          icon={isMenuOpen ? <X /> : <Menu />}
          className="text-foreground"
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <Link href="/" className="flex items-center gap-2">
          <NavbarBrand>
            <p className="font-bold text-2xl tracking-tighter text-inherit">Minimapppk</p>
          </NavbarBrand>
        </Link>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        <Link href="/" className="flex items-center mr-4">
          <NavbarBrand>
            <p className="font-bold text-2xl tracking-tighter text-inherit">Minimapppk</p>
          </NavbarBrand>
        </Link>

        {navItems.map((item) => (
          <NavbarItem key={item.href} isActive={pathname === item.href}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-4">
        <NavbarItem className="hidden lg:flex">
          <form onSubmit={handleSearch} className="relative">
            <Input
              placeholder="Search..."
              size="sm"
              startContent={<Search className="h-4 w-4 text-muted-foreground" />}
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              classNames={{
                input: "text-sm",
                inputWrapper: "bg-secondary/50 hover:bg-secondary/80 transition-colors rounded-full h-9 w-[200px] focus-within:w-[300px] transition-all duration-300",
              }}
              spellCheck={false}
            />
          </form>
        </NavbarItem>

        <NavbarItem>
          <ThemeToggle />
        </NavbarItem>

        <NavbarItem>
          <Button
            as={Link}
            href="/cart"
            isIconOnly
            variant="light"
            className="text-foreground relative overflow-visible hover:bg-secondary/50 rounded-full"
          >
            {cartInitialized && currentItemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold rounded-full shadow-sm animate-in zoom-in duration-300">
                {currentItemCount}
              </span>
            )}
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="bg-background/95 backdrop-blur-xl pt-8">
        <NavbarMenuItem className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              startContent={<Search className="h-4 w-4 text-muted-foreground" />}
              classNames={{
                inputWrapper: "bg-secondary/50 rounded-full",
              }}
              spellCheck={false}
            />
          </form>
        </NavbarMenuItem>
        
        {navItems.map((item, index) => (
          <NavbarMenuItem key={`${item.href}-${index}`} className="mb-4">
            <Link
              className={cn(
                "w-full flex items-center gap-4 text-lg font-medium p-2 rounded-lg transition-colors",
                pathname === item.href ? "bg-secondary text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="p-2 bg-background rounded-full shadow-sm">
                {item.icon}
              </span>
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
