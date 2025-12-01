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
import { StarIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="reviewerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-foreground">
                  Your Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., John Doe"
                    className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all"
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
                <FormLabel className="text-base font-semibold text-foreground">
                  Your Rating
                </FormLabel>
                <FormControl>
                  <div className="h-12 flex items-center">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isActive = (hoverRating || currentRating) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            className="bg-transparent transition-transform hover:scale-110 focus:outline-none rounded-full p-1"
                            onClick={() => field.onChange(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                          >
                            <StarIcon
                              className={`w-8 h-8 transition-colors duration-200 ${
                                isActive
                                  ? "text-yellow-400"
                                  : "text-muted-foreground/20 hover:text-yellow-200"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    {currentRating > 0 && (
                      <span className="ml-4 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {currentRating === 1 && "Poor"}
                        {currentRating === 2 && "Fair"}
                        {currentRating === 3 && "Good"}
                        {currentRating === 4 && "Very Good"}
                        {currentRating === 5 && "Excellent"}
                      </span>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-foreground">
                Your Review
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us what you think about the product... What did you like? What could be improved?"
                  rows={5}
                  className="min-h-[150px] rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all resize-none p-4"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 px-8 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </div>
            ) : (
              "Submit Review"
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => form.reset()}
            className="h-12 px-6 text-base font-medium rounded-xl hover:bg-muted/50"
          >
            Clear Form
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ReviewForm;
