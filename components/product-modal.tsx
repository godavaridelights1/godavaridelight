"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Star, ShoppingCart, Heart, Plus, Minus, Loader2, Truck, Shield, RotateCcw, Check } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Product } from "@/lib/types"

interface ProductModalProps {
  open: boolean
  onClose: () => void
  product: Product
}

export function ProductModal({ open, onClose, product }: ProductModalProps) {
  const { addToCart, isLoading: cartLoading } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [selectedImage, setSelectedImage] = useState(product.image)
  const [fullProduct, setFullProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      loadFullProduct()
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [open, product.id])

  const loadFullProduct = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/products/${product.id}`)
      const result = await response.json()
      if (response.ok) {
        setFullProduct(result.data)
        setSelectedImage(result.data.image)
      }
    } catch (error) {
      console.error("Error loading product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const displayProduct = fullProduct || product
  const productImages = displayProduct.images && displayProduct.images.length > 0
    ? displayProduct.images.sort((a: any, b: any) => a.displayOrder - b.displayOrder).map((img: any) => img.url)
    : [displayProduct.image]

  const discountPercentage = displayProduct.originalPrice
    ? Math.round(((displayProduct.originalPrice - displayProduct.price) / displayProduct.originalPrice) * 100)
    : 0

  const handleAddToCart = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (!displayProduct.inStock) return

    try {
      setIsAdding(true)
      await addToCart(displayProduct.id, quantity)
      toast.success(`${quantity} item(s) added to cart`)
      setQuantity(1)
      onClose()
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add to cart")
    } finally {
      setIsAdding(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      {/* Modal Container */}
      <div className="relative w-[95vw] h-[90vh] max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
        >
          <X className="h-7 w-7 text-gray-700" />
        </button>

        {/* Main Content - Two Column Layout */}
        <div className="flex h-full gap-0">
          {/* LEFT SIDE - IMAGE SECTION */}
          <div className="w-2/5 bg-gray-50 border-r border-gray-200 p-8 overflow-y-auto flex flex-col gap-6">
            {/* Main Product Image */}
            <div className="relative w-full aspect-square bg-white rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm flex-shrink-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <Image
                    src={selectedImage || "/placeholder.svg"}
                    alt={displayProduct.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Discount Badge */}
                  {discountPercentage > 0 && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                      -{discountPercentage}%
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden border-3 transition-all ${
                      selectedImage === img
                        ? "border-primary shadow-lg scale-105"
                        : "border-gray-300 hover:border-primary"
                    }`}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${displayProduct.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE - DETAILS SECTION */}
          <div className="w-3/5 p-8 overflow-y-auto flex flex-col gap-6">
            {/* Title & Description */}
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {displayProduct.name}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                {displayProduct.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600 font-semibold">(4.8) 124 reviews</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-2xl border-2 border-primary/30">
              <div className="flex flex-col gap-3">
                <span className="text-6xl font-bold text-primary">₹{displayProduct.price}</span>
                {displayProduct.originalPrice && (
                  <div className="flex items-center gap-4">
                    <span className="text-2xl text-gray-500 line-through">₹{displayProduct.originalPrice}</span>
                    <span className="text-lg font-bold text-green-600">
                      Save ₹{displayProduct.originalPrice - displayProduct.price}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Stock & Category */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${displayProduct.inStock ? "bg-green-600" : "bg-red-600"}`}></div>
                <span className={`font-bold text-lg ${displayProduct.inStock ? "text-green-600" : "text-red-600"}`}>
                  {displayProduct.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              {displayProduct.weight && (
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-bold text-gray-900">{displayProduct.weight}</span>
                </div>
              )}
              {displayProduct.category && (
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-bold text-gray-900 capitalize bg-primary/10 px-4 py-2 rounded-full">
                    {displayProduct.category}
                  </span>
                </div>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            {displayProduct.inStock && (
              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <span className="text-xl font-bold text-gray-900">Quantity:</span>
                  <div className="flex items-center gap-4 border-2 border-gray-300 rounded-xl bg-gray-50 p-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-200 disabled:opacity-30 transition-all"
                    >
                      <Minus className="h-6 w-6" />
                    </button>
                    <span className="px-8 font-bold text-2xl min-w-[3.5rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-200 transition-all"
                    >
                      <Plus className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || cartLoading}
                  className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 text-xl h-16"
                >
                  {isAdding || cartLoading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-6 w-6" />
                      Add to Cart
                    </>
                  )}
                </button>

                <button className="w-full border-3 border-primary text-primary hover:bg-primary/10 font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 text-xl h-16">
                  <Heart className="h-6 w-6" />
                  Add to Wishlist
                </button>
              </div>
            )}

            {/* Features */}
            <div className="space-y-3 pt-4 border-t-2 border-gray-200">
              <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                <Truck className="h-7 w-7 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-gray-900 text-lg">Free Delivery</p>
                  <p className="text-gray-600">On orders above ₹500</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                <Shield className="h-7 w-7 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-gray-900 text-lg">Authentic Products</p>
                  <p className="text-gray-600">100% genuine verified</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                <RotateCcw className="h-7 w-7 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-gray-900 text-lg">Easy Returns</p>
                  <p className="text-gray-600">7-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop - Click to close */}
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
      ></div>
    </div>
  )
}
