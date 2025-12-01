import type { Review } from "@/lib/types";
import TestimonialCard from "./TestimonialCard";
import { Star } from "lucide-react";

interface TestimonialSectionProps {
  reviews: Review[];
}

const TestimonialSection: React.FC<TestimonialSectionProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className=" bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-24 left-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-24 right-12 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-xs font-medium mb-6">
            <Star className="w-3.5 h-3.5 fill-primary text-primary" />
            <span>Trusted by 2000+ Customers</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
            Loved by our Community
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Don't just take our word for it. Here's what our customers have to say about their experience with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review) => (
            <TestimonialCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
