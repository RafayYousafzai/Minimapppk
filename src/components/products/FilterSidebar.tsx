
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import StarRating from '@/components/ui/StarRating';
import { X, ListFilter, Loader2 } from 'lucide-react';
import * as productService from '@/services/productService'; // Updated import
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';


interface FilterSidebarProps {
  onFilterChange: (filters: {
    categories: string[];
    priceRange: [number, number];
    minRating: number;
  }) => void;
  initialFilters: { // These are the URL-derived or parent-driven initial/current filters
    categories: string[];
    priceRange: [number, number];
    minRating: number;
  };
}


const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange, initialFilters }) => {
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [globalMinPrice, setGlobalMinPrice] = useState(0);
  const [globalMaxPrice, setGlobalMaxPrice] = useState(1000);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.categories);
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters.priceRange);
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

      // Ensure initialFilters.priceRange is within fetched global bounds
      const initialMin = Math.max(priceRangeData.min, initialFilters.priceRange[0]);
      const initialMax = Math.min(priceRangeData.max, initialFilters.priceRange[1]);
      
      setPriceRange([initialMin, initialMax]);
      setSelectedCategories(initialFilters.categories);
      setMinRating(initialFilters.minRating);

      setIsLoading(false);
    };
    fetchFilterData();
  }, []); // Fetch on mount

   // Effect to sync local state if initialFilters prop changes (e.g. from URL popstate)
  useEffect(() => {
    if (!isLoading) { // Only sync after initial data load
        setSelectedCategories(initialFilters.categories);
        // Ensure the price range from props is within the global bounds
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
  
  const handleMinPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseFloat(e.target.value);
    if (!isNaN(newMin) && newMin <= priceRange[1] && newMin >= globalMinPrice) {
      setPriceRange([newMin, priceRange[1]]);
    } else if (e.target.value === '') {
       setPriceRange([globalMinPrice, priceRange[1]]);
    }
  };

  const handleMaxPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseFloat(e.target.value);
    if (!isNaN(newMax) && newMax >= priceRange[0] && newMax <= globalMaxPrice) {
      setPriceRange([priceRange[0], newMax]);
    } else if (e.target.value === '') {
       setPriceRange([priceRange[0], globalMaxPrice]);
    }
  };

  const handleRatingChange = (rating: number) => {
    setMinRating(minRating === rating ? 0 : rating); 
  };

  const applyFilters = () => {
    onFilterChange({
      categories: selectedCategories,
      priceRange: [Math.max(globalMinPrice, priceRange[0]), Math.min(globalMaxPrice, priceRange[1])], // Ensure within global bounds
      minRating,
    });
    setIsSheetOpen(false); 
  };
  
  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([globalMinPrice, globalMaxPrice]);
    setMinRating(0);
    onFilterChange({ // Notify parent to clear filters
      categories: [],
      priceRange: [globalMinPrice, globalMaxPrice],
      minRating: 0,
    });
     setIsSheetOpen(false);
  };

  if (isLoading) {
    return (
        <div className="hidden lg:block lg:w-72 xl:w-80 space-y-6 p-4 border rounded-lg shadow-sm bg-card">
            <Skeleton className="h-8 w-1/3 mb-4" />
            {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2 mb-6">
                    <Skeleton className="h-6 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4 mb-1" />
                </div>
            ))}
             <Skeleton className="h-10 w-full mb-2" />
             <Skeleton className="h-10 w-full" />
        </div>
    );
  }


  const filterContent = (
    <div className="space-y-6 p-1">
      <div>
        <h3 className="text-lg font-semibold mb-3">Category</h3>
        <ScrollArea className="h-40">
          <div className="space-y-2">
            {availableCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`cat-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryChange(category)}
                />
                <Label htmlFor={`cat-${category}`} className="font-normal cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-3">Price Range</h3>
        <Slider
          min={globalMinPrice}
          max={globalMaxPrice}
          step={1} // Assuming prices are integers or step is small enough
          value={priceRange} // Use local priceRange state
          onValueChange={(value) => handlePriceChange(value as [number, number])}
          className="mb-3"
        />
        <div className="flex justify-between items-center gap-2">
          <Input
            type="number"
            value={priceRange[0]}
            onChange={handleMinPriceInputChange}
            placeholder={`Min ($${globalMinPrice})`}
            className="w-full text-sm"
            min={globalMinPrice}
            max={priceRange[1]}
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            value={priceRange[1]}
            onChange={handleMaxPriceInputChange}
            placeholder={`Max ($${globalMaxPrice})`}
            className="w-full text-sm"
            min={priceRange[0]}
            max={globalMaxPrice}
          />
        </div>
      </div>
      
      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-3">Rating</h3>
        <div className="space-y-1">
          {[4, 3, 2, 1].map((rating) => (
            <Button
              key={rating}
              variant={minRating === rating ? 'secondary' : 'ghost'}
              onClick={() => handleRatingChange(rating)}
              className="w-full justify-start"
            >
              <StarRating rating={rating} totalStars={rating} size={18} />
              <span className="ml-2 text-sm">& Up</span>
            </Button>
          ))}
        </div>
      </div>
      
      <Separator />

      <div className="space-y-2 pt-4">
        <Button onClick={applyFilters} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Apply Filters</Button>
        <Button onClick={clearFilters} variant="outline" className="w-full">
          Clear Filters <X className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button and Sheet */}
      <div className="lg:hidden mb-4">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <ListFilter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Filter Products</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-80px)]"> {/* Adjust height */}
              <div className="p-4">{filterContent}</div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:w-72 xl:w-80 p-4 border rounded-lg shadow-sm bg-card">
         <h2 className="text-xl font-bold mb-4">Filters</h2>
        <ScrollArea className="h-[calc(100vh-220px)] pr-3"> {/* Adjust height as needed */}
         {filterContent}
        </ScrollArea>
      </aside>
    </>
  );
};

export default FilterSidebar;
