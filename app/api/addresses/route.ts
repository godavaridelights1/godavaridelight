import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/addresses - Get user's addresses
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return apiResponse(addresses)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

// POST /api/addresses - Create new address
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    const body = await request.json()
    const { name, phone, street, city, state, pincode, isDefault } = body

    // Validate all required fields
    if (!name || !phone || !street || !city || !state || !pincode) {
      return apiError('All fields are required', 400)
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      return apiError('Invalid phone number. Please enter 10 digits', 400)
    }

    // Validate pincode (6 digits)
    if (!/^\d{6}$/.test(pincode)) {
      return apiError('Invalid pincode. Please enter 6 digits', 400)
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false }
      })
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        name,
        phone,
        street,
        city,
        state,
        pincode,
        isDefault: isDefault || false
      }
    })

    return apiResponse(address, 201)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
