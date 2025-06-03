"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewFormSchema, type ReviewFormData } from "@/lib/reviewFormSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { addReview } from "@/services/productService";
import { StarIcon } from "@heroicons/react/24/solid";
import {
  StarIcon as StarOutlineIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

interface ReviewFormProps {
  productId: string;
  onReviewSubmit: () => void; // Callback to refresh review list
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  onReviewSubmit,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      reviewerName: "",
      rating: 0,
      comment: "",
    },
  });

  const currentRating = form.watch("rating");

  async function onSubmit(data: ReviewFormData) {
    setIsSubmitting(true);
    try {
      await addReview(productId, data);
      toast({
        title: "Review Submitted! 🎉",
        description: "Thank you for your valuable feedback.",
      });
      form.reset();
      onReviewSubmit(); // Trigger refresh of reviews
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast({
        title: "Oops! Something went wrong",
        description: "Could not submit your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="   ">
      <div className="  py-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
            <PencilSquareIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Write a Review</h3>
            <p className="text-gray-600">
              Share your experience with other customers
            </p>
          </div>
        </div>
      </div>

      <div className="py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="reviewerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-gray-900">
                    Your Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., John Doe"
                      className="h-12 text-lg bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-gray-900">
                    Your Rating *
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isActive =
                            (hoverRating || currentRating) >= star;
                          return (
                            <button
                              key={star}
                              type="button"
                              className="bg-white transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-full p-1"
                              onClick={() => field.onChange(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                            >
                              {isActive ? (
                                <StarIcon className="w-8 h-8 text-yellow-400" />
                              ) : (
                                <StarOutlineIcon className="w-8 h-8 text-gray-300 hover:text-yellow-300" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {currentRating > 0 && (
                        <p className="text-sm text-gray-600 font-medium">
                          {currentRating === 1 && "Poor - Not satisfied"}
                          {currentRating === 2 && "Fair - Below expectations"}
                          {currentRating === 3 && "Good - Meets expectations"}
                          {currentRating === 4 &&
                            "Very Good - Exceeds expectations"}
                          {currentRating === 5 && "Excellent - Outstanding!"}
                        </p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-gray-900">
                    Your Review *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us what you think about the product... What did you like? What could be improved?"
                      rows={5}
                      className="text-lg bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-xl resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 px-8 text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  "Submit Review"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                className="h-12 px-6 text-lg font-medium border-gray-300 hover:bg-pink-500 rounded-xl"
              >
                Clear Form
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ReviewForm;
