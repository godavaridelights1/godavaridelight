import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/admin/payments - Get all payments (admin only)
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    if (user.role !== 'admin') {
      return apiError('Unauthorized', 403)
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const method = searchParams.get('method')

    const where: any = {}

    if (status && status !== 'all') {
      where.paymentStatus = status
    }

    if (method && method !== 'all') {
      where.paymentMethod = method
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
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

    // Transform orders to payments format
    const payments = orders.map(order => ({
      id: order.id,
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: Number(order.total),
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId: order.razorpayPaymentId,
      razorpaySignature: order.razorpaySignature,
      transactionId: order.razorpayPaymentId || order.razorpayOrderId,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      order: {
        user: order.user
      }
    }))

    return apiResponse({ payments })
  } catch (error: any) {
    console.error('Error fetching payments:', error)
    return apiError(error.message, 500)
  }
}

// PATCH /api/admin/payments/[id] - Update payment status (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    if (user.role !== 'admin') {
      return apiError('Unauthorized', 403)
    }

    const body = await request.json()
    const { orderId, paymentStatus } = body

    if (!orderId || !paymentStatus) {
      return apiError('Order ID and payment status are required', 400)
    }

    if (!['pending', 'paid', 'failed'].includes(paymentStatus)) {
      return apiError('Invalid payment status', 400)
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { 
        paymentStatus,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    return apiResponse({ 
      success: true,
      message: 'Payment status updated successfully',
      payment: {
        id: order.id,
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: Number(order.total),
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        razorpayOrderId: order.razorpayOrderId,
        razorpayPaymentId: order.razorpayPaymentId,
        transactionId: order.razorpayPaymentId || order.razorpayOrderId,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        order: {
          user: order.user
        }
      }
    })
  } catch (error: any) {
    console.error('Error updating payment status:', error)
    return apiError(error.message, 500)
  }
}
