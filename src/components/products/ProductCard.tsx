import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100 hover:border-purple-300 transform hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <div className="relative h-64 bg-gradient-to-br from-purple-50 to-pink-50">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </Link>

        {/* Floating action buttons */}
        {/* <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
          <Button
            size="sm"
            variant="secondary"
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
          >
            <Heart className="w-4 h-4 text-purple-600" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
          >
            <ShoppingCart className="w-4 h-4 text-purple-600" />
          </Button>
        </div> */}

        {/* Sale badge */}
        {product.salePrice && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            Sale!
          </div>
        )}
      </div>

      <div className="p-6">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-sm text-gray-500 ml-1">(4.8)</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {product.salePrice ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-purple-600">
                  ${product.salePrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-purple-600">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <Link href={`/products/${product.id}`}>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-4 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
