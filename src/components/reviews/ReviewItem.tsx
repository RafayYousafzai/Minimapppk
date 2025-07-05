
import type { Review } from "@/lib/types";
import StarRating from "@/components/ui/StarRating";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Using full Card components

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  return (
    <Card className="mb-4 bg-background">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{review.reviewerName}</CardTitle>
          {review.createdAt && (
            <CardDescription className="text-xs">
              {review.createdAt instanceof Date
                ? format(review.createdAt, "MMM d, yyyy")
                : "Date not available"}
            </CardDescription>
          )}
        </div>
        <StarRating rating={review.rating} size={18} />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {review.comment}
        </p>
      </CardContent>
    </Card>
  );
};

export default ReviewItem;
