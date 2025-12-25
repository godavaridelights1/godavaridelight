import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/orders - Get user's orders or all orders (admin)
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = {}

    // If not admin, only show own orders
    if (user.role !== 'admin') {
      where.userId = user.id
    }

    if (status) {
      where.status = status
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                description: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ data: orders, success: true })
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    const body = await request.json()
    const {
      items,
      addressId,
      paymentMethod,
      couponCode,
      notes
    } = body

    if (!items || items.length === 0) {
      return apiError('Order must contain at least one item', 400)
    }

    if (!addressId) {
      return apiError('Shipping address is required', 400)
    }

    if (!paymentMethod || !['cod', 'online'].includes(paymentMethod)) {
      return apiError('Valid payment method is required', 400)
    }

    // Calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      })

      if (!product) {
        return apiError(`Product ${item.productId} not found`, 404)
      }

      if (!product.inStock) {
        return apiError(`Product ${product.name} is out of stock`, 400)
      }

      const itemTotal = Number(product.price) * item.quantity
      subtotal += itemTotal

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: Number(product.price)
      })
    }

    let discount = 0
    let appliedCoupon = null

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: couponCode.toUpperCase(),
          isActive: true
        }
      })

      if (coupon) {
        const now = new Date()
        const validFrom = new Date(coupon.validFrom)
        const validTo = new Date(coupon.validTo)

        if (now >= validFrom && now <= validTo) {
          if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
            const minOrderValue = coupon.minOrderValue ? Number(coupon.minOrderValue) : 0
            if (subtotal >= minOrderValue) {
              if (coupon.discountType === 'percentage') {
                discount = (subtotal * Number(coupon.discountValue)) / 100
                const maxDiscount = coupon.maxDiscount ? Number(coupon.maxDiscount) : null
                if (maxDiscount && discount > maxDiscount) {
                  discount = maxDiscount
                }
              } else {
                discount = Number(coupon.discountValue)
              }
              appliedCoupon = coupon
            }
          }
        }
      }
    }

    const deliveryCharge = subtotal >= 500 ? 0 : 50
    const total = subtotal - discount + deliveryCharge

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order with items in a transaction
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderNumber,
        subtotal,
        discount,
        deliveryCharge,
        total,
        status: 'pending',
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
        addressId,
        couponCode: appliedCoupon?.code || null,
        notes,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // Update coupon usage
    if (appliedCoupon) {
      await prisma.coupon.update({
        where: { id: appliedCoupon.id },
        data: { usedCount: appliedCoupon.usedCount + 1 }
      })
    }

    // Clear user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id }
    })

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      })
    }

    return apiResponse({
      order,
      message: 'Order created successfully'
    }, 201)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
