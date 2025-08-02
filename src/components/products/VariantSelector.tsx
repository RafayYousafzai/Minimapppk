"use client";

import type { ProductVariant, VariantOption } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface VariantSelectorProps {
  variant: ProductVariant;
  selectedOptionValue: string | undefined;
  onOptionSelect: (variantType: string, optionValue: string) => void;
  className?: string;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  variant,
  selectedOptionValue,
  onOptionSelect,
  className,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium">{variant.type}</Label>
      <div className="flex flex-wrap gap-2">
        {variant.options.map((option) => (
          <Button
            key={option.id}
            type="button" // Fix: Specify button type to prevent form submission behavior
            variant={selectedOptionValue === option.value ? 'default' : 'outline'}
            onClick={() => onOptionSelect(variant.type, option.value)}
            className={cn(
              "rounded-full px-4 py-2 text-sm",
              {
                "border-primary ring-2 ring-primary": selectedOptionValue === option.value,
              }
            )}
            aria-pressed={selectedOptionValue === option.value}
          >
            {option.value}
            {option.additionalPrice && option.additionalPrice > 0 ? ` (+$${option.additionalPrice.toFixed(2)})` : ''}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default VariantSelector;
