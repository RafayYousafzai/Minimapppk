import type { Review } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StarRating from '@/components/ui/StarRating';
import { Quote, User } from 'lucide-react';
import { format } from 'date-fns';

interface TestimonialCardProps {
  review: Review;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ review }) => {
  return (
    <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-purple-100 hover:border-purple-300 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
        <Quote className="h-12 w-12 text-purple-400 transform rotate-12" />
      </div>
      
      <CardHeader className="relative pb-4 pt-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
              {review.reviewerName}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={review.rating} size={16} />
              <span className="text-sm text-purple-600 font-semibold">
                {review.rating}/5
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative flex-grow pb-6">
        <div className="relative">
          {/* <Quote className="absolute -top-2 -left-2 w-6 h-6 text-purple-300" /> */}
          <p className="text-gray-700 italic leading-relaxed pl-4 mb-4 group-hover:text-gray-800 transition-colors">
            &quot;{review.comment}&quot;
          </p>
        </div>

        {review.createdAt && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-purple-100">
            <div className="inline-flex items-center gap-1 bg-purple-50 rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-purple-600 font-medium">Verified Purchase</span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              {review.createdAt instanceof Date 
                ? format(review.createdAt, 'MMM d, yyyy')
                : 'Recently'}
            </p>
          </div>
        )}

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
