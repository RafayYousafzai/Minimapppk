
"use client";

import type { ProductVariant } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface VariantSelectorProps {
  variant: ProductVariant;
  selectedValue: string | undefined;
  onValueChange: (value: string) => void;
  className?: string;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  variant,
  selectedValue,
  onValueChange,
  className,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium">{variant.type}</Label>
      <RadioGroup
        value={selectedValue}
        onValueChange={onValueChange}
        className="flex flex-wrap gap-2"
      >
        {variant.options.map((option) => (
          <div key={option.id}>
            <RadioGroupItem value={option.value} id={option.id} className="peer sr-only" />
            <Label
              htmlFor={option.id}
              className={cn(
                "flex items-center justify-center rounded-full border-2 border-muted bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary cursor-pointer"
              )}
            >
              {option.value}
              {option.additionalPrice && option.additionalPrice > 0 ? ` (+₨${option.additionalPrice.toFixed(2)})` : ''}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default VariantSelector;
