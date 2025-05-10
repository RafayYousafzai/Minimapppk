
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import FilterSidebar from '@/components/products/FilterSidebar';
import * as productService from '@/services/productService'; // Updated import
import type { Product } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Loader2 } from 'lucide-react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

const PRODUCTS_PER_PAGE = 8;

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [globalMinPrice, setGlobalMinPrice] = useState(0);
  const [globalMaxPrice, setGlobalMaxPrice] = useState(1000);


  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [localSearchTerm, setLocalSearchTerm] = useState(searchParams.get('search') || '');
  
  const [filters, setFilters] = useState(() => {
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
    // Prices and rating will be initialized after fetching price range
    return {
      categories,
      priceRange: [globalMinPrice, globalMaxPrice] as [number, number],
      minRating: parseInt(searchParams.get('minRating') || '0', 10),
    };
  });
  
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const products = await productService.getAllProducts();
      setAllProducts(products);
      
      const priceRangeData = await productService.getPriceRange();
      setGlobalMinPrice(priceRangeData.min);
      setGlobalMaxPrice(priceRangeData.max);

      // Initialize filters with actual price range after fetching
      setFilters(prevFilters => ({
        ...prevFilters,
        priceRange: [
            parseFloat(searchParams.get('minPrice') || priceRangeData.min.toString()),
            parseFloat(searchParams.get('maxPrice') || priceRangeData.max.toString())
        ] as [number, number],
      }));
      setIsLoading(false);
    };
    fetchData();
  }, []); // Fetch initial data on mount


  // Update URL when filters, searchTerm, or page change
  useEffect(() => {
    if (isLoading) return; // Don't update URL while initial data is loading

    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (filters.categories.length > 0) params.set('categories', filters.categories.join(','));
    if (filters.priceRange[0] !== globalMinPrice) params.set('minPrice', filters.priceRange[0].toString());
    if (filters.priceRange[1] !== globalMaxPrice) params.set('maxPrice', filters.priceRange[1].toString());
    if (filters.minRating > 0) params.set('minRating', filters.minRating.toString());
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    const currentPath = window.location.pathname + window.location.search;
    const newPath = `/products?${params.toString()}`;
    if (currentPath !== newPath) {
       window.history.pushState({}, '', newPath);
    }
  }, [searchTerm, filters, currentPage, router, globalMinPrice, globalMaxPrice, isLoading]);


  // Update state from URL on mount and back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      if (isLoading) return; // Don't process popstate if initial data isn't loaded yet
      const params = new URLSearchParams(window.location.search);
      setSearchTerm(params.get('search') || '');
      setLocalSearchTerm(params.get('search') || '');
      setFilters({
        categories: params.get('categories')?.split(',').filter(Boolean) || [],
        priceRange: [
          parseFloat(params.get('minPrice') || globalMinPrice.toString()),
          parseFloat(params.get('maxPrice') || globalMaxPrice.toString())
        ] as [number, number],
        minRating: parseInt(params.get('minRating') || '0', 10),
      });
      setCurrentPage(parseInt(params.get('page') || '1', 10));
    };

    // Initial load sync with URL (after data is fetched)
    if (!isLoading) {
        handlePopState();
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isLoading, globalMinPrice, globalMaxPrice]);


  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchTerm(localSearchTerm);
    setCurrentPage(1);
  };
  
  const clearSearch = () => {
    setLocalSearchTerm('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleFilterChange = useCallback((newFilters: {
    categories: string[];
    priceRange: [number, number];
    minRating: number;
  }) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);


  const filteredProducts = useMemo(() => {
    if (isLoading) return [];
    return allProducts.filter((product) => {
      const searchMatch = searchTerm
        ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
        : true;
      const categoryMatch =
        filters.categories.length > 0
          ? filters.categories.includes(product.category)
          : true;
      const priceMatch =
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
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
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  if (isLoading) {
    return (
        <div className="flex flex-col lg:flex-row gap-8">
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


  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <FilterSidebar 
        onFilterChange={handleFilterChange} 
        initialFilters={{ // Pass current filters based on fetched price range
            categories: filters.categories,
            priceRange: filters.priceRange,
            minRating: filters.minRating,
        }}
        key={`${globalMinPrice}-${globalMaxPrice}`} // Re-mount FilterSidebar if global price range changes
       />
      <div className="flex-1">
        <div className="mb-6">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 items-center">
            <div className="relative flex-grow">
              <Input
                type="search"
                placeholder="Search products by name, description, or tags..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="pr-10"
              />
              {localSearchTerm && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button type="submit" variant="outline" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Search className="h-5 w-5 mr-0 md:mr-2" />
              <span className="hidden md:inline">Search</span>
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-2">
            Showing {paginatedProducts.length} of {filteredProducts.length} products.
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
                  onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (totalPages <= 5 || 
                    pageNum === 1 || 
                    pageNum === totalPages || 
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => { e.preventDefault(); handlePageChange(pageNum); }}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if ((pageNum === currentPage - 2 && pageNum > 1) || (pageNum === currentPage + 2 && pageNum < totalPages)) {
                  return <PaginationEllipsis key={`ellipsis-${pageNum}`} />;
                }
                return null;
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}

