"use client"

import { useState } from "react"
import Link from "next/link"
import { ResponsiveImage as Image } from "@/components/responsive-image"
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[min(80dvh,44rem)] max-h-[calc(100dvh-2rem)] w-[calc(100vw-1rem)] max-w-md flex-col overflow-hidden p-0">
        <DialogHeader className="flex shrink-0 flex-row items-center justify-between space-y-0 border-b px-4 py-4 sm:px-6">
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
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="space-y-4 px-4 py-4 sm:px-6">
                {cart.map((item: CartItem) => (
                  <div key={item.id} className="flex items-center gap-3 border-b pb-4 last:border-b-0 sm:gap-4">
                    {/* Product Image */}
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted sm:h-20 sm:w-20">
                      <Image
                        src={item.product.image || "/placeholder.jpg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                      <div>
                        <Link
                          href={`/products/${item.productId}`}
                          className="line-clamp-2 text-sm font-medium transition-colors hover:text-primary"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm font-semibold text-primary mt-1">
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
                          className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          disabled={isUpdating === item.id || item.quantity >= 10}
                          aria-label={`Increase ${item.product.name} quantity`}
                          className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
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
                      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive/80 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 space-y-3 border-t px-4 py-4 sm:px-6">
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
