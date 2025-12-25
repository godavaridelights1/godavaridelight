import { NextRequest } from 'next/server'
import { requireAdmin, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/admin/support - Get all support tickets
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof Response) return authResult

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = {}
    if (status && ['open', 'closed', 'resolved'].includes(status)) {
      where.status = status
    }

    const tickets = await prisma.supportTicket.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        order: {
          select: {
            orderNumber: true,
            total: true,
            status: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        _count: {
          select: { messages: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return apiResponse({ tickets })
  } catch (error: any) {
    console.error('Error fetching support tickets:', error)
    return apiError(error.message, 500)
  }
}
