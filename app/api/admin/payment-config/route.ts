import { NextRequest } from 'next/server'
import { requireAdmin, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/admin/payment-config - Get payment configuration
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof Response) return authResult

    const config = await prisma.paymentConfig.findFirst({
      select: {
        id: true,
        razorpayKeyId: true,
        isTestMode: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return apiResponse(config || null)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

// POST /api/admin/payment-config - Create/Update payment configuration
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof Response) return authResult

    const body = await request.json()
    const { razorpayKeyId, razorpayKeySecret, isTestMode = true } = body

    if (!razorpayKeyId || !razorpayKeySecret) {
      return apiError('Razorpay Key ID and Key Secret are required', 400)
    }

    // Check if config exists
    const existing = await prisma.paymentConfig.findFirst()

    let result

    if (existing) {
      // Update existing
      result = await prisma.paymentConfig.update({
        where: { id: existing.id },
        data: {
          razorpayKeyId,
          razorpayKeySecret,
          isTestMode
        },
        select: {
          id: true,
          razorpayKeyId: true,
          isTestMode: true
        }
      })
    } else {
      // Create new
      result = await prisma.paymentConfig.create({
        data: {
          razorpayKeyId,
          razorpayKeySecret,
          isTestMode
        },
        select: {
          id: true,
          razorpayKeyId: true,
          isTestMode: true
        }
      })
    }

    return apiResponse({
      ...result,
      message: 'Payment configuration saved successfully'
    })
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

// DELETE /api/admin/payment-config - Delete payment configuration
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof Response) return authResult

    await prisma.paymentConfig.deleteMany()

    return apiResponse({ message: 'Payment configuration deleted successfully' })
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
