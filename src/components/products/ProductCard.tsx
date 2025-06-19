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
    <div className="group bg-[#9b78e8]/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden  hover:border-purple-300 transform hover:-translate-y-2">
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

        {/* Sale badge */}
        {product.salePrice && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            Sale!
          </div>
        )}
      </div>

      <div className="p-6">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-lg text-white mb-2   line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-200 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        {/* <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                (product?.rating || 0) > i
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-300 text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">
            ({product?.rating || 0})
          </span>
        </div> */}

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {product.salePrice ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-purple-600">
                  Rs. {product.salePrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  Rs. {product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-white">
                Rs. {product.price.toFixed(2)}
              </span>
            )}
          </div>

          <Link href={`/products/${product.id}`}>
            <Button
              size="sm"
              className="bg-white  text-[#9b78e8] rounded-full px-4 "
            >
              View
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
