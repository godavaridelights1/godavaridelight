"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/product-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ProductImageGallery } from "@/components/product-image-gallery"
import { ProductReviews } from "@/components/product-reviews"
import { ProductFAQ } from "@/components/product-faq"
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, ArrowLeft, Plus, Minus, Loader2, CheckCircle } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import type { Product } from "@/lib/types"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart, isLoading: cartLoading } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    loadProduct()
  }, [params.id])

  const loadProduct = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/products/${params.id}`)
      const result = await response.json()
      
      if (response.ok) {
        setProduct(result.data)
      } else {
        toast.error('Product not found')
        router.push('/products')
      }
    } catch (error) {
      console.error('Error loading product:', error)
      toast.error('Failed to load product')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const relatedProducts = product.relatedProducts || []
  const productImages = product.images && product.images.length > 0 
    ? product.images.sort((a: any, b: any) => a.displayOrder - b.displayOrder).map((img: any) => img.url)
    : [product.image]
  const reviews = product.reviews || []

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please sign in to add items to cart")
      router.push('/login')
      return
    }

    if (!product.inStock) {
      toast.error("Product is out of stock")
      return
    }

    try {
      setIsAdding(true)
      await addToCart(product.id, quantity)
      setQuantity(1) // Reset quantity after successfully adding
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleAddToWishlist = () => {
    if (!user) {
      toast.error("Please sign in to add items to wishlist")
      router.push('/login')
      return
    }
    toast.success(`${product.name} has been added to your wishlist.`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">
              Products
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-16">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          {/* Product Image Gallery - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 overflow-hidden">
                <ProductImageGallery images={productImages} productName={product.name} />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge 
                  variant="outline" 
                  className="rounded-full px-4 py-1.5 border-2 text-xs font-semibold bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-200"
                >
                  {product.category}
                </Badge>
                {product.inStock && (
                  <Badge variant="default" className="rounded-full px-4 py-1.5 bg-green-600 text-xs font-semibold">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    In Stock
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {product.description}
              </p>
            </div>

            {/* Rating & Reviews */}
            <div className="flex flex-wrap items-center gap-6 pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 transition-all ${i < Math.round(product.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-foreground">{product.averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground"> ({product.reviewCount} reviews)</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Verified</span> customer ratings
              </div>
            </div>

            {/* Price Section */}
            <div className="space-y-4 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 rounded-2xl p-6 border border-primary/10">
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold text-foreground">₹{product.price.toLocaleString('en-IN')}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-2xl text-muted-foreground line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    <Badge variant="destructive" className="text-lg px-3 py-1 rounded-full">
                      {discountPercentage}% OFF
                    </Badge>
                  </>
                )}
              </div>
              {product.originalPrice && (
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  You save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                </p>
              )}
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {product.weight && (
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Weight</p>
                  <p className="text-lg font-semibold text-foreground">{product.weight}</p>
                </div>
              )}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Stock Status</p>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {product.inStock ? "Available" : "Out of Stock"}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">SKU</p>
                <p className="text-lg font-semibold text-foreground font-mono">PUT-{product.id.slice(0, 8)}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Category</p>
                <p className="text-lg font-semibold text-foreground">{product.category}</p>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-foreground">Select Quantity:</span>
                <div className="flex items-center border-2 border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 w-fit">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="rounded-none hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <span className="px-6 py-2 min-w-[3rem] text-center text-lg font-bold text-foreground border-x border-slate-200 dark:border-slate-800">
                    {quantity}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setQuantity(quantity + 1)} 
                    disabled={quantity >= 10}
                    className="rounded-none hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                <Button 
                  className="col-span-2 h-14 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all" 
                  size="lg" 
                  onClick={handleAddToCart} 
                  disabled={!product.inStock || isAdding || cartLoading}
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
                  size="lg" 
                  onClick={handleAddToWishlist}
                  className="h-14 rounded-xl border-2 font-semibold hover:bg-primary/10"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              <Button 
                variant="outline" 
                className="w-full h-12 rounded-xl border-2 font-semibold hover:bg-primary/10"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center space-y-3">
                <div className="bg-amber-100 dark:bg-amber-900/30 rounded-full h-12 w-12 flex items-center justify-center mx-auto">
                  <Truck className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Free Delivery</p>
                  <p className="text-sm font-medium text-foreground">On orders above ₹500</p>
                </div>
              </div>
              <div className="text-center space-y-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full h-12 w-12 flex items-center justify-center mx-auto">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Authentic</p>
                  <p className="text-sm font-medium text-foreground">100% guaranteed</p>
                </div>
              </div>
              <div className="text-center space-y-3">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-full h-12 w-12 flex items-center justify-center mx-auto">
                  <RotateCcw className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Easy Return</p>
                  <p className="text-sm font-medium text-foreground">7-day policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mb-16">
          <div className="border-b mb-0">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-transparent border-b rounded-none h-auto p-0">
                <TabsTrigger 
                  value="description" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-4 font-semibold"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger 
                  value="ingredients" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-4 font-semibold"
                >
                  Ingredients
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-4 font-semibold"
                >
                  Reviews <span className="ml-2 text-sm">({product.reviewCount})</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="faq" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-4 font-semibold"
                >
                  FAQ
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-10">
                <div className="grid lg:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-4 text-foreground">About This Product</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {product.description} Our {product.name.toLowerCase()} is crafted using traditional methods passed
                        down through generations. Each piece is carefully handmade by our skilled artisans in Atreyapuram
                        village, ensuring authentic taste and texture.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-4 text-foreground">Why Choose Us?</h3>
                      <ul className="space-y-3">
                        {[
                          "Handmade using traditional methods",
                          "Made with pure ghee and organic jaggery",
                          "No artificial preservatives or colors",
                          "Fresh preparation and hygienic packaging",
                          "Perfect for gifting and celebrations"
                        ].map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl p-8 border border-amber-200 dark:border-amber-800">
                    <h3 className="text-xl font-bold mb-6 text-foreground">Product Highlights</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground uppercase mb-2">Taste Profile</p>
                        <p className="text-foreground">Sweet, rich, and authentic traditional flavor</p>
                      </div>
                      <Separator className="bg-amber-200 dark:bg-amber-800" />
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground uppercase mb-2">Best For</p>
                        <p className="text-foreground">Festivals, celebrations, gifting, and personal enjoyment</p>
                      </div>
                      <Separator className="bg-amber-200 dark:bg-amber-800" />
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground uppercase mb-2">Storage</p>
                        <p className="text-foreground">Keep in a cool, dry place for up to 30 days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ingredients" className="mt-10">
                <div className="grid lg:grid-cols-2 gap-10">
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-foreground">Ingredients</h2>
                    {product.ingredients && product.ingredients.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {product.ingredients.map((ingredient: string, index: number) => (
                          <div key={index} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                            <p className="text-sm font-semibold text-foreground text-center">{ingredient}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Ingredient information not available.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-foreground">Nutritional Information</h3>
                    {product.nutritionalInfo && Object.keys(product.nutritionalInfo).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(product.nutritionalInfo).map(([label, value]: [string, any], i: number) => (
                          <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                            <span className="text-sm font-medium text-muted-foreground capitalize">{label}</span>
                            <span className="text-lg font-bold text-foreground">{value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                          <span className="text-sm font-medium text-muted-foreground">Nutritional Information</span>
                          <span className="text-sm text-muted-foreground italic">Not available</span>
                        </div>
                      </div>
                    )}
                    {product.nutritionalInfo && Object.keys(product.nutritionalInfo).length > 0 && (
                      <p className="text-xs text-muted-foreground mt-6 italic">*Values are per serving as specified.</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-10">
                <ProductReviews 
                  reviews={reviews} 
                  averageRating={product.averageRating} 
                  reviewCount={product.reviewCount}
                  onWriteReview={() => toast.info("Review feature coming soon!")}
                />
              </TabsContent>

              <TabsContent value="faq" className="mt-10">
                <ProductFAQ productName={product.name} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="py-16 border-t">
            <div className="mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">You Might Also Like</h2>
              <p className="text-muted-foreground text-lg">Explore similar products from our collection</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct: any) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
