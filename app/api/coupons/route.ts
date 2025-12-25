import { NextRequest } from 'next/server'
import { requireAdmin, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/coupons - Get all coupons (public for active, admin for all)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (code) {
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: code.toUpperCase(),
          isActive: true
        }
      })
      
      if (!coupon) {
        return apiError('Coupon not found', 404)
      }

      // Validate coupon
      const now = new Date()

      if (now < coupon.validFrom || now > coupon.validTo) {
        return apiError('Coupon has expired', 400)
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return apiError('Coupon usage limit reached', 400)
      }

      return apiResponse(coupon)
    } else {
      // Get all active coupons
      const coupons = await prisma.coupon.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      })

      return apiResponse(coupons)
    }
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

// POST /api/coupons - Create coupon (Admin only)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof Response) return authResult

    const body = await request.json()
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      usageLimit,
      validFrom,
      validTo,
      isActive
    } = body

    if (!code || !discountType || !discountValue) {
      return apiError('Code, discountType, and discountValue are required', 400)
    }

    if (!['percentage', 'fixed'].includes(discountType)) {
      return apiError('DiscountType must be percentage or fixed', 400)
    }

    try {
      const coupon = await prisma.coupon.create({
        data: {
          code: code.toUpperCase(),
          description,
          discountType,
          discountValue: parseFloat(discountValue),
          minOrderValue: minOrderValue ? parseFloat(minOrderValue) : undefined,
          maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
          usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
          validFrom: validFrom ? new Date(validFrom) : new Date(),
          validTo: new Date(validTo),
          isActive: isActive !== undefined ? isActive : true
        }
      })

      return apiResponse(coupon, 201)
    } catch (prismaError: any) {
      if (prismaError.code === 'P2002') {
        return apiError('Coupon code already exists', 400)
      }
      throw prismaError
    }
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
