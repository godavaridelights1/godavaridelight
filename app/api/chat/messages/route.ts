import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/chat/messages?orderId=xxx - Get chat messages for an order
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return apiError('Order ID is required', 400)
    }

    // Verify order belongs to user (unless admin)
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        ...(user.role !== 'admin' ? { userId: user.id } : {})
      }
    })

    if (!order) {
      return apiError('Order not found', 404)
    }

    // Find or get the support ticket for this order
    let ticket = await prisma.supportTicket.findFirst({
      where: {
        orderId,
        userId: user.id
      },
      include: {
        messages: {
          include: {
            user: {
              select: {
                id: true,
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

    // If no ticket exists, return empty messages
    const messages = ticket ? ticket.messages.map(msg => ({
      id: msg.id,
      orderId: ticket.orderId,
      message: msg.message,
      senderRole: msg.isAdminReply ? 'admin' : 'customer',
      senderName: msg.user.name || msg.user.email,
      createdAt: msg.createdAt.toISOString()
    })) : []

    return apiResponse({ messages })
  } catch (error: any) {
    console.error('Error fetching chat messages:', error)
    return apiError(error.message, 500)
  }
}

// POST /api/chat/messages - Send a chat message (create or add to support ticket)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    const body = await request.json()
    const { orderId, message } = body

    if (!orderId || !message) {
      return apiError('Order ID and message are required', 400)
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

    // Find existing ticket or create new one
    let ticket = await prisma.supportTicket.findFirst({
      where: {
        orderId,
        userId: user.id
      }
    })

    if (!ticket) {
      // Create new ticket with first message
      ticket = await prisma.supportTicket.create({
        data: {
          userId: user.id,
          orderId,
          subject: `Order Support - ${order.orderNumber}`,
          priority: 'medium',
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
          messages: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true
                }
              }
            }
          }
        }
      })
    } else {
      // Add message to existing ticket
      await prisma.supportMessage.create({
        data: {
          ticketId: ticket.id,
          userId: user.id,
          message,
          isAdminReply: false
        }
      })

      // Reopen ticket if it was closed
      if (ticket.status === 'closed') {
        await prisma.supportTicket.update({
          where: { id: ticket.id },
          data: { status: 'open' }
        })
      }
    }

    return apiResponse({ 
      success: true,
      message: 'Message sent successfully' 
    }, 201)
  } catch (error: any) {
    console.error('Error sending chat message:', error)
    return apiError(error.message, 500)
  }
}
