import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/admin/coupons/[id] - Get single coupon (admin only)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    if (user.role !== 'admin') {
      return apiError('Unauthorized', 403)
    }

    const coupon = await prisma.coupon.findUnique({
      where: { id: params.id }
    })

    if (!coupon) {
      return apiError('Coupon not found', 404)
    }

    return apiResponse({ coupon })
  } catch (error: any) {
    console.error('Error fetching coupon:', error)
    return apiError(error.message, 500)
  }
}

// PUT /api/admin/coupons/[id] - Update coupon (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    const existingCoupon = await prisma.coupon.findUnique({
      where: { id: params.id }
    })

    if (!existingCoupon) {
      return apiError('Coupon not found', 404)
    }

    // Check if code is being changed and if new code already exists
    if (code && code !== existingCoupon.code) {
      const codeExists = await prisma.coupon.findUnique({
        where: { code: code.toUpperCase() }
      })

      if (codeExists) {
        return apiError('Coupon code already exists', 400)
      }
    }

    if (discountType && !['percentage', 'fixed'].includes(discountType)) {
      return apiError('Invalid discount type', 400)
    }

    if (discountValue && discountValue <= 0) {
      return apiError('Discount value must be positive', 400)
    }

    if (discountType === 'percentage' && discountValue && discountValue > 100) {
      return apiError('Percentage discount cannot exceed 100%', 400)
    }

    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data: {
        code: code ? code.toUpperCase() : undefined,
        discountType: discountType || undefined,
        discountValue: discountValue !== undefined ? discountValue : undefined,
        minOrderValue: minOrderValue !== undefined ? (minOrderValue || null) : undefined,
        maxDiscount: maxDiscount !== undefined ? (maxDiscount || null) : undefined,
        usageLimit: usageLimit !== undefined ? (usageLimit || null) : undefined,
        validFrom: validFrom ? new Date(validFrom) : undefined,
        validTo: validTo ? new Date(validTo) : undefined,
        description: description !== undefined ? (description || null) : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      }
    })

    return apiResponse({ coupon })
  } catch (error: any) {
    console.error('Error updating coupon:', error)
    return apiError(error.message, 500)
  }
}

// DELETE /api/admin/coupons/[id] - Delete coupon (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    if (user.role !== 'admin') {
      return apiError('Unauthorized', 403)
    }

    const coupon = await prisma.coupon.findUnique({
      where: { id: params.id }
    })

    if (!coupon) {
      return apiError('Coupon not found', 404)
    }

    await prisma.coupon.delete({
      where: { id: params.id }
    })

    return apiResponse({ 
      success: true,
      message: 'Coupon deleted successfully' 
    })
  } catch (error: any) {
    console.error('Error deleting coupon:', error)
    return apiError(error.message, 500)
  }
}
