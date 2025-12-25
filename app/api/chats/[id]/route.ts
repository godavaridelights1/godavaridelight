import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// PATCH /api/chats/[id] - Update chat status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof Response) return authResult

    const body = await request.json()
    const { status } = body

    if (!status || !["open", "closed", "resolved"].includes(status)) {
      return apiError("Invalid status", 400)
    }

    // Update chat status
    const updatedChat = await prisma.chat.update({
      where: { id: params.id },
      data: { status }
    })

    return apiResponse({
      message: "Chat status updated successfully",
      chat: updatedChat
    })
  } catch (error: any) {
    console.error("Error updating chat:", error)
    return apiError(error.message || "Internal server error", 500)
  }
}
