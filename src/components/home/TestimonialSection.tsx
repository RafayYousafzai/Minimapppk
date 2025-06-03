import type { Review } from "@/lib/types";
import TestimonialCard from "./TestimonialCard";
import { Separator } from "@/components/ui/separator";
import { Heart, Sparkles } from "lucide-react";

interface TestimonialSectionProps {
  reviews: Review[];
}

const TestimonialSection: React.FC<TestimonialSectionProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="   mx-auto ">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            What Our Customers Say
          </h2>
          <div className="inline-flex items-center gap-2   px-6 py-2 mb-6">
            <span className="text-purple-700 font-semibold">Customer Love</span>
            <Heart className="w-5 h-5 text-purple-500 fill-purple-500" />
          </div>
          {/* <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Real reviews from real customers who absolutely love our products
            and can't stop raving about them!
          </p> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {reviews.map((review) => (
            <TestimonialCard key={review.id} review={review} />
          ))}
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
          </div>
          <div className="relative bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-2 rounded-full">
            <Sparkles className="w-5 h-5 text-purple-500" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
