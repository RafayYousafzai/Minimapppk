
"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import StarRating from "@/components/ui/StarRating";
import {
  X,
  ListFilter,
  Sparkles,
  Filter,
  DollarSign,
  Star,
  Tag,
} from "lucide-react";
import * as productService from "@/services/productService";
import { ScrollArea } from "@/components/ui/scroll-area";
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
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onFilterChange,
  initialFilters,
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

  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
    setIsSheetOpen(false);
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
    setIsSheetOpen(false);
  };

  if (isLoading) {
    return (
      <div className="hidden lg:block lg:w-72 xl:w-80 space-y-6 p-6 bg-card border rounded-2xl shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-24" />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3 mb-6">
            <Skeleton className="h-6 w-1/2 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
          </div>
        ))}
        <Skeleton className="h-12 w-full mb-3 rounded-full" />
        <Skeleton className="h-12 w-full rounded-full" />
      </div>
    );
  }

  const filterContent = (
    <div className="space-y-8 p-1">
      {/* Categories Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
            <Tag className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Categories</h3>
        </div>
        <ScrollArea className="h-40">
          <div className="space-y-3">
            {availableCategories.map((category) => (
              <div
                key={category}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-secondary transition-colors group"
              >
                <Checkbox
                  id={`cat-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryChange(category)}
                />
                <Label
                  htmlFor={`cat-${category}`}
                  className="font-medium cursor-pointer text-foreground transition-colors flex-1"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="h-px bg-border"></div>

      {/* Price Range Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Price Range</h3>
        </div>
        <div className="bg-secondary p-4 rounded-xl space-y-4">
          <Slider
            min={globalMinPrice}
            max={globalMaxPrice}
            step={1}
            value={priceRange}
            onValueChange={(value) =>
              handlePriceChange(value as [number, number])
            }
            className="mb-3"
          />
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground font-medium mb-1 block">
                Min Price
              </Label>
              <Input
                type="number"
                value={priceRange[0]}
                onChange={handleMinPriceInputChange}
                placeholder={`$${globalMinPrice}`}
                className="text-sm rounded-xl"
                min={globalMinPrice}
                max={priceRange[1]}
              />
            </div>
            <div className="text-foreground font-bold mt-5">—</div>
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground font-medium mb-1 block">
                Max Price
              </Label>
              <Input
                type="number"
                value={priceRange[1]}
                onChange={handleMaxPriceInputChange}
                placeholder={`$${globalMaxPrice}`}
                className="text-sm rounded-xl"
                min={priceRange[0]}
                max={globalMaxPrice}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-border"></div>

      {/* Rating Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
            <Star className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Rating</h3>
        </div>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <Button
              key={rating}
              variant={minRating === rating ? "default" : "ghost"}
              onClick={() => handleRatingChange(rating)}
              className="w-full justify-start rounded-xl p-3 transition-all duration-300"
            >
              <StarRating rating={rating} size={16} />
              <span className="ml-2 text-sm font-medium">& Up</span>
              {minRating === rating && <Sparkles className="ml-auto w-4 h-4" />}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-px bg-border"></div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <Button
          onClick={applyFilters}
          className="w-full rounded-full py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Filter className="mr-2 h-5 w-5" />
          Apply Filters
        </Button>
        <Button
          onClick={clearFilters}
          variant="outline"
          className="w-full rounded-full py-6 text-lg font-semibold transition-all duration-300"
        >
          <X className="mr-2 h-5 w-5" />
          Clear All
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button and Sheet */}
      <div className="lg:hidden mb-6">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="default"
              className="w-full rounded-full py-6 text-lg font-semibold"
            >
              <ListFilter className="mr-2 h-5 w-5" />
              Filters & Sort
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[320px] sm:w-[400px] p-0 bg-card"
          >
            <SheetHeader className="p-6 border-b">
              <SheetTitle className="text-xl font-bold flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                Filter Products
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-100px)]">
              <div className="p-6">{filterContent}</div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:w-72 xl:w-80 p-6 bg-card border rounded-2xl shadow-lg transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg">
            <Filter className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Filters</h2>
        </div>
        {filterContent}
      </aside>
    </>
  );
};

export default FilterSidebar;
