import { NextRequest, NextResponse } from "next/server"
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/chats - Get all chats (admin: all chats, user: own chats)
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    // Build query based on user role
    const chats = await prisma.chat.findMany({
      where: user.role === 'admin' ? {} : { userId: user.id },
      include: {
        order: {
          select: {
            orderNumber: true,
            total: true,
            status: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return apiResponse({ chats })
  } catch (error: any) {
    console.error("Error fetching chats:", error)
    return apiError(error.message || "Internal server error", 500)
  }
}

// POST /api/chats - Create a new chat
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    const body = await request.json()
    const { orderId, subject, message } = body

    // Validate input
    if (!subject || !message) {
      return apiError("Subject and message are required", 400)
    }

    // Create chat with initial message in transaction
    const chat = await prisma.$transaction(async (tx: any) => {
      const newChat = await tx.chat.create({
        data: {
          userId: user.id,
          orderId: orderId || null,
          subject,
          status: 'open'
        }
      })

      await tx.chatMessage.create({
        data: {
          chatId: newChat.id,
          userId: user.id,
          message,
          isAdmin: false
        }
      })

      return newChat
    })

    return apiResponse({
      message: "Chat created successfully",
      chat
    })
  } catch (error: any) {
    console.error("Error creating chat:", error)
    return apiError(error.message || "Internal server error", 500)
  }
}
