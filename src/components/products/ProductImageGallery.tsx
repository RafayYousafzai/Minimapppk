"use client";

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ProductImageGalleryProps {
  images: string[];
  altText: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, altText }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full bg-muted rounded-lg flex items-center justify-center aspect-square">
        <p className="text-muted-foreground">No image available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg overflow-hidden border shadow-sm bg-card">
        <AspectRatio ratio={1/1}>
          <Image
            src={images[currentImageIndex]}
            alt={`${altText} - Image ${currentImageIndex + 1}`}
            width={600}
            height={600}
            priority={currentImageIndex === 0}
            className="object-cover w-full h-full transition-opacity duration-300 ease-in-out"
            data-ai-hint="product detail gallery"
          />
        </AspectRatio>
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                "rounded-md overflow-hidden border-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                currentImageIndex === index ? 'border-primary' : 'border-transparent hover:border-muted-foreground/50'
              )}
              aria-label={`View image ${index + 1}`}
            >
              <AspectRatio ratio={1/1}>
                <Image
                  src={image}
                  alt={`${altText} - Thumbnail ${index + 1}`}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
