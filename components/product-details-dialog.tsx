"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, ShoppingCart, Heart, Loader2, X, Plus, Minus, Truck, Shield, RotateCcw } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Product } from "@/lib/types"

interface ProductDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
}

export function ProductDetailsDialog({ open, onOpenChange, product }: ProductDetailsDialogProps) {
  const { addToCart, isLoading: cartLoading } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [selectedImage, setSelectedImage] = useState(product.image)

  // Fetch full product details
  const [fullProduct, setFullProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (open) {
      loadFullProduct()
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
      console.error('Error loading product:', error)
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
      router.push('/login')
      return
    }

    if (!displayProduct.inStock) return

    try {
      setIsAdding(true)
      await addToCart(displayProduct.id, quantity)
      toast.success(`${quantity} item(s) added to cart`)
      setQuantity(1)
      onOpenChange(false)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen max-w-[95vw] h-[98vh] max-h-screen p-0 gap-0 rounded-xl border-0 md:rounded-2xl md:border">
        <DialogHeader className="sr-only">
          <DialogTitle>{displayProduct.name}</DialogTitle>
        </DialogHeader>
        
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-50 rounded-full bg-background/80 p-2 hover:bg-background transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="overflow-y-auto w-full h-full">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0 min-h-full">
            {/* Images Section - Left Side */}
            <div className="md:col-span-2 bg-muted/50 p-4 sm:p-6 md:p-8 flex flex-col gap-4 justify-start">
              {/* Main Image */}
              {/* Main Image */}
              <div className="relative w-full aspect-square bg-background rounded-lg overflow-hidden border-2 border-border shadow-md">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-10 w-10 animate-spin" />
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
                    {discountPercentage > 0 && (
                      <Badge className="absolute top-4 left-4 bg-destructive text-base py-1.5 px-3 font-bold shadow-lg">
                        {discountPercentage}% OFF
                      </Badge>
                    )}
                    {displayProduct.featured && (
                      <Badge className="absolute top-4 right-4 bg-primary text-base py-1.5 px-3 font-bold shadow-lg">Featured</Badge>
                    )}
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all hover:border-primary ${
                        selectedImage === img ? "border-primary ring-2 ring-primary/50" : "border-muted"
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
            
            {/* Details Section - Right Side */}
            <div className="md:col-span-3 p-4 sm:p-6 md:p-8 overflow-y-auto flex flex-col gap-6">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight pr-6">{displayProduct.name}</h1>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4">{displayProduct.description}</p>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground">(4.8) 124 reviews</span>
                </div>

                {/* Price Section */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                  <div>
                    <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">₹{displayProduct.price}</span>
                  </div>
                  {displayProduct.originalPrice && (
                    <div className="flex flex-col gap-1">
                      <span className="text-lg sm:text-xl text-muted-foreground line-through">
                        ₹{displayProduct.originalPrice}
                      </span>
                      <span className="text-sm font-semibold text-green-600">Save ₹{displayProduct.originalPrice - displayProduct.price}</span>
                    </div>
                  )}
                </div>

                {/* Stock Status */}
                {!displayProduct.inStock ? (
                  <Badge variant="destructive" className="mb-6 text-sm py-1.5 px-3">Out of Stock</Badge>
                ) : (
                  <Badge className="mb-6 text-sm py-1.5 px-3 bg-green-600">In Stock</Badge>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-3 border-t border-b py-4">
                {displayProduct.weight && (
                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span className="text-muted-foreground">Weight:</span>
                    <span className="font-semibold">{displayProduct.weight}</span>
                  </div>
                )}
                {displayProduct.category && (
                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-semibold capitalize bg-muted px-3 py-1 rounded-full text-xs sm:text-sm">{displayProduct.category}</span>
                  </div>
                )}
              </div>

              {/* Add to Cart Section */}
              <div className="space-y-4">
                {displayProduct.inStock && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <span className="text-muted-foreground font-medium text-sm sm:text-base">Quantity:</span>
                    <div className="flex items-center gap-2 border rounded-lg w-fit bg-muted/50">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="p-2 sm:p-3 hover:bg-muted disabled:opacity-50 transition-colors"
                      >
                        <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <span className="px-4 sm:px-6 font-bold text-lg sm:text-xl min-w-[2.5rem] text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 sm:p-3 hover:bg-muted transition-colors"
                      >
                        <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!displayProduct.inStock || isAdding || cartLoading}
                    className="w-full text-base sm:text-lg py-5 sm:py-6 font-semibold"
                    size="lg"
                  >
                    {isAdding || cartLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full text-base sm:text-lg py-5 sm:py-6 font-semibold"
                    size="lg"
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Wishlist
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex gap-3">
                  <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Free Delivery</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">On orders above ₹500</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Authentic Products</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">100% genuine and verified</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Easy Returns</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">7-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients and Details Tabs */}
          {(displayProduct.ingredients || displayProduct.nutritionalInfo) && (
            <div className="border-t px-4 sm:px-6 md:px-8 py-6 md:py-8 bg-muted/30">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">More Information</h2>
              <Tabs defaultValue="ingredients" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="ingredients" className="text-sm sm:text-base py-2 sm:py-3">Ingredients</TabsTrigger>
                  <TabsTrigger value="nutrition" className="text-sm sm:text-base py-2 sm:py-3">Nutrition</TabsTrigger>
                </TabsList>
                
                {displayProduct.ingredients && (
                  <TabsContent value="ingredients" className="mt-4">
                    <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {displayProduct.ingredients}
                    </p>
                  </TabsContent>
                )}

                {displayProduct.nutritionalInfo && (
                  <TabsContent value="nutrition" className="mt-4">
                    <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {displayProduct.nutritionalInfo}
                    </p>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
