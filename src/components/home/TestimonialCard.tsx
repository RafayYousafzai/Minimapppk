import type { Review } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import StarRating from '@/components/ui/StarRating';
import { Quote, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialCardProps {
  review: Review;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ review }) => {
  const initials = review.reviewerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="h-full border-none shadow-sm transition-all duration-300 bg-card hover:-translate-y-1 flex flex-col justify-between group rounded-2xl overflow-hidden">
      <CardContent className="pt-8 px-6 relative flex-grow">
        <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/5 group-hover:text-primary/10 transition-colors duration-300" />
        
        <div className="mb-4">
          <StarRating rating={review.rating} size={16} />
        </div>

        <p className="text-foreground/80 text-base leading-relaxed font-medium mb-6 relative z-10">
          &quot;{review.comment}&quot;
        </p>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-4 flex items-center justify-between border-t border-border/30 bg-secondary/10">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.reviewerName}`} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-bold text-sm text-foreground">{review.reviewerName}</h4>
            <p className="text-xs text-muted-foreground">{format(review.createdAt || new Date(), 'MMM d, yyyy')}</p>
          </div>
        </div>

        <div className="flex items-center text-green-600 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full border border-green-100 dark:border-green-900/30">
          <CheckCircle2 className="h-3 w-3 mr-1.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TestimonialCard;
