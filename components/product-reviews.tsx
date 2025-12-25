"use client"

import { useState } from "react"
import { Star, ThumbsUp, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Review {
  id: string
  rating: number
  comment?: string
  user: {
    name: string
  }
  createdAt: string
  isVerifiedPurchase?: boolean
}

interface ProductReviewsProps {
  reviews: Review[]
  averageRating: number
  reviewCount: number
  onWriteReview?: () => void
}

export function ProductReviews({ reviews, averageRating, reviewCount, onWriteReview }: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState("recent")
  const [filterRating, setFilterRating] = useState("all")

  const sortedAndFilteredReviews = reviews
    .filter((review) => filterRating === "all" || review.rating === parseInt(filterRating))
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "rating-high":
          return b.rating - a.rating
        case "rating-low":
          return a.rating - b.rating
        case "helpful":
          return 0 // Would require a helpful field
        default:
          return 0
      }
    })

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (reviews.filter((r) => r.rating === rating).length / Math.max(reviews.length, 1)) * 100,
  }))

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex items-center justify-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">Based on {reviewCount} reviews</p>
        </div>

        {/* Rating Distribution */}
        <div className="col-span-1 md:col-span-2 space-y-3">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="rating-high">Highest Rating</SelectItem>
              <SelectItem value="rating-low">Lowest Rating</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {onWriteReview && (
          <Button onClick={onWriteReview} className="w-full sm:w-auto">
            Write a Review
          </Button>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedAndFilteredReviews.length > 0 ? (
          sortedAndFilteredReviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-600/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-600">{review.user.name?.charAt(0) || "U"}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{review.user.name || "Anonymous"}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                {review.isVerifiedPurchase && (
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">{review.rating} out of 5</span>
              </div>

              {/* Comment */}
              {review.comment && <p className="text-gray-700 mb-4">{review.comment}</p>}

              {/* Helpful button */}
              <div className="flex items-center gap-2 pt-3 border-t">
                <Button variant="ghost" size="sm" className="text-xs">
                  <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                  Helpful
                </Button>
                <span className="text-xs text-gray-500">Was this helpful?</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No reviews yet for the selected filter.</p>
            {onWriteReview && (
              <Button onClick={onWriteReview} variant="outline">
                Be the first to review
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
