"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import FilterSidebar from "@/components/products/FilterSidebar";
import * as productService from "@/services/productService";
import type { ProductFilters } from "@/services/productService";
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
import type { QueryDocumentSnapshot } from "firebase/firestore";

const PRODUCTS_PER_PAGE = 8;

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Server-side paginated products
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [globalMinPrice, setGlobalMinPrice] = useState(0);
  const [globalMaxPrice, setGlobalMaxPrice] = useState(1000);

  // Pagination cursors for each page (for cursor-based pagination)
  const pageCursors = useRef<Map<number, QueryDocumentSnapshot | null>>(
    new Map()
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 1000] as [number, number],
    minRating: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  // Build filters object for API calls
  const buildFilters = useCallback((): ProductFilters => {
    const apiFilters: ProductFilters = {};
    if (filters.categories.length > 0) {
      apiFilters.categories = filters.categories;
    }
    if (filters.priceRange[0] !== globalMinPrice) {
      apiFilters.minPrice = filters.priceRange[0];
    }
    if (filters.priceRange[1] !== globalMaxPrice) {
      apiFilters.maxPrice = filters.priceRange[1];
    }
    if (filters.minRating > 0) {
      apiFilters.minRating = filters.minRating;
    }
    if (searchTerm) {
      apiFilters.search = searchTerm;
    }
    return apiFilters;
  }, [filters, globalMinPrice, globalMaxPrice, searchTerm]);

  // Effect 1: Fetch initial price range data (optimized - only 2 reads)
  useEffect(() => {
    const fetchPriceRange = async () => {
      const priceRangeData = await productService.getPriceRangeOptimized();
      setGlobalMinPrice(priceRangeData.min);
      setGlobalMaxPrice(priceRangeData.max);
    };
    fetchPriceRange();
  }, []);

  // Effect 2: Sync URL to state (Filters) - runs once after price range is loaded
  useEffect(() => {
    const currentUrlParams = new URLSearchParams(searchParams.toString());
    setSearchTerm(currentUrlParams.get("search") || "");
    setLocalSearchTerm(currentUrlParams.get("search") || "");

    setFilters({
      categories:
        currentUrlParams.get("categories")?.split(",").filter(Boolean) || [],
      priceRange: [
        parseFloat(
          currentUrlParams.get("minPrice") || globalMinPrice.toString()
        ),
        parseFloat(
          currentUrlParams.get("maxPrice") || globalMaxPrice.toString()
        ),
      ] as [number, number],
      minRating: parseInt(currentUrlParams.get("minRating") || "0", 10),
    });
    setCurrentPage(parseInt(currentUrlParams.get("page") || "1", 10));
  }, [searchParams, globalMinPrice, globalMaxPrice]);

  // Effect 3: Fetch products when filters or page changes (SERVER-SIDE PAGINATION)
  useEffect(() => {
    const fetchProducts = async () => {
      if (currentPage === 1) {
        setIsLoading(true);
      } else {
        setIsPageLoading(true);
      }

      try {
        const apiFilters = buildFilters();

        // Get cursor for current page (null for page 1)
        const cursor =
          currentPage > 1
            ? pageCursors.current.get(currentPage - 1) || null
            : null;

        // Fetch products for this page
        const result = await productService.getProductsPaginated(
          PRODUCTS_PER_PAGE,
          cursor,
          apiFilters
        );

        setProducts(result.products);
        setHasMore(result.hasMore);

        // Store cursor for next page
        if (result.lastDoc) {
          pageCursors.current.set(currentPage, result.lastDoc);
        }

        // Get total count for pagination UI (only on first page or filter change)
        if (currentPage === 1) {
          const count = await productService.getProductCount(apiFilters);
          setTotalCount(count);
        }
      } finally {
        setIsLoading(false);
        setIsPageLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, filters, searchTerm, buildFilters]);

  // Effect 4: Sync state to URL
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
    // Clear page cursors when search changes
    pageCursors.current.clear();
  };

  const handleFilterChange = useCallback(
    (newFilters: {
      categories: string[];
      priceRange: [number, number];
      minRating: number;
    }) => {
      setFilters(newFilters);
      setCurrentPage(1);
      // Clear page cursors when filters change
      pageCursors.current.clear();
      setIsFilterSheetOpen(false); // Close sheet on apply
    },
    []
  );

  // Calculate total pages from server count
  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-12">
        <div className="hidden lg:block lg:w-80 space-y-6 p-4">
          <Skeleton className="h-8 w-1/3 mb-4 rounded-lg" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3 mb-6">
              <Skeleton className="h-5 w-1/2 rounded-md" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          ))}
        </div>
        <div className="flex-1">
          <Skeleton className="h-12 w-full max-w-2xl mb-8 rounded-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(PRODUCTS_PER_PAGE)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-3xl overflow-hidden h-full flex flex-col border border-border/40"
              >
                <Skeleton className="aspect-[4/5] w-full" />
                <div className="p-5 space-y-4 flex-grow">
                  <Skeleton className="h-3 w-1/3 rounded-full" />
                  <Skeleton className="h-6 w-3/4 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-2/3 rounded-md" />
                  </div>
                  <div className="pt-4 mt-auto flex justify-between items-center border-t border-border/40">
                    <Skeleton className="h-8 w-24 rounded-lg" />
                    <Skeleton className="h-4 w-12 rounded-full" />
                  </div>
                </div>
              </div>
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
      paginatedProducts={products}
      filteredProducts={products}
      totalCount={totalCount}
    />
  );

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-12">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">{filterSidebarComponent}</div>

      <div className="flex-1">
        <div className="mb-6">
          <form
            onSubmit={handleSearchSubmit}
            className="flex gap-2 items-center"
          >
            <div className="relative flex-grow max-w-2xl">
              <Input
                type="search"
                placeholder="Search products..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="pr-12 h-12 rounded-full border-none bg-secondary/20 focus-visible:ring-1 focus-visible:ring-primary shadow-sm text-base"
                suppressHydrationWarning
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </form>

          {/* Mobile Filter Trigger */}
          <div className="lg:hidden mt-4">{filterSidebarComponent}</div>

          <p className="hidden lg:block text-sm text-muted-foreground mt-2">
            {isPageLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </span>
            ) : (
              <>
                Showing {products.length} of {totalCount} products.
              </>
            )}
          </p>
        </div>

        {isPageLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product: Product) => (
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
