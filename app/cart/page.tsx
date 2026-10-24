"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/contexts/cart-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"
import { ResponsiveImage as Image } from "@/components/responsive-image"
import Link from "next/link"
import { useState } from "react"

export default function CartPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { 
    cart, 
    isLoading, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    getCartCount 
  } = useCart()

  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-8">Sign in to view your cart</p>
          <Link href="/login?redirect=/cart">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setUpdatingItems(prev => new Set(prev).add(cartItemId))
    try {
      await updateQuantity(cartItemId, newQuantity)
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(cartItemId)
        return newSet
      })
    }
  }

  const handleRemoveItem = async (cartItemId: string) => {
    setUpdatingItems(prev => new Set(prev).add(cartItemId))
    try {
      await removeFromCart(cartItemId)
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(cartItemId)
        return newSet
      })
    }
  }

  const subtotal = getCartTotal()
  const deliveryCharge = subtotal >= 1500 ? 0 : 100
  const total = subtotal + deliveryCharge

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-foreground">Shopping Cart</span>
        </nav>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : cart.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Add some delicious items to your cart!</p>
            <Link href="/products">
              <Button>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-bold">Shopping Cart ({getCartCount()} items)</h1>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearCart}
                  disabled={isLoading}
                  className="min-h-10"
                >
                  Clear Cart
                </Button>
              </div>

              {cart.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-3 sm:gap-4">
                      {/* Product Image */}
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-24">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <Link 
                              href={`/products/${item.productId}`}
                              className="font-semibold hover:text-primary line-clamp-1"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {item.product.description}
                            </p>
                            {item.product.weight && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                {item.product.weight}
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={updatingItems.has(item.id) || isLoading}
                            aria-label={`Remove ${item.product.name} from cart`}
                            className="h-11 w-11 shrink-0"
                          >
                            <Trash2 className="h-5 w-5 text-destructive" />
                          </Button>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center rounded-lg border bg-background">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updatingItems.has(item.id) || isLoading}
                              aria-label={`Decrease ${item.product.name} quantity`}
                              className="h-11 w-11"
                            >
                              <Minus className="h-5 w-5" />
                            </Button>
                            <span className="min-w-12 px-2 py-2 text-center font-medium tabular-nums">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= 10 || updatingItems.has(item.id) || isLoading}
                              aria-label={`Increase ${item.product.name} quantity`}
                              className="h-11 w-11"
                            >
                              <Plus className="h-5 w-5" />
                            </Button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-right text-base font-bold sm:text-lg">
                              ₹{(item.product.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ₹{item.product.price} each
                            </div>
                          </div>
                        </div>

                        {!item.product.inStock && (
                          <Badge variant="destructive" className="mt-2">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-bold">Order Summary</h2>
                  
                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Charge</span>
                      <span className={`font-medium ${deliveryCharge === 0 ? 'text-green-600' : ''}`}>
                        {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                      </span>
                    </div>
                    {subtotal < 1500 && (
                      <p className="text-xs text-muted-foreground">
                        Add ₹{(1500 - subtotal).toFixed(2)} more for free delivery
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold">₹{total.toFixed(2)}</span>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => router.push('/checkout')}
                    disabled={isLoading || cart.some(item => !item.product.inStock)}
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>

                  <Link href="/products" className="block">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>

                  {/* Benefits */}
                  <div className="pt-4 space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      Free shipping on orders of ₹1,500 or more
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      100% secure payment
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      No returns or refunds
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
