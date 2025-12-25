"use client"

import { SessionProvider } from "next-auth/react"
import { CartProvider } from "@/contexts/cart-context"
import type React from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </SessionProvider>
  )
}
