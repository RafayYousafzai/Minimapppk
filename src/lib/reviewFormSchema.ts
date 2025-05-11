
import { z } from 'zod';

export const reviewFormSchema = z.object({
  reviewerName: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name cannot exceed 50 characters."),
  rating: z.coerce.number().min(1, "Rating is required.").max(5, "Rating must be between 1 and 5."),
  comment: z.string().min(10, "Comment must be at least 10 characters.").max(500, "Comment cannot exceed 500 characters."),
});

export type ReviewFormData = z.infer<typeof reviewFormSchema>;
