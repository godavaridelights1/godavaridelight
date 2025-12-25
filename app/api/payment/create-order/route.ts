import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'
import Razorpay from 'razorpay'

// POST /api/payment/create-order - Create Razorpay order
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return apiError('Order ID is required', 400)
    }

    // Get order details
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id
      }
    })

    if (!order) {
      return apiError('Order not found', 404)
    }

    if (order.paymentStatus !== 'pending') {
      return apiError('Payment already processed', 400)
    }

    // Get Razorpay configuration from database
    const paymentConfig = await prisma.paymentConfig.findFirst()

    let razorpayKeyId = process.env.RAZORPAY_KEY_ID
    let razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET
    let isTestMode = true

    // Use database config if available
    if (paymentConfig) {
      razorpayKeyId = paymentConfig.razorpayKeyId || razorpayKeyId
      razorpayKeySecret = paymentConfig.razorpayKeySecret || razorpayKeySecret
      isTestMode = paymentConfig.isTestMode ?? true
    }

    if (!razorpayKeyId || !razorpayKeySecret) {
      return apiError('Payment gateway not configured. Please configure Razorpay keys in Admin Settings.', 400)
    }

    // Validate keys are not empty strings
    if (!razorpayKeyId.trim() || !razorpayKeySecret.trim()) {
      return apiError('Razorpay keys are empty. Please configure valid keys in Admin Settings.', 400)
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret
    })

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(Number(order.total) * 100), // Amount in paise
      currency: 'INR',
      receipt: order.id,
      notes: {
        orderId: order.id,
        userId: user.id
      }
    })

    // Update order with Razorpay order ID
    await prisma.order.update({
      where: { id: orderId },
      data: { razorpayOrderId: razorpayOrder.id }
    })

    return apiResponse({
      razorpayOrderId: razorpayOrder.id,
      razorpayKeyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      order: {
        id: order.id,
        total: order.total
      }
    })
  } catch (error: any) {
    console.error('Payment creation error:', error)
    return apiError(error.message || 'Failed to create payment order', 500)
  }
}
