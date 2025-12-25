import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'
import { hash, compare } from 'bcryptjs'

export const dynamic = 'force-dynamic'

/**
 * POST /api/auth/change-password
 * Change user password
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return apiError('Current password and new password are required', 400)
    }

    if (newPassword.length < 6) {
      return apiError('New password must be at least 6 characters', 400)
    }

    // Get user with password hash
    const userRecord = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        password: true
      }
    })

    if (!userRecord || !userRecord.password) {
      return apiError('User not found or password not set', 400)
    }

    // Verify current password
    const isPasswordValid = await compare(currentPassword, userRecord.password)
    if (!isPasswordValid) {
      return apiError('Current password is incorrect', 401)
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 10)

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword
      }
    })

    return apiResponse({
      message: 'Password changed successfully'
    })
  } catch (error: any) {
    console.error('Error changing password:', error)
    return apiError(error.message || 'Failed to change password', 500)
  }
}
