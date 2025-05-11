
"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormSchema, type ProductFormData, type ProductVariantFormData, type VariantOptionFormData } from "@/lib/productFormTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addProduct } from "@/services/productService";
import { useRouter } from "next/navigation";
import { useState } from "react";
// Combobox (if available and chosen) or Select for categories
// For now, using simple input for category

interface ProductFormProps {
  initialData?: ProductFormData; // For editing later
  existingCategories: string[];
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, existingCategories }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      longDescription: "",
      images: [{ url: "" }],
      price: 0,
      originalPrice: undefined,
      category: "",
      stock: 0,
      tags: "", // Will be transformed to array by Zod schema
      variants: [],
    },
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  async function onSubmit(data: ProductFormData) {
    setIsSubmitting(true);
    try {
      // console.log("Form Data to submit:", data); // Log data before sending
      // const transformedData = {
      //   ...data,
      //   tags: typeof data.tags === 'string' ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : (data.tags || []),
      // };
      // console.log("Transformed Data for addProduct:", transformedData);

      const productId = await addProduct(data); // Zod transform handles tags
      toast({
        title: "Product Added",
        description: `Product "${data.name}" (ID: ${productId}) has been successfully added.`,
      });
      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to add product:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the main details for your product.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl><Input placeholder="e.g., Classic Tee" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description *</FormLabel>
                  <FormControl><Textarea placeholder="A brief summary of the product." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Long Description (Optional)</FormLabel>
                  <FormControl><Textarea placeholder="Detailed information about the product." {...field} rows={5} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <CardDescription>Add URLs for your product images. The first image will be the primary one.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {imageFields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`images.${index}.url`}
                render={({ field: imgField }) => (
                  <FormItem>
                    <FormLabel>Image URL {index + 1} *</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl><Input placeholder="https://example.com/image.jpg" {...imgField} /></FormControl>
                      {imageFields.length > 1 && (
                        <Button type="button" variant="outline" size="icon" onClick={() => removeImage(index)} aria-label="Remove image URL">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            {imageFields.length < 5 && (
                 <Button type="button" variant="outline" onClick={() => appendImage({ url: "" })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Image URL
                </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (₨) *</FormLabel>
                  <FormControl><Input type="number" step="0.01" placeholder="e.g., 25.99" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="originalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original Price (₨) (Optional)</FormLabel>
                  <FormControl><Input type="number" step="0.01" placeholder="e.g., 29.99 (for sales)" {...field} value={field.value ?? ""} /></FormControl>
                  <FormDescription>If set, this price will be shown crossed out.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <FormControl><Input placeholder="e.g., Apparel, Electronics" {...field} /></FormControl>
                   <FormDescription>Type a new category or an existing one. Categories are case-sensitive.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity *</FormLabel>
                  <FormControl><Input type="number" step="1" placeholder="e.g., 100" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (Optional)</FormLabel>
                  <FormControl><Input placeholder="e.g., t-shirt, cotton, casual (comma-separated)" {...field} /></FormControl>
                  <FormDescription>Comma-separated list of tags.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Product Variants (Optional)</CardTitle>
            <CardDescription>Add options like size or color. Each variant type can have multiple options.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {variantFields.map((variantField, variantIndex) => (
              <Card key={variantField.id} className="p-4 bg-muted/30">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">Variant Type {variantIndex + 1}</h4>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(variantIndex)} aria-label="Remove variant type">
                    <XCircle className="h-5 w-5 text-destructive" />
                  </Button>
                </div>
                <FormField
                  control={form.control}
                  name={`variants.${variantIndex}.type`}
                  render={({ field }) => (
                    <FormItem className="mb-3">
                      <FormLabel>Type Name *</FormLabel>
                      <FormControl><Input placeholder="e.g., Size, Color" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormLabel className="block mb-1 text-sm font-medium">Options *</FormLabel>
                <OptionsFieldArray control={form.control} variantIndex={variantIndex} />
              </Card>
            ))}
            {variantFields.length < 5 && (
                <Button type="button" variant="outline" onClick={() => appendVariant({ type: "", options: [{ value: "", additionalPrice: 0 }] })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Variant Type
                </Button>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/products')} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
            {isSubmitting ? 'Saving...' : (initialData ? 'Save Changes' : 'Add Product')}
          </Button>
        </div>
      </form>
    </Form>
  );
};


// Nested Field Array for Variant Options
interface OptionsFieldArrayProps {
  control: any; // Control<ProductFormData>
  variantIndex: number;
}

const OptionsFieldArray: React.FC<OptionsFieldArrayProps> = ({ control, variantIndex }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${variantIndex}.options` as const, // Ensure name is correctly typed
  });

  return (
    <div className="space-y-3">
      {fields.map((optionField, optionIndex) => (
        <div key={optionField.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start p-3 border rounded-md bg-background">
          <FormField
            control={control}
            name={`variants.${variantIndex}.options.${optionIndex}.value`}
            render={({ field }) => (
              <FormItem className="md:col-span-1">
                <FormLabel className="text-xs">Option Value *</FormLabel>
                <FormControl><Input placeholder="e.g., S, M, Red" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`variants.${variantIndex}.options.${optionIndex}.additionalPrice`}
            render={({ field }) => (
              <FormItem className="md:col-span-1">
                <FormLabel className="text-xs">Additional Price (₨)</FormLabel>
                <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:col-span-1 flex items-end h-full">
            {fields.length > 1 && (
                 <Button type="button" variant="ghost" size="sm" onClick={() => remove(optionIndex)} className="mt-auto text-destructive hover:bg-destructive/10" aria-label="Remove option">
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                </Button>
            )}
          </div>
        </div>
      ))}
       {fields.length < 10 && (
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ value: "", additionalPrice: 0 } as VariantOptionFormData)}
                className="mt-2"
                >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Option
            </Button>
        )}
    </div>
  );
};

export default ProductForm;
