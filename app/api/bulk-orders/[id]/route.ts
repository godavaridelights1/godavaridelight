import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// PUT /api/bulk-orders/[id] - Update bulk order status (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    if (user.role !== 'admin') {
      return apiError('Unauthorized', 403)
    }

    const body = await request.json()
    const { status, adminNotes } = body

    const validStatuses = ['pending', 'approved', 'rejected', 'completed']
    if (status && !validStatuses.includes(status)) {
      return apiError('Invalid status', 400)
    }

    const bulkOrder = await prisma.bulkOrder.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes: adminNotes || null }),
      }
    })

    return apiResponse({ bulkOrder })
  } catch (error: any) {
    console.error('Error updating bulk order:', error)
    return apiError(error.message, 500)
  }
}

// DELETE /api/bulk-orders/[id] - Delete bulk order (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    if (user.role !== 'admin') {
      return apiError('Unauthorized', 403)
    }

    await prisma.bulkOrder.delete({
      where: { id: params.id }
    })

    return apiResponse({ success: true })
  } catch (error: any) {
    console.error('Error deleting bulk order:', error)
    return apiError(error.message, 500)
  }
}
