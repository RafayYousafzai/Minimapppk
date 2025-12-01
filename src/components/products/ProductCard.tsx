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
    <div className="group relative bg-card rounded-3xl overflow-hidden transition-all duration-300  flex flex-col h-full">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary/20">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>

        {product.originalPrice && product.originalPrice > product.price && (
          <Badge
            variant="destructive"
            className="absolute top-3 left-3 z-10 px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            Sale
          </Badge>
        )}

        {/* Quick Action Button Overlay */}
        <div className="absolute bottom-4 left-0 right-0 px-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Button
            className="w-full rounded-full font-medium shadow-lg bg-white text-black hover:bg-white/90 dark:bg-black dark:text-white dark:hover:bg-black/90"
            asChild
          >
            <Link href={`/products/${product.id}`}>View Details</Link>
          </Button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {product.category}
          </p>
        </div>

        <Link
          href={`/products/${product.id}`}
          className="block group-hover:text-primary transition-colors"
        >
          <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
          <div className="flex flex-col">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through mb-0.5">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-lg font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium text-foreground">
              {product.rating}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
