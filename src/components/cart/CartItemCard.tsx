"use client"

import Image from "next/image"
import Link from "next/link"
import type { CartItem } from "@/lib/types"
import { useCart } from "@/hooks/useCart"
import QuantitySelector from "@/components/products/QuantitySelector"
import { Button } from "@/components/ui/button"
import { XMarkIcon, HeartIcon } from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface CartItemCardProps {
  item: CartItem
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart()
  const { toast } = useToast()
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleRemove = () => {
    removeFromCart(item.id)
    toast({
      title: "Item Removed ✓",
      description: `${item.name} has been removed from your cart.`,
    })
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist ❤️",
      description: `${item.name} ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex gap-6">
          {/* Product Image */}
          <Link href={`/products/${item.productId}`} className="flex-shrink-0">
            <div className="relative group">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={120}
                height={120}
                className="rounded-xl object-cover aspect-square group-hover:scale-105 transition-transform duration-200"
                data-ai-hint="product cart item"
              />
              {item.availableStock < 5 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                  Low Stock
                </Badge>
              )}
            </div>
          </Link>

          {/* Product Details */}
          <div className="flex-grow min-w-0">
            <div className="flex justify-between items-start mb-3">
              <Link href={`/products/${item.productId}`}>
                <h3 className="text-xl font-semibold text-gray-900 hover:text-[#9b78e8] transition-colors line-clamp-2">
                  {item.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2 ml-4">
                {/* <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleWishlist}
                  className="text-gray-400 hover:text-red-500 h-10 w-10 rounded-full"
                  aria-label="Add to wishlist"
                >
                  {isWishlisted ? (
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                </Button> */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemove}
                  className="text-gray-400 hover:text-white hover:bg-[#9b78e8] h-10 w-10 rounded-full"
                  aria-label="Remove item from cart"
                >
                  <XMarkIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Variants */}
            {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {Object.entries(item.selectedVariants).map(([type, value]) => (
                  <Badge key={type} variant="secondary" className="text-sm">
                    {type}: {value}
                  </Badge>
                ))}
              </div>
            )}

            {/* Price and Quantity */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-900">₨{item.price.toFixed(2)}</span>
                  <span className="text-lg text-gray-500">each</span>
                </div>
                <p className="text-sm text-gray-600">
                  {item.availableStock > 0 ? `${item.availableStock} available` : "Out of stock"}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <QuantitySelector
                  quantity={item.quantity}
                  onQuantityChange={(newQuantity) => updateQuantity(item.id, newQuantity)}
                  maxQuantity={item.availableStock}
                />
                <div className="text-right mb-2">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-[#9b78e8]">₨{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItemCard
