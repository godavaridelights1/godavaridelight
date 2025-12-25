import { NextRequest, NextResponse } from "next/server"
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    // Get profile data
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!profile) {
      return apiError('Profile not found', 404)
    }

    return apiResponse(profile)
  } catch (error: any) {
    console.error("Error fetching profile:", error)
    return apiError(error.message || "Internal server error", 500)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    const body = await request.json()
    const { name, email, phone } = body

    // Validate input
    if (!name || name.trim().length < 2) {
      return apiError("Name must be at least 2 characters", 400)
    }

    if (!email || !email.trim()) {
      return apiError("Email is required", 400)
    }

    // If email is being changed, check if it's already in use
    if (email.trim() !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: email.trim() }
      })
      if (existingUser) {
        return apiError("Email already in use", 400)
      }
    }

    // Update profile
    const profile = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null
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
      message: "Profile updated successfully",
      profile
    })
  } catch (error: any) {
    console.error("Error updating profile:", error)
    return apiError(error.message || "Internal server error", 500)
  }
}

export async function PATCH(request: NextRequest) {
  // PATCH is an alias for PUT
  return PUT(request)
}
