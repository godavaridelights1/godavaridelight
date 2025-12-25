import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/bulk-orders - Get all bulk orders (admin only)
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    if (user.role !== 'admin') {
      return apiError('Unauthorized', 403)
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'

    const where = status === 'all' ? {} : { status }

    const bulkOrders = await prisma.bulkOrder.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return apiResponse({ bulkOrders })
  } catch (error: any) {
    console.error('Error fetching bulk orders:', error)
    return apiError(error.message, 500)
  }
}

// POST /api/bulk-orders - Create a new bulk order request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, productName, quantity, message } = body

    // Validation
    if (!name || !email || !phone || !productName || !quantity || !message) {
      return apiError('Missing required fields', 400)
    }

    if (quantity < 10) {
      return apiError('Minimum quantity is 10 boxes', 400)
    }

    const bulkOrder = await prisma.bulkOrder.create({
      data: {
        name,
        email,
        phone,
        company: company || null,
        productName,
        quantity: parseInt(quantity),
        message,
        status: 'pending'
      }
    })

    return apiResponse({ bulkOrder }, 201)
  } catch (error: any) {
    console.error('Error creating bulk order:', error)
    return apiError(error.message, 500)
  }
}
