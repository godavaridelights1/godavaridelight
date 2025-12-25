import { NextRequest } from 'next/server'
import { apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email-service'

// POST /api/auth/reset-password - Send password reset email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return apiError('Email is required', 400)
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return apiResponse({
        message: 'If an account with that email exists, a password reset link has been sent'
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    // TODO: Save reset token in a separate table or implement proper token storage
    // For now, we'll just send the email
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: {
    //     resetToken,
    //     resetTokenExpiry
    //   }
    // })

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${resetToken}`
    await sendPasswordResetEmail(email, resetUrl, user.name || undefined)

    return apiResponse({
      message: 'If an account with that email exists, a password reset link has been sent'
    })
  } catch (error: any) {
    console.error('Password reset error:', error)
    return apiError('Failed to process password reset', 500)
  }
}
