import { NextRequest } from 'next/server'
import { apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'
import { verifyOTP, clearOTP } from '@/lib/otp-service'
import { hash } from 'bcryptjs'

export const dynamic = 'force-dynamic'

/**
 * POST /api/auth/verify-otp
 * Verify OTP and login or create account
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, otp, name, email } = body

    if (!phone || !otp) {
      return apiError('Phone number and OTP are required', 400)
    }

    // Verify OTP
    const verifyResult = await verifyOTP(phone, otp)

    if (!verifyResult.success) {
      return apiError(verifyResult.message, 400)
    }

    // Check if user exists with this phone
    let user = await prisma.user.findFirst({
      where: { phone }
    })

    if (user) {
      // Update phone verification status
      await prisma.user.update({
        where: { id: user.id },
        data: { phoneVerified: new Date() }
      })

      // Clear OTP
      await clearOTP(phone)

      return apiResponse({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          phoneVerified: user.phoneVerified,
          role: user.role
        },
        message: 'Phone verified successfully'
      })
    }

    // Create new user with phone
    if (!email) {
      return apiError('Email is required for new registration', 400)
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return apiError('Email already registered. Please login with email instead.', 400)
    }

    user = await prisma.user.create({
      data: {
        name: name || email.split('@')[0],
        email,
        phone,
        phoneVerified: new Date(),
        role: 'customer'
      }
    })

    // Clear OTP
    await clearOTP(phone)

    return apiResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          phoneVerified: user.phoneVerified,
          role: user.role
        },
        message: 'Account created and phone verified successfully'
      },
      201
    )
  } catch (error: any) {
    console.error('Error verifying OTP:', error)
    return apiError(error.message || 'Failed to verify OTP', 500)
  }
}
