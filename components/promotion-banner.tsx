"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PromotionService } from "@/lib/promotion-service"
import type { Promotion } from "@/lib/types"
import Image from "next/image"

export function PromotionBanner() {
  const [banners, setBanners] = useState<Promotion[]>([])
  const [currentBanner, setCurrentBanner] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const activeBanners = PromotionService.getActivePromotions("banner")
    setBanners(activeBanners)
  }, [])

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length)
      }, 5000) // Change banner every 5 seconds

      return () => clearInterval(interval)
    }
  }, [banners.length])

  if (!isVisible || banners.length === 0) return null

  const banner = banners[currentBanner]

  const handleClick = () => {
    PromotionService.incrementClickCount(banner.id)
    // Navigate to products or specific promotion page
    window.location.href = "/products"
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  return (
    <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={banner.image || "/placeholder.svg"} alt={banner.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-amber-900 truncate">{banner.title}</h3>
              <p className="text-sm text-amber-700 truncate">{banner.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button onClick={handleClick} size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
              Shop Now
            </Button>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {banners.length > 1 && (
          <div className="flex justify-center mt-2 space-x-1">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentBanner ? "bg-amber-600" : "bg-amber-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
