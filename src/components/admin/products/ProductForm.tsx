
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
import { PlusCircle, Trash2, XCircle, UploadCloud, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addProduct, updateProduct, uploadProductImage, deleteProductImageByUrl } from "@/services/productService";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import type { Product } from "@/lib/types";
import Image from "next/image";

interface ProductFormProps {
  initialData?: Product;
  existingCategories: string[];
  productId?: string;
}

const transformProductToFormData = (product: Product): ProductFormData => {
  return {
    name: product.name,
    description: product.description,
    longDescription: product.longDescription || "",
    images: product.images.map(url => ({ url })), // Stays as URL for form data
    price: product.price,
    originalPrice: product.originalPrice ?? undefined,
    category: product.category,
    stock: product.stock,
    tags: product.tags ? product.tags.join(', ') : "",
    variants: product.variants?.map(v => ({
      type: v.type,
      options: v.options.map(o => ({
        id: o.id,
        value: o.value,
        additionalPrice: o.additionalPrice || 0,
      })),
    })) || [],
  };
};

const ProductForm: React.FC<ProductFormProps> = ({ initialData, existingCategories, productId }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(initialData?.images || []);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); 
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]); 

  const formDefaultValues = initialData 
    ? transformProductToFormData(initialData) 
    : {
        name: "", description: "", longDescription: "", images: [], 
        price: 0, originalPrice: undefined, category: "", stock: 0, tags: "", variants: [],
      };

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: formDefaultValues,
  });

  useEffect(() => {
    if (initialData) {
      form.reset(transformProductToFormData(initialData));
      setExistingImageUrls(initialData.images || []);
      setNewImageFiles([]);
      setImagePreviews([]);
      setImagesToRemove([]);
    } else {
      form.reset(formDefaultValues);
      setExistingImageUrls([]);
      setNewImageFiles([]);
      setImagePreviews([]);
      setImagesToRemove([]);
    }
  }, [initialData, form]);

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const currentTotalImages = existingImageUrls.length - imagesToRemove.length + newImageFiles.length + filesArray.length;
      if (currentTotalImages > 5) {
        toast({ title: "Image Limit", description: "You can upload a maximum of 5 images.", variant: "destructive" });
        if (fileInputRef.current) fileInputRef.current.value = ""; 
        return;
      }
      setNewImageFiles(prev => [...prev, ...filesArray]);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeNewImage = (index: number) => {
    const previewToRemove = imagePreviews[index];
    if (previewToRemove) URL.revokeObjectURL(previewToRemove);
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = ""; 
  };

  const removeExistingImage = (url: string) => {
    setExistingImageUrls(prev => prev.filter(imgUrl => imgUrl !== url));
    setImagesToRemove(prev => [...prev, url]); 
  };
  
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  async function onSubmit(data: ProductFormData) {
    console.log("onSubmit triggered. Data:", JSON.parse(JSON.stringify(data)));
    console.log("Current newImageFiles:", newImageFiles.map(f => f.name));
    console.log("Current existingImageUrls:", existingImageUrls);
    console.log("Current imagesToRemove:", imagesToRemove);

    setIsSubmitting(true);
    console.log("isSubmitting set to true");

    let finalImageUrls: { url: string }[] = existingImageUrls
        .filter(url => !imagesToRemove.includes(url))
        .map(url => ({ url }));
    console.log("Initial finalImageUrls (from existing):", finalImageUrls);

    try {
      console.log("Attempting to process images and save product...");
      const uploadedUrls: string[] = [];
      if (newImageFiles.length > 0) {
        console.log(`Uploading ${newImageFiles.length} new images...`);
        toast({ title: "Uploading Images...", description: `Please wait while ${newImageFiles.length} images are uploaded.`});
        for (const file of newImageFiles) {
          const imageIdForPath = productId || data.name.replace(/\s+/g, '-').toLowerCase() + '-' + Date.now();
          console.log(`Uploading file: ${file.name} to path group: ${imageIdForPath}`);
          const url = await uploadProductImage(file, imageIdForPath, file.name);
          uploadedUrls.push(url);
          console.log(`Uploaded ${file.name} to URL: ${url}`);
        }
        finalImageUrls = [...finalImageUrls, ...uploadedUrls.map(url => ({ url }))];
        console.log("finalImageUrls after new uploads:", finalImageUrls);
      }
      
      if (finalImageUrls.length === 0 && data.images.length === 0 ) { // Check if images array in data is also empty, as Zod validates data.images
          console.error("No images provided or selected for the product. finalImageUrls is empty and data.images is empty.");
          toast({
              title: "Image Required",
              description: "Please upload or ensure at least one image is present for the product.",
              variant: "destructive",
          });
          setIsSubmitting(false); 
          return; 
      }

      const productPayload = { ...data, images: finalImageUrls, tags: data.tags };
      // Ensure data.tags which is already string[] from Zod transform is used.
      console.log("Product payload to be saved:", JSON.parse(JSON.stringify(productPayload)));

      if (productId && initialData) {
        console.log(`Updating product with ID: ${productId}`);
        for (const urlToRemove of imagesToRemove) {
            console.log(`Attempting to delete image from storage: ${urlToRemove}`);
            await deleteProductImageByUrl(urlToRemove);
        }
        await updateProduct(productId, productPayload);
        toast({ title: "Product Updated", description: `Product "${data.name}" has been successfully updated.` });
        console.log("Product updated successfully.");
      } else {
        console.log("Adding new product...");
        const newProdId = await addProduct(productPayload);
        toast({ title: "Product Added", description: `Product "${data.name}" (ID: ${newProdId}) has been successfully added.`});
        console.log(`Product added successfully with ID: ${newProdId}`);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Failed to save product in onSubmit:", error);
      toast({
        title: "Error Saving Product",
        description: error instanceof Error ? error.message : `Could not ${productId ? 'update' : 'add'} product. Please try again.`,
        variant: "destructive",
      });
    } finally {
      console.log("onSubmit finally block. Setting isSubmitting to false.");
      setIsSubmitting(false);
    }
  }

  // For debugging validation errors:
  // console.log("Form errors:", form.formState.errors);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle><CardDescription>Enter the main details for your product.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Product Name *</FormLabel><FormControl><Input placeholder="e.g., Classic Tee" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Short Description *</FormLabel><FormControl><Textarea placeholder="A brief summary of the product." {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="longDescription" render={({ field }) => (<FormItem><FormLabel>Long Description (Optional)</FormLabel><FormControl><Textarea placeholder="Detailed information about the product." {...field} value={field.value ?? ""} rows={5} /></FormControl><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Product Images</CardTitle><CardDescription>Upload up to 5 images. The first image will be the primary one.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="images" // This field is for Zod validation of the final image URL array
              render={({ fieldState }) => ( // We don't render field directly, but use fieldState for errors
                <>
                  <FormItem>
                    <FormLabel htmlFor="image-upload" className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:text-primary">
                      <UploadCloud className="h-5 w-5" /> Select Images to Upload
                    </FormLabel>
                    <FormControl>
                      <Input 
                          id="image-upload" 
                          type="file" 
                          accept="image/*" 
                          multiple 
                          onChange={handleFileChange} 
                          ref={fileInputRef}
                          className="hidden"
                          disabled={isSubmitting || (existingImageUrls.length - imagesToRemove.length + newImageFiles.length >= 5)}
                      />
                    </FormControl>
                    <FormDescription>
                      Max 5 images. Accepted formats: JPG, PNG, WebP. Max 2MB per image recommended.
                    </FormDescription>
                     {/* Display general 'images' field errors here, like min/max items */}
                    {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                  </FormItem>
                </>
              )}
            />

            {(existingImageUrls.length > 0 || newImageFiles.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                {existingImageUrls.map((url, index) => (
                  !imagesToRemove.includes(url) && (
                    <div key={`existing-${index}`} className="relative group aspect-square">
                      <Image src={url} alt={`Existing image ${index + 1}`} fill className="object-cover rounded-md border" data-ai-hint="product form image"/>
                      <Button type="button" variant="destructive" size="icon" onClick={() => removeExistingImage(url)} className="absolute top-1 right-1 h-6 w-6 opacity-70 group-hover:opacity-100 transition-opacity" aria-label="Remove existing image">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )
                ))}
                {newImageFiles.map((file, index) => (
                  <div key={`new-${index}`} className="relative group aspect-square">
                    <Image src={imagePreviews[index]} alt={`New image ${index + 1} preview`} fill className="object-cover rounded-md border" data-ai-hint="product form image preview"/>
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 h-6 w-6 opacity-70 group-hover:opacity-100 transition-opacity" aria-label="Remove new image">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {isSubmitting && newImageFiles.length > 0 && (
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading images...
                 </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pricing & Inventory</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Price (₨) *</FormLabel><FormControl><Input type="number" step="0.01" placeholder="e.g., 25.99" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="originalPrice" render={({ field }) => (<FormItem><FormLabel>Original Price (₨) (Optional)</FormLabel><FormControl><Input type="number" step="0.01" placeholder="e.g., 29.99 (for sales)" {...field} value={field.value ?? ""} /></FormControl><FormDescription>If set, this price will be shown crossed out.</FormDescription><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="category" render={({ field }) => (<FormItem><FormLabel>Category *</FormLabel><FormControl><Input placeholder="e.g., Apparel, Electronics" {...field} /></FormControl><FormDescription>Type a new category or an existing one. Categories are case-sensitive.</FormDescription><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="stock" render={({ field }) => (<FormItem><FormLabel>Stock Quantity *</FormLabel><FormControl><Input type="number" step="1" placeholder="e.g., 100" {...field} /></FormControl><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Organization</CardTitle></CardHeader>
          <CardContent>
            <FormField control={form.control} name="tags" render={({ field }) => (<FormItem><FormLabel>Tags (Optional)</FormLabel><FormControl><Input placeholder="e.g., t-shirt, cotton, casual (comma-separated)" {...field} /></FormControl><FormDescription>Comma-separated list of tags.</FormDescription><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle>Product Variants (Optional)</CardTitle><CardDescription>Add options like size or color. Each variant type can have multiple options.</CardDescription></CardHeader>
          <CardContent className="space-y-6">
            {variantFields.map((variantField, variantIndex) => (
              <Card key={variantField.id} className="p-4 bg-muted/30">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">Variant Type {variantIndex + 1}</h4>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(variantIndex)} aria-label="Remove variant type"><XCircle className="h-5 w-5 text-destructive" /></Button>
                </div>
                <FormField control={form.control} name={`variants.${variantIndex}.type`} render={({ field }) => (<FormItem className="mb-3"><FormLabel>Type Name *</FormLabel><FormControl><Input placeholder="e.g., Size, Color" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormLabel className="block mb-1 text-sm font-medium">Options *</FormLabel>
                <OptionsFieldArray control={form.control} variantIndex={variantIndex} />
              </Card>
            ))}
            {variantFields.length < 5 && (<Button type="button" variant="outline" onClick={() => appendVariant({ type: "", options: [{ value: "", additionalPrice: 0 }] })}><PlusCircle className="mr-2 h-4 w-4" /> Add Variant Type</Button>)}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/products')} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : (productId ? 'Save Changes' : 'Add Product')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

interface OptionsFieldArrayProps {
  control: any; // Type for useForm's control
  variantIndex: number;
}

const OptionsFieldArray: React.FC<OptionsFieldArrayProps> = ({ control, variantIndex }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${variantIndex}.options` as const, 
  });

  return (
    <div className="space-y-3">
      {fields.map((optionField, optionIndex) => (
        <div key={optionField.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start p-3 border rounded-md bg-background">
          <Controller name={`variants.${variantIndex}.options.${optionIndex}.id`} control={control} render={({ field }) => <input type="hidden" {...field} />} />
          <FormField control={control} name={`variants.${variantIndex}.options.${optionIndex}.value`} render={({ field }) => (<FormItem className="md:col-span-1"><FormLabel className="text-xs">Option Value *</FormLabel><FormControl><Input placeholder="e.g., S, M, Red" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={control} name={`variants.${variantIndex}.options.${optionIndex}.additionalPrice`} render={({ field }) => (<FormItem className="md:col-span-1"><FormLabel className="text-xs">Additional Price (₨)</FormLabel><FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <div className="md:col-span-1 flex items-end h-full">
            {fields.length > 1 && (<Button type="button" variant="ghost" size="sm" onClick={() => remove(optionIndex)} className="mt-auto text-destructive hover:bg-destructive/10" aria-label="Remove option"><Trash2 className="h-4 w-4 mr-1" /> Remove</Button>)}
          </div>
        </div>
      ))}
      {fields.length < 10 && (<Button type="button" variant="outline" size="sm" onClick={() => append({ id: '', value: "", additionalPrice: 0 } as VariantOptionFormData & {id?: string})} className="mt-2"><PlusCircle className="mr-2 h-4 w-4" /> Add Option</Button>)}
    </div>
  );
};

export default ProductForm;

