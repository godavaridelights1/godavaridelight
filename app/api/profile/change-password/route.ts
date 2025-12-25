import { NextRequest, NextResponse } from "next/server"
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validate input
    if (!currentPassword || !newPassword) {
      return apiError("Current password and new password are required", 400)
    }

    if (newPassword.length < 6) {
      return apiError("New password must be at least 6 characters", 400)
    }

    // Get current user with password
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!currentUser || !currentUser.password) {
      return apiError("User not found", 404)
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, currentUser.password)
    if (!isValidPassword) {
      return apiError("Current password is incorrect", 400)
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    return apiResponse({
      message: "Password changed successfully"
    })
  } catch (error: any) {
    console.error("Error changing password:", error)
    return apiError(error.message || "Internal server error", 500)
  }
}
