
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import FilterSidebar from "@/components/products/FilterSidebar";
import * as productService from "@/services/productService";
import type { Product } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2, ListFilter } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const PRODUCTS_PER_PAGE = 8;

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [globalMinPrice, setGlobalMinPrice] = useState(0);
  const [globalMaxPrice, setGlobalMaxPrice] = useState(1000);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 1000] as [number, number],
    minRating: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Effect 1: Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const products = await productService.getAllProducts();
        setAllProducts(products);

        const priceRangeData = await productService.getPriceRange();
        setGlobalMinPrice(priceRangeData.min);
        setGlobalMaxPrice(priceRangeData.max);

        const currentUrlParams = new URLSearchParams(searchParams.toString());
        setSearchTerm(currentUrlParams.get("search") || "");
        setLocalSearchTerm(currentUrlParams.get("search") || "");
        setFilters({
          categories:
            currentUrlParams.get("categories")?.split(",").filter(Boolean) ||
            [],
          priceRange: [
            parseFloat(
              currentUrlParams.get("minPrice") || priceRangeData.min.toString()
            ),
            parseFloat(
              currentUrlParams.get("maxPrice") || priceRangeData.max.toString()
            ),
          ] as [number, number],
          minRating: parseInt(currentUrlParams.get("minRating") || "0", 10),
        });
        setCurrentPage(parseInt(currentUrlParams.get("page") || "1", 10));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  // Effect 2: Sync URL to state
  useEffect(() => {
    if (isLoading) return;

    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (filters.categories.length > 0)
      params.set("categories", filters.categories.join(","));
    if (filters.priceRange[0] !== globalMinPrice)
      params.set("minPrice", filters.priceRange[0].toString());
    if (filters.priceRange[1] !== globalMaxPrice)
      params.set("maxPrice", filters.priceRange[1].toString());
    if (filters.minRating > 0)
      params.set("minRating", filters.minRating.toString());
    if (currentPage > 1) params.set("page", currentPage.toString());

    const newQueryString = params.toString();
    const newPath = `/products${newQueryString ? `?${newQueryString}` : ""}`;

    if (window.location.pathname + window.location.search !== newPath) {
      router.push(newPath, { scroll: false });
    }
  }, [
    searchTerm,
    filters,
    currentPage,
    router,
    globalMinPrice,
    globalMaxPrice,
    isLoading,
  ]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchTerm(localSearchTerm);
    setCurrentPage(1);
  };

  const handleFilterChange = useCallback(
    (newFilters: {
      categories: string[];
      priceRange: [number, number];
      minRating: number;
    }) => {
      setFilters(newFilters);
      setCurrentPage(1);
      setIsFilterSheetOpen(false); // Close sheet on apply
    },
    []
  );

  const filteredProducts = useMemo(() => {
    if (isLoading || !allProducts) return [];
    return allProducts.filter((product) => {
      const searchMatch = searchTerm
        ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (product.tags &&
            product.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            ))
        : true;
      const categoryMatch =
        filters.categories.length > 0
          ? filters.categories.includes(product.category)
          : true;
      const priceMatch =
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1];
      const ratingMatch = product.rating >= filters.minRating;

      return searchMatch && categoryMatch && priceMatch && ratingMatch;
    });
  }, [searchTerm, filters, allProducts, isLoading]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="  px-4 flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block lg:w-72 xl:w-80 space-y-6 p-4">
          <Skeleton className="h-8 w-1/3 mb-4" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2 mb-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
        <div className="flex-1">
          <Skeleton className="h-10 w-full mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(PRODUCTS_PER_PAGE)].map((_, i) => (
              <Card key={i} className="flex flex-col h-full">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 flex-grow space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="p-4 pt-0">
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  const filterSidebarComponent = (
     <FilterSidebar
        onFilterChange={handleFilterChange}
        initialFilters={filters}
        key={`${globalMinPrice}-${globalMaxPrice}-${filters.categories.join(
          ","
        )}-${filters.minRating}-${filters.priceRange.join(",")}`}
      />
  );

  return (
    <div className=" px-4 flex flex-col lg:flex-row gap-8">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        {filterSidebarComponent}
      </div>

      <div className="flex-1">
        <div className="mb-6">
          <form
            onSubmit={handleSearchSubmit}
            className="flex gap-2 items-center"
          >
            <div className="relative flex-grow">
              <Input
                type="search"
                placeholder="Search products by name, description, or tags..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="pr-10"
                suppressHydrationWarning
              />
            </div>
            <Button
              type="submit"
              variant="outline"
              className="bg-primary hover:bg-accent/90 text-white"
            >
              <Search className="h-5 w-5 mr-0 md:mr-2" />
              <span className="hidden md:inline">Search</span>
            </Button>
          </form>
          
          {/* Mobile Filter Trigger */}
           <div className="lg:hidden mt-4">
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                <div className="flex items-center justify-between text-sm text-muted-foreground p-2 rounded-md hover:bg-secondary cursor-pointer">
                  <span>
                    Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
                    products.
                  </span>
                  <div className="flex items-center gap-1 font-medium text-foreground">
                    <ListFilter className="h-4 w-4" />
                    Filters
                  </div>
                </div>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-sm sm:max-w-md p-0">
                  {filterSidebarComponent}
              </SheetContent>
            </Sheet>
          </div>
          
           <p className="hidden lg:block text-sm text-muted-foreground mt-2">
            Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
            products.
          </p>

        </div>

        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No Products Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  totalPages <= 5 ||
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNum);
                        }}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
