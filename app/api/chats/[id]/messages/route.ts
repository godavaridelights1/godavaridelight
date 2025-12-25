import { NextRequest, NextResponse } from "next/server"
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/chats/[id]/messages - Get all messages for a chat
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    // Check if user has access to this chat
    const chat = await prisma.chat.findUnique({
      where: { id: params.id }
    })

    if (!chat) {
      return apiError("Chat not found", 404)
    }

    // Check access: must be chat owner or admin
    if (chat.userId !== user.id && user.role !== 'admin') {
      return apiError("Forbidden", 403)
    }

    // Get messages
    const messages = await prisma.message.findMany({
      where: { chatId: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    return apiResponse({ messages })
  } catch (error: any) {
    console.error("Error fetching messages:", error)
    return apiError(error.message || "Internal server error", 500)
  }
}

// POST /api/chats/[id]/messages - Send a message in a chat
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

    if (!message || !message.trim()) {
      return apiError("Message is required", 400)
    }

    // Check if user has access to this chat
    const chat = await prisma.chat.findUnique({
      where: { id: params.id }
    })

    if (!chat) {
      return apiError("Chat not found", 404)
    }

    // Check access: must be chat owner or admin
    if (chat.userId !== user.id && user.role !== 'admin') {
      return apiError("Forbidden", 403)
    }

    const isAdmin = user.role === 'admin'

    // Create message and update chat in transaction
    const newMessage = await prisma.$transaction(async (tx: any) => {
      const msg = await tx.chatMessage.create({
        data: {
          chatId: params.id,
          userId: user.id,
          message: message.trim(),
          isAdmin
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })

      // Update chat's updatedAt timestamp
      await tx.chat.update({
        where: { id: params.id },
        data: { updatedAt: new Date() }
      })

      return msg
    })

    return apiResponse({
      message: "Message sent successfully",
      data: newMessage
    })
  } catch (error: any) {
    console.error("Error sending message:", error)
    return apiError(error.message || "Internal server error", 500)
  }
}
