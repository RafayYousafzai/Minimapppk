import type { Product, VariantOption, Review } from "@/lib/types";
import type { ProductFormData } from "@/lib/productFormTypes";
import type { ReviewFormData } from "@/lib/reviewFormSchema";
import { db, storage } from "@/lib/firebase/config"; // Import storage
import {
  collection,
  doc,
  getDoc,
  getDocs,
  writeBatch,
  query,
  where,
  limit as firestoreLimit,
  orderBy,
  addDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  FieldValue,
  collectionGroup,
  deleteDoc, // Added deleteDoc
  limit,
  startAfter,
  getCountFromServer,
  QueryConstraint,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"; // Firebase Storage functions
import { mockProducts as productsToSeed } from "@/lib/mock-data";

const PRODUCTS_COLLECTION = "products";
const REVIEWS_SUBCOLLECTION = "reviews";

// Function to upload an image to Firebase Storage
export async function uploadProductImage(
  file: File,
  productIdOrTempId: string,
  fileName: string
): Promise<string> {
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
  if (
    !imageUrl ||
    !imageUrl.startsWith("https://firebasestorage.googleapis.com")
  ) {
    console.warn(
      `[Service:deleteImage] Skipping deletion of invalid/non-Firebase Storage URL: ${imageUrl}`
    );
    return;
  }
  try {
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
    console.log(
      `[Service:deleteImage] Image deleted from Storage: ${imageUrl}`
    );
  } catch (error: any) {
    if (error.code === "storage/object-not-found") {
      console.log(
        `[Service:deleteImage] Image not found in Storage, presumed already deleted: ${imageUrl}`
      );
    } else {
      console.error(
        `[Service:deleteImage] Error deleting image from Storage (${imageUrl}):`,
        error
      );
      throw error; // Re-throw other errors to be caught by the caller in deleteProduct
    }
  }
}

export async function seedProducts(): Promise<void> {
  console.log("🚦 Starting product seeding process...");

  if (!db) {
    const errorMsg = "Firestore database instance is not available";
    console.error("❌", errorMsg);
    throw new Error(errorMsg);
  }

  const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);
  console.log("🔗 Connected to Firestore collection:", PRODUCTS_COLLECTION);

  const productsToSeed = generateMockProducts(20); // Using a fixed small number for seeding
  console.log(
    `🛠 Generated ${productsToSeed.length} mock products for seeding.`
  );

  try {
    console.log("🔍 Checking for existing products...");
    const firstProductCheckRef = doc(
      productsCollectionRef,
      productsToSeed[0].id
    );
    const firstProductSnap = await getDoc(firstProductCheckRef);

    if (firstProductSnap.exists()) {
      console.log(
        "✅ Found first mock product - collection likely already seeded. Skipping."
      );
      return;
    } else {
      console.log("🆕 First mock product not found - proceeding with seed.");
    }
  } catch (error) {
    console.error("⚠️ Error checking existing products:", error);
    throw error;
  }

  const batch = writeBatch(db);
  console.log("✏️ Preparing write batch...");

  productsToSeed.forEach((product) => {
    const docRef = doc(productsCollectionRef, product.id);
    const productData: any = { ...product }; // Use 'any' temporarily for easier key deletion

    Object.keys(productData).forEach((key) => {
      if (productData[key] === undefined) {
        delete productData[key];
      }
    });

    if (!productData.createdAt) {
      productData.createdAt = serverTimestamp();
    }
    if (!productData.updatedAt) {
      productData.updatedAt = serverTimestamp();
    }

    console.log(`📝 Adding product to batch: ${product.id} (${product.name})`);
    batch.set(docRef, productData);
  });

  try {
    console.log("🚀 Attempting to commit batch...");
    await batch.commit();
    console.log("🎉 Products seeded successfully!");

    console.log(
      "🔍 Verifying seeded products (checking first product again)..."
    );
    const verificationSnap = await getDoc(
      doc(productsCollectionRef, productsToSeed[0].id)
    );
    if (verificationSnap.exists()) {
      console.log(
        `✅ Verification successful: Product ${productsToSeed[0].id} found.`
      );
    } else {
      console.warn(
        `⚠️ Verification failed: Product ${productsToSeed[0].id} NOT found after seeding.`
      );
    }
  } catch (error) {
    console.error("❌ Batch commit failed:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        code: (error as any).code,
      });
    }
    throw new Error(
      `Failed to seed products: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

function generateMockProducts(count: number): Product[] {
  return Array.from({ length: count }, (_, i) => {
    const baseName = `Awesome Gadget ${i + 1}`;
    const price = parseFloat((20 + i * 7.35).toFixed(2));
    const hasOriginalPrice = Math.random() > 0.5;
    return {
      id: `mock-product-${Date.now()}-${i}`,
      name: baseName,
      description: `This is a fantastic ${baseName.toLowerCase()}, perfect for your needs. High quality and great value!`,
      longDescription: `Discover the amazing features of the ${baseName.toLowerCase()}. Built with precision and care, it offers unparalleled performance and durability. Whether for work or play, this gadget will exceed your expectations. Includes a 2-year warranty and free support.`,
      images: [
        `https://placehold.co/600x400.png?text=${encodeURIComponent(
          baseName
        )}&font=Inter`,
        `https://placehold.co/600x400.png?text=${encodeURIComponent(
          baseName
        )}+View+2&font=Inter`,
      ],
      price: price,
      originalPrice: hasOriginalPrice
        ? parseFloat((price * (1 + (Math.random() * 0.3 + 0.1))).toFixed(2))
        : undefined, // 10-40% higher
      category: [
        "Electronics",
        "Cool Gadgets",
        "Home Office",
        "Tech Accessories",
      ][i % 4],
      stock: Math.floor(Math.random() * 50) + 10, // 10 to 59
      tags: [
        "new arrival",
        "gadget",
        ["tech", "innovation", "modern", "sleek"][i % 4],
      ],
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 4.9
      reviews: Math.floor(Math.random() * 150) + 5, // 5 to 154
      variants:
        i % 2 === 0
          ? [
              // Add variants to half of the products
              {
                type: "Color",
                options: [
                  { id: `col-${i}-1`, value: "Black" },
                  { id: `col-${i}-2`, value: "Silver", additionalPrice: 5 },
                  {
                    id: `col-${i}-3`,
                    value: "Space Gray",
                    additionalPrice: 7.5,
                  },
                ],
              },
              {
                type: "Storage",
                options: [
                  { id: `stor-${i}-1`, value: "128GB" },
                  { id: `stor-${i}-2`, value: "256GB", additionalPrice: 50 },
                ],
              },
            ]
          : [],
      createdAt: serverTimestamp() as unknown as Timestamp, // Cast for type compatibility
      updatedAt: serverTimestamp() as unknown as Timestamp,
    };
  });
}

export async function addProduct(data: ProductFormData): Promise<string> {
  try {
    const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);

    const productPayload: Partial<Product> & {
      createdAt: FieldValue;
      updatedAt?: FieldValue;
    } = {
      name: data.name,
      description: data.description,
      longDescription: data.longDescription || "",
      images: data.images ? data.images.map((img) => img.url) : [],
      price: data.price,
      category: data.category,
      stock: data.stock,
      tags: data.tags || [],
      rating: 0,
      reviews: 0,
      variants:
        data.variants?.map((variant) => ({
          type: variant.type,
          options: variant.options.map(
            (option) =>
              ({
                id:
                  option.id ||
                  `${variant.type
                    .toLowerCase()
                    .replace(/\s+/g, "-")}-${option.value
                    .toLowerCase()
                    .replace(/\s+/g, "-")}-${Math.random()
                    .toString(36)
                    .substring(2, 9)}`,
                value: option.value,
                additionalPrice: option.additionalPrice || 0,
              } as VariantOption)
          ),
        })) || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (
      data.originalPrice !== undefined &&
      data.originalPrice !== null &&
      !isNaN(data.originalPrice)
    ) {
      productPayload.originalPrice = data.originalPrice;
    }

    const docRef = await addDoc(productsCollectionRef, productPayload);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    if (
      error instanceof Error &&
      error.message.includes("invalid data") &&
      error.message.includes("undefined")
    ) {
      console.error(
        "Detailed error: Attempted to write an undefined value to Firestore. Check productPayload:",
        error,
        "Payload:",
        JSON.stringify(data)
      );
    }
    throw new Error("Failed to add product.");
  }
}

export async function updateProduct(
  productId: string,
  data: ProductFormData
): Promise<void> {
  try {
    const productDocRef = doc(db, PRODUCTS_COLLECTION, productId);

    const productToUpdate: Partial<Omit<Product, "id" | "createdAt">> & {
      updatedAt: FieldValue;
    } = {
      name: data.name,
      description: data.description,
      longDescription: data.longDescription || "",
      images: data.images ? data.images.map((img) => img.url) : [],
      price: data.price,
      category: data.category,
      stock: data.stock,
      tags: data.tags || [],
      variants:
        data.variants?.map((variant) => ({
          type: variant.type,
          options: variant.options.map(
            (option) =>
              ({
                id:
                  option.id ||
                  `${variant.type
                    .toLowerCase()
                    .replace(/\s+/g, "-")}-${option.value
                    .toLowerCase()
                    .replace(/\s+/g, "-")}-${Math.random()
                    .toString(36)
                    .substring(2, 9)}`,
                value: option.value,
                additionalPrice: option.additionalPrice || 0,
              } as VariantOption)
          ),
        })) || [],
      updatedAt: serverTimestamp(),
    };

    if (
      data.originalPrice !== undefined &&
      data.originalPrice !== null &&
      !isNaN(data.originalPrice)
    ) {
      productToUpdate.originalPrice = data.originalPrice;
    } else {
      // If originalPrice is explicitly undefined or null, ensure it's removed or set to null
      // Firestore can store null, but if we want to remove the field, more complex logic is needed (not typical for this field)
      // For now, explicitly setting to undefined if it's not a valid number, Firestore will ignore it
      delete productToUpdate.originalPrice;
    }

    // Sanitize any other potentially undefined top-level fields before sending to Firestore
    Object.keys(productToUpdate).forEach((keyStr) => {
      const key = keyStr as keyof typeof productToUpdate;
      if (productToUpdate[key] === undefined) {
        delete productToUpdate[key];
      }
    });

    await updateDoc(productDocRef, productToUpdate);
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    if (
      error instanceof Error &&
      error.message.includes("invalid data") &&
      error.message.includes("undefined")
    ) {
      console.error(
        "Detailed error: Attempted to write an undefined value to Firestore during update. Check productToUpdate:",
        error,
        "Payload:",
        JSON.stringify(data)
      );
    }
    throw new Error("Failed to update product.");
  }
}

export async function deleteProduct(productId: string): Promise<boolean> {
  console.log(
    `[Service:deleteProduct] Attempting to delete product ID: ${productId}`
  );
  try {
    const productDocRef = doc(db, PRODUCTS_COLLECTION, productId);
    const productSnap = await getDoc(productDocRef);

    if (!productSnap.exists()) {
      console.warn(
        `[Service:deleteProduct] Product with ID ${productId} not found for deletion.`
      );
      return false;
    }

    const productData = productSnap.data() as Product;
    let allImageProcessingAttempted = true;

    if (productData.images && productData.images.length > 0) {
      console.log(
        `[Service:deleteProduct] Processing deletion for ${productData.images.length} images for product ${productId}...`
      );

      const deletePromises = productData.images.map((imageUrl) =>
        deleteProductImageByUrl(imageUrl).catch((err) => {
          console.error(
            `[Service:deleteProduct] Error during deletion of image ${imageUrl}:`,
            err
          );
          allImageProcessingAttempted = false; // Mark if any specific image deletion throws an unhandled error
          // We don't re-throw here to allow other image deletions and document deletion to proceed
        })
      );

      await Promise.allSettled(deletePromises); // Wait for all attempts to complete

      if (!allImageProcessingAttempted) {
        console.warn(
          `[Service:deleteProduct] One or more images encountered errors during deletion for product ${productId}. Check logs above. Proceeding with Firestore document deletion.`
        );
        // Decide if this constitutes a "failure" of the deleteProduct operation.
        // For now, we'll proceed to delete the Firestore doc.
      } else {
        console.log(
          `[Service:deleteProduct] All images for product ${productId} processed for deletion.`
        );
      }
    }

    await deleteDoc(productDocRef);
    console.log(
      `[Service:deleteProduct] Product document ${productId} deleted from Firestore.`
    );

    console.warn(
      `[Service:deleteProduct] Note: Subcollections for product ${productId} (e.g., reviews) may still exist in Firestore. Manual cleanup or a Cloud Function is needed for complete removal.`
    );

    return true;
  } catch (error) {
    console.error(
      `[Service:deleteProduct] Critical error during product deletion process for ${productId}:`,
      error
    );
    return false;
  }
}

// --- Pagination Types ---
export interface ProductFilters {
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
}

export interface PaginatedProductsResult {
  products: Product[];
  totalCount: number;
  hasMore: boolean;
}

// Cache for price range (refreshed on product changes)
let priceRangeCache: { min: number; max: number; timestamp: number } | null =
  null;
const PRICE_RANGE_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// --- Server-Side Paginated Products ---
export async function getProductsPaginated(
  pageSize: number = 8,
  lastDoc: QueryDocumentSnapshot | null = null,
  filters: ProductFilters = {}
): Promise<{
  products: Product[];
  lastDoc: QueryDocumentSnapshot | null;
  hasMore: boolean;
}> {
  try {
    const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);
    const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      // Firestore 'in' query supports up to 30 values
      constraints.push(
        where("category", "in", filters.categories.slice(0, 30))
      );
    }

    // Apply price filters (requires composite index)
    if (filters.minPrice !== undefined) {
      constraints.push(where("price", ">=", filters.minPrice));
    }
    if (filters.maxPrice !== undefined) {
      constraints.push(where("price", "<=", filters.maxPrice));
    }

    // Apply rating filter
    if (filters.minRating !== undefined && filters.minRating > 0) {
      constraints.push(where("rating", ">=", filters.minRating));
    }

    // Pagination cursor
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    // Limit results
    constraints.push(firestoreLimit(pageSize + 1)); // Fetch one extra to check if there's more

    const q = query(productsCollectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const docs = querySnapshot.docs;
    const hasMore = docs.length > pageSize;
    const productDocs = hasMore ? docs.slice(0, pageSize) : docs;

    let products = productDocs.map((docSnap) => {
      const data = docSnap.data();
      let createdAtDate = data.createdAt;
      if (data.createdAt && typeof data.createdAt.seconds === "number") {
        createdAtDate = (data.createdAt as Timestamp).toDate();
      }
      let updatedAtDate = data.updatedAt;
      if (data.updatedAt && typeof data.updatedAt.seconds === "number") {
        updatedAtDate = (data.updatedAt as Timestamp).toDate();
      }
      return {
        id: docSnap.id,
        ...data,
        createdAt: createdAtDate,
        updatedAt: updatedAtDate,
      } as Product;
    });

    // Client-side search filter (Firestore doesn't support full-text search)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          (product.tags &&
            product.tags.some((tag) => tag.toLowerCase().includes(searchLower)))
      );
    }

    const newLastDoc =
      productDocs.length > 0 ? productDocs[productDocs.length - 1] : null;

    return {
      products,
      lastDoc: newLastDoc as QueryDocumentSnapshot | null,
      hasMore,
    };
  } catch (error) {
    console.error("Error fetching paginated products:", error);
    return { products: [], lastDoc: null, hasMore: false };
  }
}

// Get total product count (with optional filters) - for pagination UI
export async function getProductCount(
  filters: ProductFilters = {}
): Promise<number> {
  try {
    const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);
    const constraints: QueryConstraint[] = [];

    if (filters.categories && filters.categories.length > 0) {
      constraints.push(
        where("category", "in", filters.categories.slice(0, 30))
      );
    }
    if (filters.minPrice !== undefined) {
      constraints.push(where("price", ">=", filters.minPrice));
    }
    if (filters.maxPrice !== undefined) {
      constraints.push(where("price", "<=", filters.maxPrice));
    }
    if (filters.minRating !== undefined && filters.minRating > 0) {
      constraints.push(where("rating", ">=", filters.minRating));
    }

    const q =
      constraints.length > 0
        ? query(productsCollectionRef, ...constraints)
        : productsCollectionRef;

    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error getting product count:", error);
    return 0;
  }
}

// Optimized price range - caches result to avoid fetching all products
export async function getPriceRangeOptimized(): Promise<{
  min: number;
  max: number;
}> {
  // Check cache first
  if (
    priceRangeCache &&
    Date.now() - priceRangeCache.timestamp < PRICE_RANGE_CACHE_DURATION
  ) {
    return { min: priceRangeCache.min, max: priceRangeCache.max };
  }

  try {
    const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);

    // Get min price (1 read)
    const minQuery = query(
      productsCollectionRef,
      orderBy("price", "asc"),
      firestoreLimit(1)
    );
    const minSnapshot = await getDocs(minQuery);
    const minPrice =
      minSnapshot.docs.length > 0 ? minSnapshot.docs[0].data().price : 0;

    // Get max price (1 read)
    const maxQuery = query(
      productsCollectionRef,
      orderBy("price", "desc"),
      firestoreLimit(1)
    );
    const maxSnapshot = await getDocs(maxQuery);
    const maxPrice =
      maxSnapshot.docs.length > 0 ? maxSnapshot.docs[0].data().price : 1000;

    // Update cache
    priceRangeCache = {
      min: Math.floor(minPrice),
      max: Math.ceil(maxPrice),
      timestamp: Date.now(),
    };

    return { min: priceRangeCache.min, max: priceRangeCache.max };
  } catch (error) {
    console.error("Error fetching optimized price range:", error);
    return { min: 0, max: 1000 };
  }
}

// Clear price range cache (call when products are added/updated/deleted)
export function clearPriceRangeCache(): void {
  priceRangeCache = null;
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsCollectionRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      let createdAtDate = data.createdAt;
      if (data.createdAt && typeof data.createdAt.seconds === "number") {
        createdAtDate = (data.createdAt as Timestamp).toDate();
      }
      let updatedAtDate = data.updatedAt;
      if (data.updatedAt && typeof data.updatedAt.seconds === "number") {
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
    console.error("Error fetching all products:", error);
    if (error instanceof Error && error.message.includes("firestore/indexes")) {
      console.warn(
        "Firestore index for ordering by 'createdAt' might be missing. Please check your Firebase console."
      );
    } else if (
      error instanceof Error &&
      error.message.includes("INVALID_ARGUMENT")
    ) {
      console.error(
        "Firebase Firestore Error: INVALID_ARGUMENT. This often means your Firestore Project ID is not correctly configured in .env or your Firestore rules are denying access. Ensure NEXT_PUBLIC_FIREBASE_PROJECT_ID is set and matches your project in the Firebase console, and that Firestore is in Native mode."
      );
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
      if (data.createdAt && typeof data.createdAt.seconds === "number") {
        createdAtDate = (data.createdAt as Timestamp).toDate();
      }
      let updatedAtDate = data.updatedAt;
      if (data.updatedAt && typeof data.updatedAt.seconds === "number") {
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

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  try {
    const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsCollectionRef,
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      let createdAtDate = data.createdAt;
      if (data.createdAt && typeof data.createdAt.seconds === "number") {
        createdAtDate = (data.createdAt as Timestamp).toDate();
      }
      let updatedAtDate = data.updatedAt;
      if (data.updatedAt && typeof data.updatedAt.seconds === "number") {
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

export async function getFeaturedProducts(
  count: number = 4
): Promise<Product[]> {
  try {
    const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);
    let q;
    try {
      q = query(
        productsCollectionRef,
        orderBy("rating", "desc"),
        firestoreLimit(count)
      );
      const testSnapshot = await getDocs(q);
      if (testSnapshot.empty && count > 0) {
        console.warn(
          "No products found when ordering by rating for featured products. Falling back."
        );
        throw new Error(
          "No products with rating, trying createdAt or general limit."
        );
      }
    } catch (ratingOrderError) {
      console.warn(
        "Warning: Could not order by rating for featured products, falling back to createdAt.",
        ratingOrderError
      );
      q = query(
        productsCollectionRef,
        orderBy("createdAt", "desc"),
        firestoreLimit(count)
      );
    }

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty && count > 0) {
      console.warn(
        "No products found with rating or createdAt ordering. Fetching any products."
      );
      const fallbackQuery = query(productsCollectionRef, firestoreLimit(count));
      const fallbackSnapshot = await getDocs(fallbackQuery);
      return fallbackSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Product)
      );
    }
    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      let createdAtDate = data.createdAt;
      if (data.createdAt && typeof data.createdAt.seconds === "number") {
        createdAtDate = (data.createdAt as Timestamp).toDate();
      }
      let updatedAtDate = data.updatedAt;
      if (data.updatedAt && typeof data.updatedAt.seconds === "number") {
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
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export async function getAllCategories(): Promise<string[]> {
  try {
    const products = await getAllProducts();
    if (!products || products.length === 0) return [];
    const categories = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(categories);
  } catch (error) {
    console.error("Error fetching all categories:", error);
    return [];
  }
}

// Cache for categories (refreshed on product changes)
let categoriesCache: { categories: string[]; timestamp: number } | null = null;
const CATEGORIES_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Optimized categories - fetches distinct categories without loading all products
// Note: Firestore doesn't support DISTINCT queries, so we use a small sample + cache
export async function getAllCategoriesOptimized(): Promise<string[]> {
  // Check cache first
  if (
    categoriesCache &&
    Date.now() - categoriesCache.timestamp < CATEGORIES_CACHE_DURATION
  ) {
    return categoriesCache.categories;
  }

  try {
    const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);
    // Fetch a larger sample to ensure we capture all categories
    // This is a trade-off: we fetch more docs initially but cache the result
    const q = query(productsCollectionRef, firestoreLimit(100));
    const querySnapshot = await getDocs(q);

    const categories = new Set<string>();
    querySnapshot.docs.forEach((doc) => {
      const category = doc.data().category;
      if (category) categories.add(category);
    });

    const categoryArray = Array.from(categories).sort();

    // Update cache
    categoriesCache = {
      categories: categoryArray,
      timestamp: Date.now(),
    };

    return categoryArray;
  } catch (error) {
    console.error("Error fetching optimized categories:", error);
    return [];
  }
}

// Clear categories cache (call when products are added/updated/deleted)
export function clearCategoriesCache(): void {
  categoriesCache = null;
}

export async function getPriceRange(): Promise<{ min: number; max: number }> {
  try {
    const products = await getAllProducts();
    if (products.length === 0) return { min: 0, max: 0 };
    const prices = products.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  } catch (error) {
    console.error("Error fetching price range:", error);
    return { min: 0, max: 1000 };
  }
}

// --- Review Functions ---

export async function addReview(
  productId: string,
  reviewData: ReviewFormData
): Promise<string> {
  try {
    const reviewCollectionRef = collection(
      db,
      PRODUCTS_COLLECTION,
      productId,
      REVIEWS_SUBCOLLECTION
    );
    const newReview: Omit<Review, "id" | "productId" | "createdAt"> & {
      createdAt: FieldValue;
    } = {
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
    throw new Error("Failed to add review.");
  }
}

export async function getReviewsByProductId(
  productId: string
): Promise<Review[]> {
  try {
    const reviewsCollectionRef = collection(
      db,
      PRODUCTS_COLLECTION,
      productId,
      REVIEWS_SUBCOLLECTION
    );
    const q = query(reviewsCollectionRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      let createdAtDate = data.createdAt;
      if (data.createdAt && typeof data.createdAt.seconds === "number") {
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
    const q = query(
      reviewsRef,
      orderBy("createdAt", "desc"),
      firestoreLimit(count)
    );
    const querySnapshot = await getDocs(q);

    const reviews: Review[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const productId = docSnap.ref.parent.parent?.id || "unknown_product";
      let createdAtDate = data.createdAt;
      if (data.createdAt && typeof data.createdAt.seconds === "number") {
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
    return [];
  }
}
