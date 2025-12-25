"use client"

import { useState, useEffect } from "react"
import { Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PromotionService } from "@/lib/promotion-service"
import type { Promotion } from "@/lib/types"
import Image from "next/image"

export function PromotionPopup() {
  const [popup, setPopup] = useState<Promotion | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if user has seen popup recently
    const lastPopupShown = localStorage.getItem("lastPromotionPopup")
    const now = Date.now()
    const oneHour = 60 * 60 * 1000

    if (!lastPopupShown || now - Number.parseInt(lastPopupShown) > oneHour) {
      const popups = PromotionService.getActivePromotions("popup")
      if (popups.length > 0) {
        // Show popup after 3 seconds
        setTimeout(() => {
          setPopup(popups[0])
          setIsOpen(true)
          localStorage.setItem("lastPromotionPopup", now.toString())
        }, 3000)
      }
    }
  }, [])

  if (!popup) return null

  const handleClick = () => {
    PromotionService.incrementClickCount(popup.id)
    setIsOpen(false)
    window.location.href = "/products"
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-amber-800">
            <Gift className="w-5 h-5" />
            <span>Special Offer!</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <Image src={popup.image || "/placeholder.svg"} alt={popup.title} fill className="object-cover" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-amber-900">{popup.title}</h3>
            <p className="text-gray-600">{popup.description}</p>
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleClick} className="flex-1 bg-amber-600 hover:bg-amber-700">
              Claim Offer
            </Button>
            <Button onClick={handleClose} variant="outline" className="flex-1 bg-transparent">
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
