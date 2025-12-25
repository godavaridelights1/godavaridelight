"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface CartItem {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    description: string
    price: number
    originalPrice: number | null
    image: string
    category: string
    inStock: boolean
    weight: string
  }
}

interface CartContextType {
  cart: CartItem[]
  isLoading: boolean
  addToCart: (productId: string, quantity?: number) => Promise<void>
  removeFromCart: (cartItemId: string) => Promise<void>
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getCartTotal: () => number
  getCartCount: () => number
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user, session } = useAuth()

  // Load cart when user changes - only depend on user.id to avoid infinite loops
  useEffect(() => {
    if (user?.id && session) {
      loadCart()
    } else {
      setCart([])
    }
  }, [user?.id]) // Only re-run when user ID changes, not the entire user object

  const loadCart = async () => {
    if (!user || !session) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/cart')
      
      if (!response.ok) {
        throw new Error('Failed to load cart')
      }

      const data = await response.json()
      // API wraps response in { data: { cart: [...] } }
      const cartData = data.data?.cart || data.cart || []
      setCart(cartData)
    } catch (error) {
      console.error("Error loading cart:", error)
      toast.error("Failed to load cart")
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user || !session) {
      throw new Error("Please sign in to add items to cart")
    }

    try {
      setIsLoading(true)

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, quantity })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || 'Failed to add to cart')
      }

      const result = await response.json()
      await loadCart()
      toast.success("Item added to cart successfully!")
      return result
    } catch (error: any) {
      console.error("Error adding to cart:", error)
      toast.error(error.message || "Failed to add item to cart")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (cartItemId: string) => {
    if (!user || !session) return

    try {
      setIsLoading(true)

      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to remove item')
      }

      await loadCart()
      toast.success("Item removed from cart")
    } catch (error: any) {
      console.error("Error removing from cart:", error)
      toast.error(error.message || "Failed to remove item")
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (!user || !session) return
    if (quantity < 1) return

    try {
      setIsLoading(true)

      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update quantity')
      }

      await loadCart()
    } catch (error: any) {
      console.error("Error updating quantity:", error)
      toast.error(error.message || "Failed to update quantity")
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    if (!user || !session) return

    try {
      setIsLoading(true)

      const response = await fetch('/api/cart', {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to clear cart')
      }

      setCart([])
      toast.success("Cart cleared")
    } catch (error: any) {
      console.error("Error clearing cart:", error)
      toast.error(error.message || "Failed to clear cart")
    } finally {
      setIsLoading(false)
    }
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.product.price * item.quantity)
    }, 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const refreshCart = async () => {
    await loadCart()
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
