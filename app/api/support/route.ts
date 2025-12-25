import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/support - Get user's support tickets
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    const tickets = await prisma.supportTicket.findMany({
      where: { userId: user.id },
      include: {
        order: {
          select: {
            orderNumber: true,
            total: true,
            status: true
          }
        },
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return apiResponse({ tickets })
  } catch (error: any) {
    console.error('Error fetching support tickets:', error)
    return apiError(error.message, 500)
  }
}

// POST /api/support - Create new support ticket
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    const body = await request.json()
    const { orderId, subject, message, priority = 'medium' } = body

    if (!orderId || !subject || !message) {
      return apiError('Order ID, subject, and message are required', 400)
    }

    // Verify order belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id
      }
    })

    if (!order) {
      return apiError('Order not found', 404)
    }

    // Create ticket with first message
    const ticket = await prisma.supportTicket.create({
      data: {
        userId: user.id,
        orderId,
        subject,
        priority,
        status: 'open',
        messages: {
          create: {
            userId: user.id,
            message,
            isAdminReply: false
          }
        }
      },
      include: {
        order: {
          select: {
            orderNumber: true,
            total: true,
            status: true
          }
        },
        messages: true
      }
    })

    return apiResponse({ ticket }, 201)
  } catch (error: any) {
    console.error('Error creating support ticket:', error)
    return apiError(error.message, 500)
  }
}
