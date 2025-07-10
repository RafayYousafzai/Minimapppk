
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-card border rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 h-full flex flex-col">
      <div className="relative overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <div className="relative h-64 bg-secondary">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </Link>

        {product.originalPrice && product.originalPrice > product.price && (
          <Badge variant="destructive" className="absolute top-4 left-4 text-sm font-semibold shadow-lg">
            Sale
          </Badge>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
            <Link href={`/products/${product.id}`}>
                <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-2">
                    {product.name}
                </h3>
            </Link>

            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.description}
            </p>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="space-y-1">
            {product.originalPrice && product.originalPrice > product.price ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-foreground">
                  Rs. {product.price.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  Rs. {product.originalPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-foreground">
                Rs. {product.price.toFixed(2)}
              </span>
            )}
          </div>

          <Button size="sm" asChild>
            <Link href={`/products/${product.id}`}>View</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
