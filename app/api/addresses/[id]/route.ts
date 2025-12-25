import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// PUT /api/addresses/[id] - Update address
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    const body = await request.json()
    const { name, phone, street, city, state, pincode, isDefault } = body

    // Validate required fields
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

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!address) {
      return apiError('Address not found', 404)
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: user.id,
          id: { not: params.id }
        },
        data: { isDefault: false }
      })
    }

    const updatedAddress = await prisma.address.update({
      where: { id: params.id },
      data: {
        name,
        phone,
        street,
        city,
        state,
        pincode,
        isDefault: isDefault !== undefined ? isDefault : address.isDefault
      }
    })

    return apiResponse(updatedAddress)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

// DELETE /api/addresses/[id] - Delete address
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!address) {
      return apiError('Address not found', 404)
    }

    await prisma.address.delete({
      where: { id: params.id }
    })

    return apiResponse({ message: 'Address deleted successfully' })
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
