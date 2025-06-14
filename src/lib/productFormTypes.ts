
import { z } from 'zod';

export const variantOptionFormSchema = z.object({
  id: z.string().optional(), // Optional ID, useful for preserving IDs during edit
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
    .max(5, "You can add a maximum of 5 images.")
    .optional(), // Optional at the schema level, checked in onSubmit
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be a positive number."),
  originalPrice: z
    .string() // Treat input as string initially
    .optional()
    .nullable() // Allow null from initial data or form state
    .transform((val, ctx) => {
      if (val === null || val === undefined || val.trim() === "") {
        return undefined; // Explicitly return undefined if empty/null, making it optional
      }
      const num = parseFloat(val.trim());
      if (isNaN(num)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Original price must be a valid number if provided.",
        });
        return z.NEVER; // Tell Zod to stop processing if invalid
      }
      if (num <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Original price must be a positive number.",
        });
        return z.NEVER;
      }
      return num;
    })
    .optional(), // Ensures the result of the transform can be undefined
  category: z.string().min(2, "Category must be at least 2 characters long."),
  stock: z.coerce
    .number({ invalid_type_error: "Stock must be a number" })
    .int("Stock must be a whole number.")
    .min(0, "Stock cannot be negative."),
  tags: z.string()
    .optional()
    .transform(val => val ? val.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : []),
  variants: z.array(productVariantFormSchema)
    .max(5, "You can add a maximum of 5 variant types.")
    .optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
