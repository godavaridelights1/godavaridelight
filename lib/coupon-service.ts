import type { Coupon } from "./types"

export class CouponService {
  private static coupons: Coupon[] = [
    {
      id: "1",
      code: "WELCOME10",
      type: "percentage",
      value: 10,
      description: "Welcome discount for new customers",
      minOrderAmount: 500,
      usageLimit: 100,
      usedCount: 25,
      validFrom: new Date("2024-01-01"),
      validUntil: new Date("2024-12-31"),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      code: "FESTIVAL50",
      type: "fixed",
      value: 50,
      description: "Festival special discount",
      minOrderAmount: 300,
      usageLimit: 200,
      usedCount: 45,
      validFrom: new Date("2024-01-01"),
      validUntil: new Date("2024-12-31"),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  static getAllCoupons(): Coupon[] {
    return this.coupons
  }

  static getCouponByCode(code: string): Coupon | null {
    return (
      this.coupons.find(
        (coupon) =>
          coupon.code.toLowerCase() === code.toLowerCase() &&
          coupon.isActive &&
          new Date() >= coupon.validFrom &&
          new Date() <= coupon.validUntil,
      ) || null
    )
  }

  static validateCoupon(code: string, orderAmount: number): { valid: boolean; discount: number; message: string } {
    const coupon = this.getCouponByCode(code)

    if (!coupon) {
      return { valid: false, discount: 0, message: "Invalid coupon code" }
    }

    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required`,
      }
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, discount: 0, message: "Coupon usage limit exceeded" }
    }

    let discount = 0
    if (coupon.type === "percentage") {
      discount = (orderAmount * coupon.value) / 100
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount
      }
    } else {
      discount = coupon.value
    }

    return {
      valid: true,
      discount,
      message: `Coupon applied! You saved ₹${discount}`,
    }
  }

  static createCoupon(coupon: Omit<Coupon, "id" | "createdAt" | "updatedAt">): Coupon {
    const newCoupon: Coupon = {
      ...coupon,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.coupons.push(newCoupon)
    return newCoupon
  }

  static updateCoupon(id: string, updates: Partial<Coupon>): Coupon | null {
    const index = this.coupons.findIndex((c) => c.id === id)
    if (index === -1) return null

    this.coupons[index] = { ...this.coupons[index], ...updates, updatedAt: new Date() }
    return this.coupons[index]
  }

  static deleteCoupon(id: string): boolean {
    const index = this.coupons.findIndex((c) => c.id === id)
    if (index === -1) return false

    this.coupons.splice(index, 1)
    return true
  }

  static generateCouponCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}
