
"use client";

import { useState, useEffect } from 'react';
import type { Review } from '@/lib/types';
import { getReviewsByProductId } from '@/services/productService';
import ReviewItem from './ReviewItem';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ReviewListProps {
  productId: string;
  refreshReviewsSignal: number; // A changing number to trigger re-fetch
}

const ReviewList: React.FC<ReviewListProps> = ({ productId, refreshReviewsSignal }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedReviews = await getReviewsByProductId(productId);
        setReviews(fetchedReviews);
      } catch (err) {
        console.error(`Error fetching reviews for product ${productId}:`, err);
        setError('Could not load reviews at this time.');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId, refreshReviewsSignal]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-6">
        <AlertTitle>Error Loading Reviews</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="text-muted-foreground mt-6 text-center">
        No reviews yet. Be the first to review this product!
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;
