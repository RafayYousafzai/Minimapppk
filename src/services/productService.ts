
import type { Product, VariantOption, Review } from '@/lib/types';
import type { ProductFormData } from '@/lib/productFormTypes';
import type { ReviewFormData } from '@/lib/reviewFormSchema';
import { db, storage } from '@/lib/firebase/config'; // Import storage
import { 
  collection, doc, getDoc, getDocs, writeBatch, query, where, 
  limit as firestoreLimit, orderBy, addDoc, serverTimestamp, 
  Timestamp, updateDoc, FieldValue, collectionGroup, 
  limit
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"; // Firebase Storage functions
import { mockProducts as productsToSeed } from '@/lib/mock-data'; 

const PRODUCTS_COLLECTION = 'products';
const REVIEWS_SUBCOLLECTION = 'reviews';

// Function to upload an image to Firebase Storage
export async function uploadProductImage(file: File, productIdOrTempId: string, fileName: string): Promise<string> {
  // Use a more specific path, e.g., products/<productId>/<fileName>
  // Or for new products before ID is known: product_images/temp/<tempId>/<fileName>
  // For simplicity, using a general path with timestamp to avoid collisions if tempId is not robust
  const filePath = `product_images/${productIdOrTempId}/${Date.now()}_${fileName}`;
  const storageRef = ref(storage, filePath);
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image: ", error);
    throw new Error(`Failed to upload image ${fileName}`);
  }
}

// Function to delete an image from Firebase Storage by its URL
export async function deleteProductImageByUrl(imageUrl: string): Promise<void> {
  if (!imageUrl.startsWith('https://firebasestorage.googleapis.com')) {
    console.warn(`Skipping deletion of non-Firebase Storage URL: ${imageUrl}`);
    return;
  }
  try {
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
    console.log(`Image deleted from Storage: ${imageUrl}`);
  } catch (error) {
    // It's common for delete to fail if the file doesn't exist, which might be fine.
    // You might want to specifically check for 'storage/object-not-found' error code.
    if ((error as any)?.code !== 'storage/object-not-found') {
        console.error(`Error deleting image from Storage (${imageUrl}):`, error);
        // Optionally re-throw if it's not a "not found" error
        // throw new Error(`Failed to delete image ${imageUrl} from Storage.`);
    } else {
        console.log(`Image not found in Storage, presumed already deleted: ${imageUrl}`);
    }
  }
}


export async function seedProducts(): Promise<void> {
  console.log('🚦 Starting product seeding process...');

  // 1. First verify database connection
  if (!db) {
    const errorMsg = 'Firestore database instance is not available';
    console.error('❌', errorMsg);
    throw new Error(errorMsg);
  }

  const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);
  console.log('🔗 Connected to Firestore collection:', PRODUCTS_COLLECTION);

  // 2. Generate mock products (using your working format)
  const productsToSeed = generateMockProducts(100); // Start with small batch for testing
  console.log(`🛠 Generated ${productsToSeed.length} mock products`);

  // 3. Enhanced existence check
  try {
    console.log('🔍 Checking for existing products...');
    const existingSnapshot = await getDocs(query(productsCollectionRef, limit(1)));
    
    if (!existingSnapshot.empty) {
      let seeded = false;
      
      if (productsToSeed.length > 0) {
        console.log('🔎 Verifying against first mock product...');
        const firstProductCheckRef = doc(productsCollectionRef, productsToSeed[0].id);
        const firstProductSnap = await getDoc(firstProductCheckRef);
        
        if (firstProductSnap.exists()) {
          seeded = true;
          console.log('✅ Found first mock product - collection already seeded');
        } else {
          console.log('🆕 First mock product not found - proceeding with seed');
        }
      }
      
      if (seeded || (!productsToSeed.length && !existingSnapshot.empty)) {
        console.log('⏩ Skipping seeding - products already exist');
        return;
      }
    }
  } catch (error) {
    console.error('⚠️ Error checking existing products:', error);
    throw error;
  }

  // 4. Prepare batch with enhanced logging
  const batch = writeBatch(db);
  console.log('✏️ Preparing write batch...');

  productsToSeed.forEach((product) => {
    const docRef = doc(productsCollectionRef, product.id);
    const productData = { ...product };
    
    // Clean undefined fields
    Object.keys(productData).forEach(key => {
      if (productData[key] === undefined) {
        delete productData[key];
      }
    });

    // Ensure timestamp
    if (!productData.createdAt) {
      productData.createdAt = serverTimestamp();
    }

    console.log(`📝 Adding product to batch: ${product.id} (${product.name})`);
    batch.set(docRef, productData);
  });

  // 5. Commit with timeout safeguard
  try {
    console.log('🚀 Attempting to commit batch...');
    await batch.commit();
    console.log('🎉 Products seeded successfully!');
    
    // Verification step
    console.log('🔍 Verifying seeded products...');
    const verificationSnapshot = await getDocs(query(productsCollectionRef, where('name', '==', productsToSeed[0].name)));
    console.log(`✅ Verification: Found ${verificationSnapshot.size} matching products`);
    
  } catch (error) {
    console.error('❌ Batch commit failed:', error);
    
    // Enhanced error diagnostics
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        code: (error as any).code // Firebase error code if available
      });
    }
    
    throw new Error(`Failed to seed products: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper function to generate products in your working format
function generateMockProducts(count: number) {
  const baseImageUrl = `https://picsum.photos/1000/1000?random=${Math.floor(Math.random() * 10000)}`

  return Array.from({ length: count }, (_, i) => ({
    id: `product-${i + 1}`,
    name: `Product ${i + 1}`,
    description: `Description ${i + 1}`,
    longDescription: `Long description ${i + 1}`,
    images: [`${baseImageUrl}mock-${i + 1}.png?alt=media`],
    price: 20 + (i * 5),
    originalPrice: 25 + (i * 5),
    category: ['Electronics', 'Clothing', 'Home'][i % 3],
    stock: 10 + i,
    tags: ['tag1', 'tag2', 'tag3'],
    rating: 0,
    reviews: 0,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  }));
}

