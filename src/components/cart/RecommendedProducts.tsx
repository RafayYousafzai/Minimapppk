"use client";

import { useEffect, useState } from 'react';
import { generateAIProductRecommendations, type AIProductRecommendationsInput, type AIProductRecommendationsOutput } from '@/ai/flows/ai-product-recommendations';
import { useCart } from '@/hooks/useCart';
import type { Product } from '@/lib/types'; // Using local Product type for display
import { mockProducts } from '@/lib/mock-data'; // To potentially fetch full product details
import ProductCard from '@/components/products/ProductCard';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const RecommendedProducts: React.FC = () => {
  const { cartItems } = useCart();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cartItems.length > 0) {
      const fetchRecommendations = async () => {
        setLoading(true);
        setError(null);
        try {
          const aiInput: AIProductRecommendationsInput = {
            cartItems: cartItems.map(item => ({
              id: item.productId, // Use productId from CartItem
              name: item.name,
              description: item.description || '', // CartItem might not have full description
              imageUrl: item.image,
              price: item.price, // This is the price including variant adjustments
            })),
            maxRecommendations: 3,
          };
          
          const aiOutput: AIProductRecommendationsOutput = await generateAIProductRecommendations(aiInput);
          
          // Map AI output (which uses ProductSchema) to our local Product type for display
          // For now, we'll try to find the full product details from mock data
          // If not found, we can display a simpler card based on AI output.
          const fullRecommendations = aiOutput.map(rec => {
            const fullProduct = mockProducts.find(p => p.id === rec.id);
            return fullProduct || { // Fallback to AI data if not found in mock
                id: rec.id,
                name: rec.name,
                description: rec.description,
                images: [rec.imageUrl],
                price: rec.price,
                category: 'Recommendation', // Placeholder category
                rating: 0, // Placeholder rating
                reviews: 0,
                stock: 1, // Assume in stock
            };
          }).filter(Boolean) as Product[]; // Filter out undefined if any product not found

          setRecommendations(fullRecommendations);

        } catch (err) {
          console.error("Error fetching AI recommendations:", err);
          setError("Could not load recommendations at this time.");
        } finally {
          setLoading(false);
        }
      };

      fetchRecommendations();
    } else {
      setRecommendations([]); // Clear recommendations if cart is empty
    }
  }, [cartItems]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading recommendations...</p>
      </div>
    );
  }

  if (error) {
     return (
      <Alert variant="destructive" className="mt-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (recommendations.length === 0 && cartItems.length > 0 && !loading) {
    return null; // No recommendations to show or still loading initial cart
  }
  
  if (recommendations.length === 0) return null;


  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">You Might Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
