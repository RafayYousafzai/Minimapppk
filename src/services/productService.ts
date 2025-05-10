
// 'use server' // Keep this commented out for now, can be used if functions are called from Server Actions

import type { Product } from '@/lib/types';
import { db } from '@/lib/firebase/config';
import { collection, doc, getDoc, getDocs, writeBatch, query, where, limit, orderBy } from 'firebase/firestore';
import { mockProducts as productsToSeed } from '@/lib/mock-data'; // For seeding

const PRODUCTS_COLLECTION = 'products';

/**
 * Seeds the Firestore database with initial product data from mock-data.ts.
 * This function should be called manually once to populate the database.
 * For example, you could temporarily add a button in a development page:
 * 
 * import { seedProducts } from '@/services/productService';
 * // ...
 * <button onClick={async () => { await seedProducts(); alert('Products seeded!'); }}>Seed Products</button>
 */
export async function seedProducts(): Promise<void> {
  const batch = writeBatch(db);
  const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);

  // Check if products already exist to avoid duplicates (optional, simple check)
  const existingProductsSnapshot = await getDocs(query(productsCollectionRef, limit(1)));
  if (!existingProductsSnapshot.empty && productsToSeed.length > 0) {
    // Check if a product with the first ID already exists. If so, assume seeded.
    const firstProductCheck = await getDoc(doc(productsCollectionRef, productsToSeed[0].id));
    if (firstProductCheck.exists()) {
      console.log('Products collection already seems to contain data. Skipping seed.');
      return;
    }
  }
  
  productsToSeed.forEach((product) => {
    const docRef = doc(productsCollectionRef, product.id);
    // Ensure all fields are serializable and handle undefined values appropriately
    const productData = { ...product };
    // Firestore cannot store undefined values. Convert them to null or remove them.
    Object.keys(productData).forEach(key => {
      if (productData[key as keyof Product] === undefined) {
        delete productData[key as keyof Product];
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

export async function getAllProducts(): Promise<Product[]> {
  try {
    const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);
    const querySnapshot = await getDocs(productsCollectionRef);
    const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return products;
  } catch (error) {
    console.error('Error fetching all products:', error);
    return []; // Return empty array or throw error as per desired error handling
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
    // Example: order by rating (desc) and take top 'count'. 
    // You might need to create an index in Firestore for this query.
    const q = query(productsCollectionRef, orderBy('rating', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    // Fallback: get any 'count' products if specific query fails (e.g. due to missing index)
    try {
        const fallbackQuery = query(productsCollectionRef, limit(count));
        const fallbackSnapshot = await getDocs(fallbackQuery);
        if (!fallbackSnapshot.empty) return fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (fallbackError) {
        console.error('Error fetching fallback featured products:', fallbackError);
    }
    return [];
  }
}


export async function getAllCategories(): Promise<string[]> {
  try {
    const products = await getAllProducts();
    const categories = new Set(products.map(p => p.category));
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
      min: Math.floor(Math.min(...prices)), // Ensure integer values for slider if step is 1
      max: Math.ceil(Math.max(...prices)),   // Ensure integer values
    };
  } catch (error) {
    console.error('Error fetching price range:', error);
    return { min: 0, max: 1000 }; // Default fallback
  }
}
