
import { z } from 'zod';

export const variantOptionFormSchema = z.object({
  value: z.string().min(1, "Option value is required (e.g., S, Red)"),
  additionalPrice: z.coerce
    .number({ invalid_type_error: "Additional price must be a number" })
    .nonnegative("Additional price cannot be negative")
    .optional()
    .default(0),
});
export type VariantOptionFormData = z.infer<typeof variantOptionFormSchema>;

export const productVariantFormSchema = z.object({
  type: z.string().min(1, "Variant type is required (e.g., Size, Color)"),
  options: z.array(variantOptionFormSchema)
    .min(1, "At least one option is required for a variant type")
    .max(10, "A variant type cannot have more than 10 options"),
});
export type ProductVariantFormData = z.infer<typeof productVariantFormSchema>;

export const productFormSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters long."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  longDescription: z.string().optional(),
  images: z.array(z.object({ url: z.string().url("Each image must be a valid URL.") }))
    .min(1, "At least one image URL is required.")
    .max(5, "You can add a maximum of 5 images."),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be a positive number."),
  originalPrice: z.coerce
    .number({ invalid_type_error: "Original price must be a number" })
    .positive("Original price must be a positive number.")
    .optional()
    .nullable(),
  category: z.string().min(2, "Category must be at least 2 characters long."),
  stock: z.coerce
    .number({ invalid_type_error: "Stock must be a number" })
    .int("Stock must be a whole number.")
    .min(0, "Stock cannot be negative."),
  tags: z.string()
    .optional()
    .transform(val => val ? val.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : []),
  variants: z.array(productVariantFormSchema)
    .optional()
    .max(5, "You can add a maximum of 5 variant types."),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
