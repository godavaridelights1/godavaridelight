import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requireAdmin, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/orders/[id] - Get single order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    const where: any = { id: params.id }

    // If not admin, only show own order
    if (user.role !== 'admin') {
      where.userId = user.id
    }

    const order = await prisma.order.findUnique({
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
        },
        address: {
          select: {
            id: true,
            name: true,
            phone: true,
            street: true,
            city: true,
            state: true,
            pincode: true
          }
        }
      }
    })

    if (!order) {
      return apiError('Order not found', 404)
    }

    return NextResponse.json({ data: order, success: true })
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

// PUT /api/orders/[id] - Update order status (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof Response) return authResult

    const body = await request.json()
    const { status, paymentStatus, razorpayPaymentId, razorpaySignature } = body

    const updateData: any = {}
    
    if (status) {
      if (!['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        return apiError('Invalid status', 400)
      }
      updateData.status = status
    }

    if (paymentStatus) {
      if (!['pending', 'completed', 'failed', 'refunded'].includes(paymentStatus)) {
        return apiError('Invalid payment status', 400)
      }
      updateData.paymentStatus = paymentStatus
    }

    if (razorpayPaymentId) {
      updateData.razorpayPaymentId = razorpayPaymentId
    }

    if (razorpaySignature) {
      updateData.razorpaySignature = razorpaySignature
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({ data: order, success: true })
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

// DELETE /api/orders/[id] - Cancel order
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: params.id }
    })

    if (!order) {
      return apiError('Order not found', 404)
    }

    // Check permission
    if (user.role !== 'admin' && order.userId !== user.id) {
      return apiError('Unauthorized', 403)
    }

    // Only allow cancellation if order is pending or confirmed
    if (!['pending', 'confirmed'].includes(order.status)) {
      return apiError('Order cannot be cancelled', 400)
    }

    await prisma.order.update({
      where: { id: params.id },
      data: { status: 'cancelled' }
    })

    return apiResponse({ message: 'Order cancelled successfully' })
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
