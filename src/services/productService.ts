
import type { Product, VariantOption } from '@/lib/types';
import type { ProductFormData } from '@/lib/productFormTypes';
import { db } from '@/lib/firebase/config';
import { collection, doc, getDoc, getDocs, writeBatch, query, where, limit, orderBy, addDoc, serverTimestamp, Timestamp, updateDoc, FieldValue } from 'firebase/firestore';
import { mockProducts as productsToSeed } from '@/lib/mock-data'; 

const PRODUCTS_COLLECTION = 'products';

export async function seedProducts(): Promise<void> {
  const batch = writeBatch(db);
  const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);

  // Check if the first product from the seed list already exists to prevent re-seeding.
  // This is a simple check; more robust checks might involve checking all product IDs or a version flag.
  if (productsToSeed.length > 0) {
    const firstProductCheckRef = doc(productsCollectionRef, productsToSeed[0].id);
    const firstProductSnap = await getDoc(firstProductCheckRef);
    if (firstProductSnap.exists()) {
      console.log('Products collection already seems to contain data (found first mock product by ID). Skipping seed.');
      return;
    }
  } else {
    // If mockProducts is empty, check if the collection has any documents at all.
    const existingProductsSnapshot = await getDocs(query(productsCollectionRef, limit(1)));
    if (!existingProductsSnapshot.empty) {
      console.log('Products collection already contains data. Skipping seed.');
      return;
    }
  }
  
  productsToSeed.forEach((product) => {
    const docRef = doc(productsCollectionRef, product.id); // Use predefined ID for mock data
    const productData = { ...product } as any; 
    // Firestore doesn't like 'undefined' values, so remove them.
    Object.keys(productData).forEach(key => {
      if (productData[key] === undefined) {
        delete productData[key];
      }
    });
    // Add createdAt timestamp for new seed data
    if (!productData.createdAt) {
        productData.createdAt = serverTimestamp();
    }
    batch.set(docRef, productData);
  });

  try {
    await batch.commit();
    console.log('Products seeded successfully!');
  } catch (error) {
    console.error('Error seeding products:', error);
    throw new Error('Failed to seed products.');
  }
}

export async function addProduct(data: ProductFormData): Promise<string> {
  try {
    const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);
    
    // Ensure rating and reviews have default values
    const productToSave: Omit<Product, 'id'> & { createdAt: FieldValue, updatedAt?: FieldValue } = {
      name: data.name,
      description: data.description,
      longDescription: data.longDescription || '',
      images: data.images.map(img => img.url),
      price: data.price,
      originalPrice: data.originalPrice || undefined,
      category: data.category,
      stock: data.stock,
      tags: data.tags || [], // Assuming Zod transform handles string to array
      rating: 0, // Default rating for new products
      reviews: 0, // Default reviews for new products
      variants: data.variants?.map(variant => ({
        type: variant.type,
        options: variant.options.map(option => ({
          id: `${variant.type.toLowerCase().replace(/\s+/g, '-')}-${option.value.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 9)}`,
          value: option.value,
          additionalPrice: option.additionalPrice || 0,
        } as VariantOption)), 
      })) || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(productsCollectionRef, productToSave);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Failed to add product.');
  }
}

export async function updateProduct(productId: string, data: ProductFormData): Promise<void> {
  try {
    const productDocRef = doc(db, PRODUCTS_COLLECTION, productId);
    
    const productToUpdate: Partial<Omit<Product, 'id' | 'createdAt'>> & { updatedAt: FieldValue } = {
      name: data.name,
      description: data.description,
      longDescription: data.longDescription || '',
      images: data.images.map(img => img.url),
      price: data.price,
      originalPrice: data.originalPrice || undefined,
      category: data.category,
      stock: data.stock,
      tags: data.tags || [], // Assuming Zod transform handles string to array
      // Rating and reviews are typically not updated directly through this form
      variants: data.variants?.map(variant => ({
        type: variant.type,
        options: variant.options.map(option => ({
          // For existing options, you might want to preserve their IDs if they have them.
          // This simple update replaces all options. More complex logic needed to diff/merge.
          id: option.id || `${variant.type.toLowerCase().replace(/\s+/g, '-')}-${option.value.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 9)}`,
          value: option.value,
          additionalPrice: option.additionalPrice || 0,
        } as VariantOption)),
      })) || [],
      updatedAt: serverTimestamp(),
    };
    
    // Remove undefined fields before updating
    Object.keys(productToUpdate).forEach(key => {
        if (productToUpdate[key as keyof typeof productToUpdate] === undefined) {
            delete productToUpdate[key as keyof typeof productToUpdate];
        }
    });

    await updateDoc(productDocRef, productToUpdate);
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    throw new Error('Failed to update product.');
  }
}


