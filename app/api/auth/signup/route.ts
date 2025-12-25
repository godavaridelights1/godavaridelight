import { NextRequest } from 'next/server'
import { apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// POST /api/auth/signup - Register new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, phone } = body

    if (!email || !password || !name) {
      return apiError('Email, password, and name are required', 400)
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return apiError('User with this email already exists', 400)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: 'customer'
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true
      }
    })

    return apiResponse({
      user,
      message: 'User registered successfully'
    }, 201)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
