"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CouponService } from "@/lib/coupon-service"
import { toast } from "sonner"

interface CouponInputProps {
  orderAmount: number
  onCouponApplied: (discount: number, couponCode: string) => void
  onCouponRemoved: () => void
  appliedCoupon?: string
}

export function CouponInput({ orderAmount, onCouponApplied, onCouponRemoved, appliedCoupon }: CouponInputProps) {
  const [couponCode, setCouponCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return

    setIsLoading(true)
    try {
      const result = CouponService.validateCoupon(couponCode.trim(), orderAmount)

      if (result.valid) {
        onCouponApplied(result.discount, couponCode.trim())
        toast.success(result.message)
        setCouponCode("")
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Failed to apply coupon")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    onCouponRemoved()
    toast.success("Coupon removed")
  }

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-800">Coupon "{appliedCoupon}" applied</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemoveCoupon}
          className="text-green-700 hover:text-green-800 hover:bg-green-100"
        >
          Remove
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Input
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          className="flex-1"
          onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
        />
        <Button
          onClick={handleApplyCoupon}
          disabled={!couponCode.trim() || isLoading}
          variant="outline"
          className="whitespace-nowrap bg-transparent"
        >
          {isLoading ? "Applying..." : "Apply"}
        </Button>
      </div>
      <p className="text-xs text-gray-500">Have a coupon code? Enter it above to get instant discount!</p>
    </div>
  )
}
