"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
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
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart()
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
      setIsUpdating(cartItemId)
    }
  }

  const handleRemove = async (cartItemId: string) => {
    try {
      await removeFromCart(cartItemId)
      toast.success("Item removed from cart")
    } catch (error) {
      toast.error("Failed to remove item")
    }
  }

  const cartTotal = getCartTotal()
  const isEmpty = cart.length === 0
  const cartCount = cart.length

  return (
    <div className="relative">
      {/* Cart Icon Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-muted rounded-lg transition-colors"
      >
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs font-bold">
            {cartCount > 9 ? "9+" : cartCount}
          </div>
        )}
      </button>

      {/* Mega Menu Dropdown */}
      {isOpen && (
        <div
          ref={menuRef}
          className="fixed md:absolute right-4 md:right-0 top-[70px] md:top-full md:mt-3 w-[calc(100vw-32px)] md:w-96 max-h-[60vh] md:max-h-none bg-background border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 md:px-6 py-3 md:py-4 border-b">
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
              <div className="max-h-96 overflow-y-auto">
                <div className="divide-y">
                  {cart.map((item: CartItem) => (
                    <div key={item.id} className="px-3 md:px-6 py-3 md:py-4 hover:bg-muted/50 transition-colors">
                      <div className="flex gap-2 md:gap-4">
                        {/* Product Image */}
                        <div className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={item.product.image || "/placeholder.jpg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <Link
                              href={`/products/${item.productId}`}
                              onClick={() => setIsOpen(false)}
                              className="font-medium hover:text-primary transition-colors line-clamp-2 text-xs md:text-sm"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-primary font-semibold text-xs md:text-sm mt-0.5 md:mt-1">
                              ₹{item.product.price.toFixed(2)}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              disabled={isUpdating === item.id || item.quantity <= 1}
                              className="p-0.5 hover:bg-primary/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-5 text-center text-xs font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              disabled={isUpdating === item.id}
                              className="p-0.5 hover:bg-primary/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-muted/30 px-4 md:px-6 py-3 md:py-4 border-t space-y-3 md:space-y-4">
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
                    <Button className="w-full text-sm">View Full Cart</Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full text-sm"
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