export async function addProduct(data: ProductFormData): Promise<string> {
  try {
    const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);
    
    const productToSave: Omit<Product, 'id'> & { createdAt: FieldValue, updatedAt?: FieldValue } = {
      name: data.name,
      description: data.description,
      longDescription: data.longDescription || '',
      images: data.images.map(img => img.url), // Expects URLs from ProductForm after upload
      price: data.price,
      originalPrice: data.originalPrice || undefined,
      category: data.category,
      stock: data.stock,
      tags: data.tags || [],
      rating: 0, 
      reviews: 0, 
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
      images: data.images.map(img => img.url), // Expects URLs from ProductForm after upload/management
      price: data.price,
      originalPrice: data.originalPrice || undefined,
      category: data.category,
      stock: data.stock,
      tags: data.tags || [],
      variants: data.variants?.map(variant => ({
        type: variant.type,
        options: variant.options.map(option => ({
          id: option.id || `${variant.type.toLowerCase().replace(/\s+/g, '-')}-${option.value.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 9)}`,
          value: option.value,
          additionalPrice: option.additionalPrice || 0,
        } as VariantOption)),
      })) || [],
      updatedAt: serverTimestamp(),
    };
    
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
    const q = query(productsCollectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(docSnap => {
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
    return products;
  } catch (error) {
    console.error('Error fetching all products:', error);
    if (error instanceof Error && error.message.includes("firestore/indexes")) {
        console.warn("Firestore index for ordering by 'createdAt' might be missing. Please check your Firebase console.");
    } else if (error instanceof Error && error.message.includes("INVALID_ARGUMENT")) {
        console.error("Firebase Firestore Error: INVALID_ARGUMENT. This often means your Firestore Project ID is not correctly configured in .env or your Firestore rules are denying access. Ensure NEXT_PUBLIC_FIREBASE_PROJECT_ID is set and matches your project in the Firebase console, and that Firestore is in Native mode.");
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
    try {
        q = query(productsCollectionRef, orderBy('rating', 'desc'), firestoreLimit(count));
        const testSnapshot = await getDocs(q); 
         if (testSnapshot.empty && count > 0) {
            console.warn("No products found when ordering by rating for featured products. Falling back.");
            throw new Error("No products with rating, trying createdAt or general limit.");
        }
    } catch (ratingOrderError) {
        console.warn("Warning: Could not order by rating for featured products, falling back to createdAt.", ratingOrderError);
        q = query(productsCollectionRef, orderBy('createdAt', 'desc'), firestoreLimit(count));
    }
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty && count > 0) {
        console.warn("No products found with rating or createdAt ordering. Fetching any products.");
        const fallbackQuery = query(productsCollectionRef, firestoreLimit(count));
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

// --- Review Functions ---

export async function addReview(productId: string, reviewData: ReviewFormData): Promise<string> {
  try {
    const reviewCollectionRef = collection(db, PRODUCTS_COLLECTION, productId, REVIEWS_SUBCOLLECTION);
    const newReview: Omit<Review, 'id' | 'productId' | 'createdAt'> & { createdAt: FieldValue } = {
      reviewerName: reviewData.reviewerName,
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(reviewCollectionRef, newReview);
    // TODO: Update product's average rating and review count using a Transaction or Cloud Function.
    return docRef.id;
  } catch (error) {
    console.error(`Error adding review for product ${productId}:`, error);
    throw new Error('Failed to add review.');
  }
}

export async function getReviewsByProductId(productId: string): Promise<Review[]> {
  try {
    const reviewsCollectionRef = collection(db, PRODUCTS_COLLECTION, productId, REVIEWS_SUBCOLLECTION);
    const q = query(reviewsCollectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      let createdAtDate = data.createdAt;
      if (data.createdAt && typeof data.createdAt.seconds === 'number') {
        createdAtDate = (data.createdAt as Timestamp).toDate();
      }
      return {
        id: docSnap.id,
        productId: productId,
        ...data,
        createdAt: createdAtDate,
      } as Review;
    });
  } catch (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    return [];
  }
}

export async function getRecentReviews(count: number): Promise<Review[]> {
  try {
    const reviewsRef = collectionGroup(db, REVIEWS_SUBCOLLECTION);
    const q = query(reviewsRef, orderBy('createdAt', 'desc'), firestoreLimit(count));
    const querySnapshot = await getDocs(q);

    const reviews: Review[] = [];
    querySnapshot.forEach(docSnap => {
      const data = docSnap.data();
      const productId = docSnap.ref.parent.parent?.id || 'unknown_product';
      let createdAtDate = data.createdAt;
      if (data.createdAt && typeof data.createdAt.seconds === 'number') {
        createdAtDate = (data.createdAt as Timestamp).toDate();
      }
      reviews.push({
        id: docSnap.id,
        productId: productId,
        reviewerName: data.reviewerName,
        rating: data.rating,
        comment: data.comment,
        createdAt: createdAtDate,
      } as Review);
    });
    return reviews;
  } catch (error) {
    console.error("Error fetching recent reviews:", error);
    if (error instanceof Error && (error.message.includes("indexes") || error.message.includes("INVALID_ARGUMENT"))) {
        console.warn("Firestore index for collection group 'reviews' ordered by 'createdAt' (desc) might be missing. Please check your Firebase console. The error was:", error.message);
    }
    return [];
  }
}
