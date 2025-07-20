"use client";

import React, { useState } from "react";
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
  Package2Icon as LogoIcon,
  Home,
  ListIcon,
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

  const navItems = [
    { href: "/", label: "Home", icon: <Home /> },
    { href: "/products", label: "Products", icon: <ListIcon /> },
    { href: "/track-order", label: "Track Order", icon: <PackageSearch /> },
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
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-background text-foreground border-b dark "
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="text-foreground"
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <Link href="/" className="flex items-center">
          <NavbarBrand>
            <p className="font-bold  text-xl text-inherit ml-2">Minimapppk</p>
          </NavbarBrand>
        </Link>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <Link href="/" className="flex items-center">
          <NavbarBrand className="mr-6">
            <p className="font-bold text-xl  text-inherit ml-2">Minimapppk</p>
          </NavbarBrand>
        </Link>

        {navItems.map((item) => (
          <NavbarItem key={item.href} isActive={pathname === item.href}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-1.5",
                pathname === item.href
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground/80"
              )}
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          <form onSubmit={handleSearch} className="flex items-center">
            <Input
              placeholder="Search..."
              color="secondary"
              size="sm"
              startContent={<Search className="h-4 w-4" />}
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              classNames={{
                inputWrapper:
                  "bg-secondary text-secondary-foreground rounded-lg",
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
            variant="ghost"
            className="text-foreground relative"
          >
            {cartInitialized && currentItemCount > 0 && (
              <Chip
                size="sm"
                color="danger"
                className="bg-primary text-primary-foreground rounded-full z-10 absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs"
              >
                {currentItemCount}
              </Chip>
            )}
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="bg-background/95 text-foreground">
        <NavbarMenuItem className="mt-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              variant="flat"
              color="secondary"
              classNames={{
                inputWrapper:
                  "bg-secondary text-secondary-foreground rounded-lg",
              }}
              spellCheck={false}
            />
            <Button type="submit" variant="flat" isIconOnly aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </NavbarMenuItem>
        <Divider className="my-2" />
        {[...navItems].map((item, index) => (
          <NavbarMenuItem key={`${item.href}-${index}`}>
            <Link
              className="w-full flex items-center gap-2 my-1"
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.icon &&
                React.cloneElement(item.icon as React.ReactElement<any>, {
                  className: "h-5 w-5",
                })}
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