export async function getAllProducts(): Promise<Product[]> {
  try {
    const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);
    // Order by 'createdAt' descending by default. If 'createdAt' doesn't exist on some docs, they might appear last or cause errors.
    // Ensure 'createdAt' is consistently populated, e.g., via serverTimestamp() on add.
    const q = query(productsCollectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      // Convert Firestore Timestamp to Date object for easier handling in client components if necessary
      let createdAtDate = data.createdAt;
      if (data.createdAt && typeof data.createdAt.seconds === 'number') {
        createdAtDate = (data.createdAt as Timestamp).toDate();
      }
      let updatedAtDate = data.updatedAt;
       if (data.updatedAt && typeof data.updatedAt.seconds === 'number') {
        updatedAtDate = (data.updatedAt as Timestamp).toDate();
      }
      return { 
        id: docSnap.id, 
        ...data,
        createdAt: createdAtDate,
        updatedAt: updatedAtDate,
      } as Product;
    });
    return products;
  } catch (error) {
    console.error('Error fetching all products:', error);
    // Check if the error is due to missing 'createdAt' field for ordering
    if (error instanceof Error && error.message.includes("firestore/indexes")) {
        console.warn("Firestore index for ordering by 'createdAt' might be missing. Please check your Firebase console.");
    }
    return []; 
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      let createdAtDate = data.createdAt;
      if (data.createdAt && typeof data.createdAt.seconds === 'number') {
        createdAtDate = (data.createdAt as Timestamp).toDate();
      }
      let updatedAtDate = data.updatedAt;
       if (data.updatedAt && typeof data.updatedAt.seconds === 'number') {
        updatedAtDate = (data.updatedAt as Timestamp).toDate();
      }
      return { 
          id: docSnap.id, 
          ...data,
          createdAt: createdAtDate,
          updatedAt: updatedAtDate,
        } as Product;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching product by ID ${id}:`, error);
    return null;
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsCollectionRef, where('category', '==', category), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      let createdAtDate = data.createdAt;
      if (data.createdAt && typeof data.createdAt.seconds === 'number') {
        createdAtDate = (data.createdAt as Timestamp).toDate();
      }
      let updatedAtDate = data.updatedAt;
      if (data.updatedAt && typeof data.updatedAt.seconds === 'number') {
        updatedAtDate = (data.updatedAt as Timestamp).toDate();
      }
      return { 
          id: docSnap.id, 
          ...data,
          createdAt: createdAtDate,
          updatedAt: updatedAtDate,
        } as Product;
    });
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
}


export async function getFeaturedProducts(count: number = 4): Promise<Product[]> {
   try {
    const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);
    let q;
    // Try ordering by rating. If 'rating' field is not indexed or doesn't exist on all docs, this might fail.
    // Firestore requires an index for queries with orderBy and range/equality filters on different fields.
    // For simplicity, we'll try rating, then fall back.
    try {
        q = query(productsCollectionRef, orderBy('rating', 'desc'), limit(count));
        const testSnapshot = await getDocs(q); 
         if (testSnapshot.empty && count > 0) {
            // If no products have 'rating' or 'rating' field doesn't exist widely
            console.warn("No products found when ordering by rating for featured products. Falling back.");
            throw new Error("No products with rating, trying createdAt or general limit.");
        }
    } catch (ratingOrderError) {
        console.warn("Warning: Could not order by rating for featured products, falling back to createdAt.", ratingOrderError);
        q = query(productsCollectionRef, orderBy('createdAt', 'desc'), limit(count));
    }
    
    const querySnapshot = await getDocs(q);
    // If still empty after trying rating and createdAt, fetch any 'count' products.
    if (querySnapshot.empty && count > 0) {
        console.warn("No products found with rating or createdAt ordering. Fetching any products.");
        const fallbackQuery = query(productsCollectionRef, limit(count));
        const fallbackSnapshot = await getDocs(fallbackQuery);
        return fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    }
    return querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      let createdAtDate = data.createdAt;
      if (data.createdAt && typeof data.createdAt.seconds === 'number') {
        createdAtDate = (data.createdAt as Timestamp).toDate();
      }
      let updatedAtDate = data.updatedAt;
      if (data.updatedAt && typeof data.updatedAt.seconds === 'number') {
        updatedAtDate = (data.updatedAt as Timestamp).toDate();
      }
      return { 
          id: docSnap.id, 
          ...data,
          createdAt: createdAtDate,
          updatedAt: updatedAtDate,
        } as Product;
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}


export async function getAllCategories(): Promise<string[]> {
  try {
    const products = await getAllProducts();
    if (!products || products.length === 0) return [];
    const categories = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(categories);
  } catch (error) {
    console.error('Error fetching all categories:', error);
    return [];
  }
}

export async function getPriceRange(): Promise<{ min: number; max: number }> {
  try {
    const products = await getAllProducts();
    if (products.length === 0) return { min: 0, max: 0 };
    const prices = products.map(p => p.price);
    return {
      min: Math.floor(Math.min(...prices)), 
      max: Math.ceil(Math.max(...prices)),   
    };
  } catch (error) {
    console.error('Error fetching price range:', error);
    return { min: 0, max: 1000 }; 
  }
}
