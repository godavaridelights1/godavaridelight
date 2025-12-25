import { NextRequest } from 'next/server'
import { requireAdmin, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// PUT /api/coupons/[id] - Update coupon (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof Response) return authResult

    const body = await request.json()

    const updateData: any = {}
    if (body.code) updateData.code = body.code.toUpperCase()
    if (body.description !== undefined) updateData.description = body.description
    if (body.type) updateData.type = body.type
    if (body.value !== undefined) updateData.value = parseFloat(body.value)
    if (body.minOrderAmount !== undefined) updateData.minOrderAmount = parseFloat(body.minOrderAmount)
    if (body.maxDiscount !== undefined) updateData.maxDiscount = body.maxDiscount ? parseFloat(body.maxDiscount) : null
    if (body.usageLimit !== undefined) updateData.usageLimit = body.usageLimit ? parseInt(body.usageLimit) : null
    if (body.validFrom) updateData.validFrom = new Date(body.validFrom)
    if (body.validUntil) updateData.validUntil = new Date(body.validUntil)
    if (body.isActive !== undefined) updateData.isActive = body.isActive

    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data: updateData
    })

    return apiResponse(coupon)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

// DELETE /api/coupons/[id] - Delete coupon (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof Response) return authResult

    await prisma.coupon.delete({
      where: { id: params.id }
    })

    return apiResponse({ message: 'Coupon deleted successfully' })
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
