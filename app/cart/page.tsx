"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/contexts/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"
import Image from "next/image"
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
        <Footer />
      </div>
    )
  }

  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setUpdatingItems(prev => new Set(prev).add(cartItemId))
    await updateQuantity(cartItemId, newQuantity)
    setUpdatingItems(prev => {
      const newSet = new Set(prev)
      newSet.delete(cartItemId)
      return newSet
    })
  }

  const handleRemoveItem = async (cartItemId: string) => {
    setUpdatingItems(prev => new Set(prev).add(cartItemId))
    await removeFromCart(cartItemId)
    setUpdatingItems(prev => {
      const newSet = new Set(prev)
      newSet.delete(cartItemId)
      return newSet
    })
  }

  const subtotal = getCartTotal()
  const deliveryCharge = subtotal >= 500 ? 0 : 50
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
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Shopping Cart ({getCartCount()} items)</h1>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearCart}
                  disabled={isLoading}
                >
                  Clear Cart
                </Button>
              </div>

              {cart.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
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
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={updatingItems.has(item.id) || isLoading}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updatingItems.has(item.id) || isLoading}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-4 py-2 min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= 10 || updatingItems.has(item.id) || isLoading}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="font-bold text-lg">
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
                    {subtotal < 500 && (
                      <p className="text-xs text-muted-foreground">
                        Add ₹{(500 - subtotal).toFixed(2)} more for free delivery
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
                      Free shipping on orders above ₹500
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      100% secure payment
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      7-day return policy
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
