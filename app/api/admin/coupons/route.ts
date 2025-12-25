import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/admin/coupons - Get all coupons (admin only)
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    if (user.role !== 'admin') {
      return apiError('Unauthorized', 403)
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return apiResponse({ coupons })
  } catch (error: any) {
    console.error('Error fetching coupons:', error)
    return apiError(error.message, 500)
  }
}

// POST /api/admin/coupons - Create new coupon (admin only)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    if (user.role !== 'admin') {
      return apiError('Unauthorized', 403)
    }

    const body = await request.json()
    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      usageLimit,
      validFrom,
      validTo,
      description,
      isActive
    } = body

    if (!code || !discountType || !discountValue || !validFrom || !validTo) {
      return apiError('Required fields are missing', 400)
    }

    if (!['percentage', 'fixed'].includes(discountType)) {
      return apiError('Invalid discount type', 400)
    }

    if (discountValue <= 0) {
      return apiError('Discount value must be positive', 400)
    }

    if (discountType === 'percentage' && discountValue > 100) {
      return apiError('Percentage discount cannot exceed 100%', 400)
    }

    // Check if code already exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (existingCoupon) {
      return apiError('Coupon code already exists', 400)
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue,
        minOrderValue: minOrderValue || null,
        maxDiscount: maxDiscount || null,
        usageLimit: usageLimit || null,
        validFrom: new Date(validFrom),
        validTo: new Date(validTo),
        description: description || null,
        isActive: isActive !== undefined ? isActive : true,
        usedCount: 0
      }
    })

    return apiResponse({ coupon }, 201)
  } catch (error: any) {
    console.error('Error creating coupon:', error)
    return apiError(error.message, 500)
  }
}
