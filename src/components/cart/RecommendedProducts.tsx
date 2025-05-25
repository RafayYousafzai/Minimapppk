"use client";

import { useEffect, useState } from "react";
import {
  generateAIProductRecommendations,
  type AIProductRecommendationsInput,
  type AIProductRecommendationsOutput,
} from "@/ai/flows/ai-product-recommendations";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/lib/types"; // Using local Product type for display
import ProductCard from "@/components/products/ProductCard";
import { Loader2 } from "lucide-react";
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
            cartItems: cartItems.map((item) => ({
              id: item.productId,
              name: item.name,
              description: item.description || "",
              imageUrl: item.image, // This is used by AI
              price: item.price,
            })),
            maxRecommendations: 3,
          };

          const aiOutput: AIProductRecommendationsOutput =
            await generateAIProductRecommendations(aiInput);

          // Map AI output (AIProductRecommendationsOutput which is ProductSchema[]) to our local Product type for display
          const mappedRecommendations: Product[] = aiOutput.map((rec) => ({
            id: rec.id, // AI might generate an ID, or it could be an existing one if prompt is changed
            name: rec.name,
            description: rec.description,
            images: [rec.imageUrl], // AI generates a picsum URL as per its prompt
            price: rec.price,
            category: "Recommendation", // Placeholder category for AI generated items
            rating: Math.floor(Math.random() * 3) + 3, // Placeholder rating (3-5 stars)
            reviews: Math.floor(Math.random() * 50) + 10, // Placeholder reviews
            stock: 10, // Assume AI recommended products are in stock
            // variants, tags, longDescription can be undefined or set to defaults if needed by ProductCard
            // ProductCard handles missing optional fields gracefully.
          }));

          setRecommendations(mappedRecommendations);
        } catch (err) {
          console.error("Error fetching AI recommendations:", err);
          setError("Could not load recommendations at this time.");
        } finally {
          setLoading(false);
        }
      };

      fetchRecommendations();
    } else {
      setRecommendations([]);
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
      <Alert variant="destructive" className="mt-8">
        <AlertTitle>Recommendation Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (recommendations.length === 0) return null;
  return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">You Might Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((product) => (
          <ProductCard
            key={`reco-${product.id}-${product.name}`}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
