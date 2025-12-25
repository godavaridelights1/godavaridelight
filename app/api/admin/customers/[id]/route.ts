import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// Disable caching for this API route
export const dynamic = 'force-dynamic'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/admin/customers/[id] - Get single customer with details (admin only)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    if (user.role !== 'admin') {
      return apiError('Unauthorized', 403)
    }

    const customer = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            paymentStatus: true,
            createdAt: true
          }
        },
        addresses: {
          orderBy: { isDefault: 'desc' }
        },
        _count: {
          select: {
            orders: true
          }
        }
      }
    })

    if (!customer) {
      return apiError('Customer not found', 404)
    }

    return apiResponse({ customer })
  } catch (error: any) {
    console.error('Error fetching customer:', error)
    return apiError(error.message, 500)
  }
}

// PUT /api/admin/customers/[id] - Update customer (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    if (user.role !== 'admin') {
      return apiError('Unauthorized', 403)
    }

    const body = await request.json()
    const { name, email, phone, status } = body

    const existingCustomer = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!existingCustomer) {
      return apiError('Customer not found', 404)
    }

    // Check if email is being changed and if new email already exists
    if (email && email !== existingCustomer.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      })

      if (emailExists) {
        return apiError('Email already in use', 400)
      }
    }

    // Validate status
    if (status && !['active', 'banned'].includes(status)) {
      return apiError('Invalid status value', 400)
    }

    const customer = await prisma.user.update({
      where: { id: params.id },
      data: {
        name: name || undefined,
        email: email || undefined,
        phone: phone !== undefined ? phone : undefined,
        status: status || undefined,
        updatedAt: new Date()
      },
      include: {
        _count: {
          select: {
            orders: true
          }
        }
      }
    })

    return apiResponse({ customer })
  } catch (error: any) {
    console.error('Error updating customer:', error)
    return apiError(error.message, 500)
  }
}

// DELETE /api/admin/customers/[id] - Delete customer (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    if (user.role !== 'admin') {
      return apiError('Unauthorized', 403)
    }

    const customer = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            orders: true
          }
        }
      }
    })

    if (!customer) {
      return apiError('Customer not found', 404)
    }

    // Check if customer has orders
    if (customer._count.orders > 0) {
      return apiError('Cannot delete customer with existing orders. Please ban the customer instead.', 400)
    }

    await prisma.user.delete({
      where: { id: params.id }
    })

    return apiResponse({ 
      success: true,
      message: 'Customer deleted successfully' 
    })
  } catch (error: any) {
    console.error('Error deleting customer:', error)
    return apiError(error.message, 500)
  }
}
