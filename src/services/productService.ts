
import type { Product, VariantOption } from '@/lib/types';
import type { ProductFormData } from '@/lib/productFormTypes';
import { db } from '@/lib/firebase/config';
import { collection, doc, getDoc, getDocs, writeBatch, query, where, limit, orderBy, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { mockProducts as productsToSeed } from '@/lib/mock-data'; 

const PRODUCTS_COLLECTION = 'products';

export async function seedProducts(): Promise<void> {
  const batch = writeBatch(db);
  const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);

  const existingProductsSnapshot = await getDocs(query(productsCollectionRef, limit(1)));
  if (!existingProductsSnapshot.empty && productsToSeed.length > 0) {
    const firstProductCheck = await getDoc(doc(productsCollectionRef, productsToSeed[0].id));
    if (firstProductCheck.exists()) {
      console.log('Products collection already seems to contain data. Skipping seed.');
      return;
    }
  }
  
  productsToSeed.forEach((product) => {
    const docRef = doc(productsCollectionRef, product.id);
    const productData = { ...product } as any; 
    Object.keys(productData).forEach(key => {
      if (productData[key] === undefined) {
        delete productData[key];
      }
    });
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
    
    const productToSave: Omit<Product, 'id' | 'rating' | 'reviews'> & { createdAt: any } = {
      name: data.name,
      description: data.description,
      longDescription: data.longDescription || '',
      images: data.images.map(img => img.url),
      price: data.price,
      originalPrice: data.originalPrice || undefined,
      category: data.category,
      stock: data.stock,
      tags: data.tags || [],
      rating: 0, // Default rating
      reviews: 0, // Default reviews
      variants: data.variants?.map(variant => ({
        type: variant.type,
        options: variant.options.map(option => ({
          // Generate a simple unique ID for options. For more robust needs, consider UUIDs or Firestore auto-IDs if options were subcollections.
          id: `${variant.type.toLowerCase().replace(/\s+/g, '-')}-${option.value.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 9)}`,
          value: option.value,
          additionalPrice: option.additionalPrice || 0,
        } as VariantOption)), 
      })) || [],
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(productsCollectionRef, productToSave);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Failed to add product.');
  }
}


export async function getAllProducts(): Promise<Product[]> {
  try {
    const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsCollectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      let createdAtDate = data.createdAt;
      if (data.createdAt && typeof data.createdAt.seconds === 'number') {
        createdAtDate = (data.createdAt as Timestamp).toDate();
      }
      return { 
        id: docSnap.id, 
        ...data,
        createdAt: createdAtDate, // Ensure it's a Date object if needed, or keep as Firestore Timestamp
      } as Product;
    });
    return products;
  } catch (error) {
    console.error('Error fetching all products:', error);
    return []; 
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
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
    const q = query(productsCollectionRef, where('category', '==', category));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
}


export async function getFeaturedProducts(count: number = 4): Promise<Product[]> {
   try {
    const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);
    // Attempt to order by rating if available, otherwise by creation date
    let q;
    try {
        q = query(productsCollectionRef, orderBy('rating', 'desc'), limit(count));
        const testSnapshot = await getDocs(q); // Test if ordering by rating works
         if (testSnapshot.empty && count > 0) { // If rating field doesn't exist or no products have it, try another way
            throw new Error("No products with rating, trying createdAt");
        }
    } catch (ratingOrderError) {
        // Fallback to ordering by 'createdAt' if 'rating' is not consistently available or causes error
        console.warn("Warning: Could not order by rating, falling back to createdAt for featured products.", ratingOrderError);
        q = query(productsCollectionRef, orderBy('createdAt', 'desc'), limit(count));
    }
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty && count > 0) { // If still empty, try fetching any 'count' products
        const fallbackQuery = query(productsCollectionRef, limit(count));
        const fallbackSnapshot = await getDocs(fallbackQuery);
        return fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    }
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}


export async function getAllCategories(): Promise<string[]> {
  try {
    const products = await getAllProducts();
    if (!products || products.length === 0) return [];
    const categories = new Set(products.map(p => p.category).filter(Boolean)); // filter(Boolean) removes undefined/null/empty strings
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
