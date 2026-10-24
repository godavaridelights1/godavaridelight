"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ResponsiveImage } from "@/components/responsive-image"
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"

interface CartItem {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    image: string
    price: number
    originalPrice?: number | null
  }
}

export function QuickCartMenu() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        triggerRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleQuantityChange = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setIsUpdating(cartItemId)
    try {
      await updateQuantity(cartItemId, newQuantity)
    } catch (error) {
      toast.error("Failed to update quantity")
    } finally {
      setIsUpdating(null)
    }
  }

  const handleRemove = async (cartItemId: string) => {
    setIsUpdating(cartItemId)
    try {
      await removeFromCart(cartItemId)
      toast.success("Item removed from cart")
    } catch (error) {
      toast.error("Failed to remove item")
    } finally {
      setIsUpdating(null)
    }
  }

  const cartTotal = getCartTotal()
  const isEmpty = cart.length === 0
  const cartCount = getCartCount()

  return (
    <div className="relative">
      {/* Cart Icon Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Shopping cart, ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
        className="relative p-2 hover:bg-muted rounded-lg transition-colors"
      >
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <span aria-hidden="true" className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
      </button>

      {/* Mega Menu Dropdown */}
      {isOpen && (
        <div
          ref={menuRef}
          className="fixed left-2 right-2 top-[calc(env(safe-area-inset-top)+5rem)] z-50 flex max-h-[calc(100dvh-6rem)] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl md:absolute md:left-auto md:right-0 md:top-full md:mt-3 md:w-[min(28rem,calc(100vw-2rem))]"
        >
          {/* Header */}
          <div className="shrink-0 border-b bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3 sm:px-6 sm:py-4">
            <h3 className="font-bold text-base md:text-lg">Shopping Cart</h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              {isEmpty ? "Your cart is empty" : `${cartCount} item${cartCount !== 1 ? "s" : ""}`}
            </p>
          </div>

          {isEmpty ? (
            // Empty State
            <div className="px-6 py-12 text-center">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-muted-foreground mb-4">No items in cart yet</p>
              <Link href="/products" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <div className="divide-y">
                  {cart.map((item: CartItem) => (
                    <div key={item.id} className="px-3 py-3 transition-colors hover:bg-muted/50 sm:px-5 sm:py-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* Product Image */}
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted sm:h-20 sm:w-20">
                          <ResponsiveImage
                            src={item.product.image || "/placeholder.jpg"}
                            alt={item.product.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                          <div>
                            <Link
                              href={`/products/${item.productId}`}
                              onClick={() => setIsOpen(false)}
                              className="line-clamp-2 text-sm font-medium transition-colors hover:text-primary sm:text-base"
                            >
                              {item.product.name}
                            </Link>
                            <p className="mt-1 text-sm font-semibold text-primary">
                              ₹{item.product.price.toFixed(2)}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="inline-flex w-fit items-center gap-1 rounded-lg border bg-background p-0.5">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              disabled={isUpdating === item.id || item.quantity <= 1}
                              aria-label={`Decrease ${item.product.name} quantity`}
                              className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-8 text-center text-sm font-semibold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              disabled={isUpdating === item.id || item.quantity >= 10}
                              aria-label={`Increase ${item.product.name} quantity`}
                              className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={isUpdating === item.id}
                          aria-label={`Remove ${item.product.name} from cart`}
                          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="shrink-0 space-y-3 border-t bg-muted/30 px-4 py-3 sm:space-y-4 sm:px-6 sm:py-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm md:text-base">Subtotal</span>
                  <span className="text-base md:text-lg font-bold text-primary">
                    ₹{cartTotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping and taxes calculated at checkout
                </p>

                <Separator />

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Link href="/cart" onClick={() => setIsOpen(false)} className="block">
                    <Button className="min-h-11 w-full text-sm">View Full Cart</Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="min-h-11 w-full text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
