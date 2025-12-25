export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  inStock: boolean
  featured: boolean
  weight?: string
  ingredients?: string[]
  averageRating?: number
  reviewCount?: number
  nutritionalInfo?: NutritionalInfo
  images?: ProductImage[]
  reviews?: ProductReview[]
  createdAt: Date
  updatedAt: Date
}

export interface ProductImage {
  id: string
  productId: string
  imageUrl: string
  altText?: string
  displayOrder: number
  isPrimary: boolean
  createdAt: Date
}

export interface ProductReview {
  id: string
  productId: string
  userId: string
  rating: number
  title?: string
  comment?: string
  isVerifiedPurchase: boolean
  helpfulCount: number
  userName?: string
  userEmail?: string
  createdAt: Date
  updatedAt: Date
}

export interface NutritionalInfo {
  calories: number
  protein: string
  carbs: string
  fat: string
  sugar: string
  fiber: string
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: "admin" | "customer"
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  shippingAddress: Address
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  quantity: number
  price: number
}

export interface Address {
  name: string
  phone: string
  street: string
  city: string
  state: string
  pincode: string
}

export interface Category {
  id: string
  name: string
  description: string
  image: string
}

export interface Coupon {
  id: string
  code: string
  type: "percentage" | "fixed"
  value: number
  description: string
  minOrderAmount?: number
  maxDiscount?: number
  usageLimit?: number
  usedCount: number
  validFrom: Date
  validUntil: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Newsletter {
  id: string
  email: string
  name?: string
  isActive: boolean
  subscribedAt: Date
  preferences: string[]
}

export interface Promotion {
  id: string
  title: string
  description: string
  image: string
  type: "banner" | "popup" | "email"
  targetAudience: "all" | "subscribers" | "customers"
  startDate: Date
  endDate: Date
  isActive: boolean
  clickCount: number
  createdAt: Date
  updatedAt: Date
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  type: "coupon" | "newsletter" | "promotion" | "order"
  createdAt: Date
  updatedAt: Date
}

export interface ChatMessage {
  id: string
  message: string
  sender: "user" | "bot"
  timestamp: Date
  sessionId: string
}
