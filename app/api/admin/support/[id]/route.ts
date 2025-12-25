import { NextRequest } from 'next/server'
import { requireAdmin, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/admin/support/[id] - Get ticket details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof Response) return authResult

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        order: {
          select: {
            orderNumber: true,
            total: true,
            status: true,
            paymentStatus: true,
            createdAt: true
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

// POST /api/admin/support/[id] - Reply to ticket (admin)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    const body = await request.json()
    const { message } = body

    if (!message) {
      return apiError('Message is required', 400)
    }

    // Add admin reply to ticket
    const newMessage = await prisma.supportMessage.create({
      data: {
        ticketId: params.id,
        userId: user.id,
        message,
        isAdminReply: true
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
    console.error('Error adding admin reply:', error)
    return apiError(error.message, 500)
  }
}

// PATCH /api/admin/support/[id] - Update ticket
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof Response) return authResult

    const body = await request.json()
    const { status, priority } = body

    const updateData: any = {}
    
    if (status && ['open', 'closed', 'resolved'].includes(status)) {
      updateData.status = status
    }
    
    if (priority && ['low', 'medium', 'high', 'urgent'].includes(priority)) {
      updateData.priority = priority
    }

    if (Object.keys(updateData).length === 0) {
      return apiError('No valid fields to update', 400)
    }

    const updatedTicket = await prisma.supportTicket.update({
      where: { id: params.id },
      data: updateData
    })

    return apiResponse({ ticket: updatedTicket })
  } catch (error: any) {
    console.error('Error updating ticket:', error)
    return apiError(error.message, 500)
  }
}
