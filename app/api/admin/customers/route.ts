import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// Disable caching for this API route
export const dynamic = 'force-dynamic'

// GET /api/admin/customers - Get all customers (admin only)
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    if (user.role !== 'admin') {
      return apiError('Unauthorized', 403)
    }

    const customers = await prisma.user.findMany({
      where: {
        role: { in: ['customer', 'user'] } // Get both 'customer' and 'user' roles (not admins)
      },
      include: {
        _count: {
          select: {
            orders: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Ensure status field is present and properly serialized
    const serializedCustomers = customers.map(customer => ({
      id: customer.id,
      name: customer.name || '',
      email: customer.email,
      phone: customer.phone || null,
      role: customer.role,
      status: customer.status || 'active', // Ensure status is always present
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
      _count: customer._count
    }))

    return apiResponse({ customers: serializedCustomers })
  } catch (error: any) {
    console.error('Error fetching customers:', error)
    return apiError(error.message, 500)
  }
}
