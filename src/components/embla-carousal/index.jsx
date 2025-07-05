import EmblaCarousel from "./EmblaCarousel";
import "./css/embla.css";

const OPTIONS = { dragFree: true, loop: true };

const Carousal = ({ products }) => {
  if (!products || products.length === 0) {
    return <div className="text-center py-10">No featured products found.</div>;
  }

  return (
    <EmblaCarousel
      products={[...products, ...products, ...products]}
      options={OPTIONS}
    />
  );
};

export default Carousal;
