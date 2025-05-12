
import type { Review } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StarRating from '@/components/ui/StarRating';
import { Quote } from 'lucide-react';
import { format } from 'date-fns';

interface TestimonialCardProps {
  review: Review;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ review }) => {
  return (
    <Card className="flex flex-col h-full shadow-lg bg-background hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg font-semibold text-primary">{review.reviewerName}</CardTitle>
          <Quote className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <StarRating rating={review.rating} size={18} />
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground italic leading-relaxed">
          &quot;{review.comment}&quot;
        </p>
        {review.createdAt && (
            <p className="text-xs text-muted-foreground mt-3 text-right">
                {review.createdAt instanceof Date 
                ? format(review.createdAt, 'MMM d, yyyy')
                : 'Recently'}
            </p>
        )}
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
