import type { Promotion } from "./types"

export class PromotionService {
  private static promotions: Promotion[] = [
    {
      id: "1",
      title: "Festival Special - 25% Off",
      description:
        "Celebrate this festive season with our premium Putharekulu collection. Get 25% off on all festival gift boxes!",
      image: "/festival-indian-sweets-diwali.jpg",
      type: "banner",
      targetAudience: "all",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
      isActive: true,
      clickCount: 156,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "New Customer Welcome",
      description: "Welcome to Atreyapuram Putharekulu! Enjoy 15% off on your first order with code WELCOME15",
      image: "/premium-indian-sweets-gift-box.jpg",
      type: "popup",
      targetAudience: "all",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
      isActive: true,
      clickCount: 89,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date(),
    },
    {
      id: "3",
      title: "Premium Gift Boxes Available",
      description:
        "Perfect for gifting! Our premium gift boxes are now available with custom packaging and express delivery.",
      image: "/indian-sweets-gift-hamper-box.jpg",
      type: "email",
      targetAudience: "subscribers",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
      isActive: true,
      clickCount: 234,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date(),
    },
  ]

  static getAllPromotions(): Promotion[] {
    return this.promotions
  }

  static getActivePromotions(type?: string): Promotion[] {
    return this.promotions.filter(
      (promo) =>
        promo.isActive &&
        new Date() >= promo.startDate &&
        new Date() <= promo.endDate &&
        (!type || promo.type === type),
    )
  }

  static getPromotionById(id: string): Promotion | null {
    return this.promotions.find((promo) => promo.id === id) || null
  }

  static createPromotion(promotion: Omit<Promotion, "id" | "clickCount" | "createdAt" | "updatedAt">): Promotion {
    const newPromotion: Promotion = {
      ...promotion,
      id: Date.now().toString(),
      clickCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.promotions.push(newPromotion)
    return newPromotion
  }

  static updatePromotion(id: string, updates: Partial<Promotion>): Promotion | null {
    const index = this.promotions.findIndex((p) => p.id === id)
    if (index === -1) return null

    this.promotions[index] = { ...this.promotions[index], ...updates, updatedAt: new Date() }
    return this.promotions[index]
  }

  static deletePromotion(id: string): boolean {
    const index = this.promotions.findIndex((p) => p.id === id)
    if (index === -1) return false

    this.promotions.splice(index, 1)
    return true
  }

  static incrementClickCount(id: string): void {
    const promotion = this.promotions.find((p) => p.id === id)
    if (promotion) {
      promotion.clickCount++
      promotion.updatedAt = new Date()
    }
  }

  static getPromotionsByAudience(audience: string): Promotion[] {
    return this.getActivePromotions().filter(
      (promo) => promo.targetAudience === "all" || promo.targetAudience === audience,
    )
  }
}
