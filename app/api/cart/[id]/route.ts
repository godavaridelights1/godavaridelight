import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// PUT /api/cart/[id] - Update cart item quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    const body = await request.json()
    const { quantity } = body

    if (quantity < 1) {
      return apiError('Quantity must be at least 1', 400)
    }

    // Verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: params.id,
        cart: {
          userId: user.id
        }
      },
      include: {
        cart: true
      }
    })

    if (!cartItem) {
      return apiError('Cart item not found', 404)
    }

    // Update cart item
    const updatedItem = await prisma.cartItem.update({
      where: { id: params.id },
      data: { quantity },
      include: {
        product: true
      }
    })

    return apiResponse(updatedItem)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

// DELETE /api/cart/[id] - Remove item from cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    // Verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: params.id,
        cart: {
          userId: user.id
        }
      }
    })

    if (!cartItem) {
      return apiError('Cart item not found', 404)
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: { id: params.id }
    })

    return apiResponse({ message: 'Item removed from cart' })
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
