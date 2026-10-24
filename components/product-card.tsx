"use client"

import Link from "next/link"
import { useState } from "react"
import { ResponsiveImage } from "@/components/responsive-image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, Loader2 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (!user) {
      router.push('/login')
      return
    }

    if (!product.inStock) return

    try {
      setIsAdding(true)
      await addToCart(product.id, 1)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Card className="group min-w-0 overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <ResponsiveImage
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
          />
        </Link>
        {discountPercentage > 0 && (
          <Badge className="absolute top-2 left-2 bg-destructive">{discountPercentage}% OFF</Badge>
        )}
        {product.featured && <Badge className="absolute top-2 right-2 bg-primary">Featured</Badge>}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary">Out of Stock</Badge>
          </div>
        )}
      </div>

      <CardContent className="min-w-0 p-2 sm:p-4">
        <div className="space-y-2">
          <h3 className="line-clamp-2 text-sm font-semibold sm:text-lg">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

          <div className="flex min-w-0 items-center space-x-0.5 sm:space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 shrink-0 fill-yellow-400 text-yellow-400 sm:h-4 sm:w-4" />
            ))}
            <span className="ml-1 text-xs text-muted-foreground sm:ml-2 sm:text-sm">(4.8)</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2">
            <span className="text-base font-bold sm:text-xl">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through sm:text-sm">₹{product.originalPrice}</span>
            )}
          </div>

          {product.weight && (
            <Badge variant="outline" className="text-xs">
              {product.weight}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-2 pt-0 sm:p-4 sm:pt-0">
        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <Link href={`/products/${product.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full bg-transparent px-2 text-xs sm:text-sm">
              View Details
            </Button>
          </Link>
          <Button 
            size="sm"
            className="flex-1 px-2 text-xs sm:text-sm"
            disabled={!product.inStock || isAdding}
            onClick={handleAddToCart}
          >
            {isAdding ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
