"use client";

import { Star, StarHalf, StarOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: number;
  className?: string;
  iconClassName?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalStars = 5,
  size = 20,
  className,
  iconClassName,
}) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = totalStars - fullStars - halfStar;

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array(fullStars)
        .fill(0)
        .map((_, i) => (
          <Star key={`full-${i}`} fill="currentColor" size={size} className={cn("text-yellow-400", iconClassName)} />
        ))}
      {halfStar === 1 && <StarHalf key="half" fill="currentColor" size={size} className={cn("text-yellow-400", iconClassName)} />}
      {Array(emptyStars)
        .fill(0)
        .map((_, i) => (
          <Star key={`empty-${i}`} size={size} className={cn("text-gray-300 dark:text-gray-600", iconClassName)} />
        ))}
    </div>
  );
};

export default StarRating;
