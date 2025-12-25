"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"

interface QuickCartDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

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

export function QuickCartDialog({ open, onOpenChange }: QuickCartDialogProps) {
  const { cart, removeFromCart, updateQuantity, getCartTotal, isLoading } = useCart()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
          <DialogTitle>Your Cart</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        {isEmpty ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">🛒</div>
              <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start adding items to get started!
              </p>
              <Button
                onClick={() => onOpenChange(false)}
                asChild
                className="w-full"
              >
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-4 space-y-4">
                {cart.map((item: CartItem) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                    {/* Product Image */}
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={item.product.image || "/placeholder.jpg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/products/${item.productId}`}
                          className="text-sm font-medium hover:text-primary transition-colors line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm font-semibold text-primary mt-1">
                          ₹{item.product.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={isUpdating === item.id || item.quantity <= 1}
                          className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          disabled={isUpdating === item.id}
                          className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors flex-shrink-0 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout
              </p>
              
              <Separator />

              <div className="space-y-2">
                <Button
                  onClick={() => onOpenChange(false)}
                  asChild
                  className="w-full"
                >
                  <Link href="/cart">View Full Cart</Link>
                </Button>
                <Button
                  onClick={() => onOpenChange(false)}
                  variant="outline"
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
