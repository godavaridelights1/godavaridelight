import { NextRequest } from 'next/server'
import { apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// POST /api/auth/signin - Sign in user (deprecated - use NextAuth instead)
// This route is kept for backwards compatibility, but clients should use NextAuth's signIn
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return apiError('Email and password are required', 400)
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        phone: true,
        role: true
      }
    })

    if (!user || !user.password) {
      return apiError('Invalid email or password', 401)
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return apiError('Invalid email or password', 401)
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return apiResponse({
      user: userWithoutPassword,
      message: 'Please use NextAuth signIn method instead for proper session management'
    })
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
