"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Review } from "@/lib/types"
import { getReviewsByProductId } from "@/services/productService"
import ReviewItem from "./ReviewItem"
import { ArrowPathIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ReviewListProps {
  productId: string
  refreshReviewsSignal: number // A changing number to trigger re-fetch
}

const ReviewList: React.FC<ReviewListProps> = ({ productId, refreshReviewsSignal }) => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const fetchedReviews = await getReviewsByProductId(productId)
        setReviews(fetchedReviews)
      } catch (err) {
        console.error(`Error fetching reviews for product ${productId}:`, err)
        setError("Could not load reviews at this time.")
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchReviews()
    }
  }, [productId, refreshReviewsSignal])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <ArrowPathIcon className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading reviews...</p>
        <p className="text-sm text-gray-500">Please wait while we fetch customer feedback</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
        <AlertTitle className="text-red-900">Error Loading Reviews</AlertTitle>
        <AlertDescription className="text-red-700">{error}</AlertDescription>
      </Alert>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-16 px-6">
        <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ChatBubbleLeftEllipsisIcon className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Be the first to share your experience with this product! Your review helps other customers make informed
          decisions.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Customer Reviews ({reviews.length})</h3>
      </div>
      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}

export default ReviewList
