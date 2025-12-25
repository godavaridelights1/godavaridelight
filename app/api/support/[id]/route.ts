import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/support/[id] - Get single ticket with messages
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id: params.id,
        userId: user.id
      },
      include: {
        order: {
          select: {
            orderNumber: true,
            total: true,
            status: true
          }
        },
        messages: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                role: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!ticket) {
      return apiError('Support ticket not found', 404)
    }

    return apiResponse({ ticket })
  } catch (error: any) {
    console.error('Error fetching support ticket:', error)
    return apiError(error.message, 500)
  }
}

// POST /api/support/[id] - Add message to ticket
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    const body = await request.json()
    const { message } = body

    if (!message) {
      return apiError('Message is required', 400)
    }

    // Verify ticket belongs to user
    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!ticket) {
      return apiError('Support ticket not found', 404)
    }

    // Add message to ticket
    const newMessage = await prisma.supportMessage.create({
      data: {
        ticketId: params.id,
        userId: user.id,
        message,
        isAdminReply: false
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    // Update ticket's updatedAt
    await prisma.supportTicket.update({
      where: { id: params.id },
      data: { updatedAt: new Date() }
    })

    return apiResponse({ message: newMessage })
  } catch (error: any) {
    console.error('Error adding message to ticket:', error)
    return apiError(error.message, 500)
  }
}

// PATCH /api/support/[id] - Update ticket status (close ticket)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    const body = await request.json()
    const { status } = body

    if (!status || !['open', 'closed', 'resolved'].includes(status)) {
      return apiError('Invalid status', 400)
    }

    // Verify ticket belongs to user
    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!ticket) {
      return apiError('Support ticket not found', 404)
    }

    // Update ticket status
    const updatedTicket = await prisma.supportTicket.update({
      where: { id: params.id },
      data: { status }
    })

    return apiResponse({ ticket: updatedTicket })
  } catch (error: any) {
    console.error('Error updating ticket status:', error)
    return apiError(error.message, 500)
  }
}
