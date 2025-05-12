
import type { Review } from '@/lib/types';
import TestimonialCard from './TestimonialCard';
import { Separator } from '@/components/ui/separator';

interface TestimonialSectionProps {
  reviews: Review[];
}

const TestimonialSection: React.FC<TestimonialSectionProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-semibold text-center mb-2">What Our Customers Say</h2>
        <p className="text-center text-muted-foreground mb-8">
          Honest feedback from our valued shoppers.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <TestimonialCard key={review.id} review={review} />
          ))}
        </div>
        <Separator className="my-12" />
      </div>
    </section>
  );
};

export default TestimonialSection;
