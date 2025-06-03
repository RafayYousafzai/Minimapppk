"use client";

import { useEffect, useState } from "react";
import { getFeaturedProducts } from "@/services/productService";
import EmblaCarousel from "./EmblaCarousel";
import "./css/embla.css";

const OPTIONS = { dragFree: true, loop: true };

const Carousal = () => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const get = async () => {
      setLoading(true);
      try {
        const featuredProducts = await getFeaturedProducts(4);
        setProducts(featuredProducts);
        console.log({ featuredProducts });
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    get();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10">Loading featured products...</div>
    );
  }

  if (!products || products.length === 0) {
    return <div className="text-center py-10">No featured products found.</div>;
  }

  return <EmblaCarousel products={[...products,...products,...products]} options={OPTIONS} />;
};

export default Carousal;
