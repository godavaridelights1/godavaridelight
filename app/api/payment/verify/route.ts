import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// POST /api/payment/verify - Verify Razorpay payment
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    const body = await request.json()
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderId 
    } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return apiError('Missing payment details', 400)
    }

    // Get order
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id
      }
    })

    if (!order) {
      return apiError('Order not found', 404)
    }

    // Get Razorpay configuration
    const paymentConfig = await prisma.paymentConfig.findFirst()

    let razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET

    if (paymentConfig) {
      razorpayKeySecret = paymentConfig.razorpayKeySecret || razorpayKeySecret
    }

    if (!razorpayKeySecret) {
      return apiError('Payment gateway not configured', 500)
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      // Update order as failed
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'failed',
          razorpayPaymentId: razorpay_payment_id
        }
      })

      return apiError('Payment verification failed', 400)
    }

    // Update order as completed
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'paid',
        razorpayPaymentId: razorpay_payment_id,
        status: 'confirmed'
      }
    })

    return apiResponse({
      success: true,
      message: 'Payment verified successfully',
      orderId
    })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return apiError(error.message || 'Failed to verify payment', 500)
  }
}
