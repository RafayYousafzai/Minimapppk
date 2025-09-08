"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import StarRating from "@/components/ui/StarRating";
import { X, Filter, DollarSign, Star, Tag, ListFilter } from "lucide-react";
import * as productService from "@/services/productService";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "../ui/skeleton";

interface FilterSidebarProps {
  onFilterChange: (filters: {
    categories: string[];
    priceRange: [number, number];
    minRating: number;
  }) => void;
  initialFilters: {
    categories: string[];
    priceRange: [number, number];
    minRating: number;
  };
  paginatedProducts: any[];
  filteredProducts: any[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onFilterChange,
  initialFilters,
  paginatedProducts,
  filteredProducts,
}) => {
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [globalMinPrice, setGlobalMinPrice] = useState(0);
  const [globalMaxPrice, setGlobalMaxPrice] = useState(1000);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialFilters.categories
  );
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialFilters.priceRange
  );
  const [minRating, setMinRating] = useState<number>(initialFilters.minRating);

  useEffect(() => {
    const fetchFilterData = async () => {
      setIsLoading(true);
      const [categories, priceRangeData] = await Promise.all([
        productService.getAllCategories(),
        productService.getPriceRange(),
      ]);
      setAvailableCategories(categories);
      setGlobalMinPrice(priceRangeData.min);
      setGlobalMaxPrice(priceRangeData.max);

      const initialMin = Math.max(
        priceRangeData.min,
        initialFilters.priceRange[0]
      );
      const initialMax = Math.min(
        priceRangeData.max,
        initialFilters.priceRange[1]
      );

      setPriceRange([initialMin, initialMax]);
      setSelectedCategories(initialFilters.categories);
      setMinRating(initialFilters.minRating);

      setIsLoading(false);
    };
    fetchFilterData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setSelectedCategories(initialFilters.categories);
      const newMin = Math.max(globalMinPrice, initialFilters.priceRange[0]);
      const newMax = Math.min(globalMaxPrice, initialFilters.priceRange[1]);
      setPriceRange([newMin, newMax]);
      setMinRating(initialFilters.minRating);
    }
  }, [initialFilters, isLoading, globalMinPrice, globalMaxPrice]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
  };

  const handleMinPriceInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newMin = Number.parseFloat(e.target.value);
    if (!isNaN(newMin) && newMin <= priceRange[1] && newMin >= globalMinPrice) {
      setPriceRange([newMin, priceRange[1]]);
    } else if (e.target.value === "") {
      setPriceRange([globalMinPrice, priceRange[1]]);
    }
  };

  const handleMaxPriceInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newMax = Number.parseFloat(e.target.value);
    if (!isNaN(newMax) && newMax >= priceRange[0] && newMax <= globalMaxPrice) {
      setPriceRange([priceRange[0], newMax]);
    } else if (e.target.value === "") {
      setPriceRange([priceRange[0], globalMaxPrice]);
    }
  };

  const handleRatingChange = (rating: number) => {
    setMinRating(minRating === rating ? 0 : rating);
  };

  const applyFilters = () => {
    onFilterChange({
      categories: selectedCategories,
      priceRange: [
        Math.max(globalMinPrice, priceRange[0]),
        Math.min(globalMaxPrice, priceRange[1]),
      ],
      minRating,
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([globalMinPrice, globalMaxPrice]);
    setMinRating(0);
    onFilterChange({
      categories: [],
      priceRange: [globalMinPrice, globalMaxPrice],
      minRating: 0,
    });
  };

  if (isLoading) {
    return (
      <div className="w-full lg:w-80 space-y-4 p-4 bg-card border rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-6 w-20" />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  const filterContent = (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b lg:border-none">
        <Filter className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Filters</h2>
      </div>

      {/* Content - Single scrollable area instead of nested ones */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Categories Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium">Categories</h3>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {availableCategories.map((category) => (
              <div
                key={category}
                className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={`cat-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryChange(category)}
                />
                <Label
                  htmlFor={`cat-${category}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          {/* Price Range Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-medium">Price Range</h3>
            </div>
            <div className="space-y-4">
              <Slider
                min={globalMinPrice}
                max={globalMaxPrice}
                step={1}
                value={priceRange}
                onValueChange={(value) =>
                  handlePriceChange(value as [number, number])
                }
              />
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Min</Label>
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={handleMinPriceInputChange}
                    className="text-sm h-8"
                    min={globalMinPrice}
                    max={priceRange[1]}
                  />
                </div>
                <span className="text-muted-foreground mt-4">—</span>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Max</Label>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={handleMaxPriceInputChange}
                    className="text-sm h-8"
                    min={priceRange[0]}
                    max={globalMaxPrice}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          {/* Rating Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-medium">Rating</h3>
            </div>
            <div className="space-y-1">
              {[4, 3, 2, 1].map((rating) => (
                <Button
                  key={rating}
                  variant={minRating === rating ? "default" : "ghost"}
                  onClick={() => handleRatingChange(rating)}
                  className="w-full justify-start h-8 text-sm"
                  size="sm"
                >
                  <StarRating rating={rating} size={14} />
                  <span className="ml-2">& Up</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t mt-auto space-y-2">
        <Button onClick={applyFilters} className="w-full h-9" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
        <Button
          onClick={clearFilters}
          variant="outline"
          className="w-full h-9 bg-transparent"
          size="sm"
        >
          <X className="mr-2 h-4 w-4" />
          Clear All
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden">
        <Sheet>
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
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            {filterContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                    <SheetTrigger asChild>
                      <div className="flex items-center justify-between text-sm text-muted-foreground p-2 rounded-md hover:bg-secondary cursor-pointer">
                        <span>
                          Showing {paginatedProducts.length} of{" "}
                          {filteredProducts.length} products.
                        </span>
                        <div className="flex items-center gap-1 font-medium text-foreground">
                          <ListFilter className="h-4 w-4" />
                          Filters
                        </div>
                      </div>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <SheetHeader className="sr-only">
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      {filterSidebarComponent}
                    </SheetContent>
                  </Sheet> */}

      <aside className="hidden lg:block w-80 bg-card border rounded-lg h-fit sticky top-4">
        {filterContent}
      </aside>
    </>
  );
};

export default FilterSidebar;
