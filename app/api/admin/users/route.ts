import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/admin/users - Get all users with order statistics (Admin only)
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof Response) return authResult

    const users = await prisma.user.findMany({
      where: {
        role: 'customer' // Only show customers, not admins
      },
      include: {
        orders: {
          select: {
            id: true,
            total: true,
            createdAt: true,
            status: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        addresses: {
          take: 1,
          orderBy: {
            isDefault: 'desc'
          },
          select: {
            city: true,
            state: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform data to include statistics
    const usersWithStats = users.map((user: any) => {
      const totalSpent = user.orders
        .filter((order: any) => order.status !== 'cancelled')
        .reduce((sum: number, order: any) => sum + order.total, 0)
      
      const lastOrder = user.orders.length > 0 ? user.orders[0].createdAt : null
      const location = user.addresses[0] 
        ? `${user.addresses[0].city || ''}, ${user.addresses[0].state || ''}`.trim()
        : 'N/A'

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        orders: user.orders.length,
        totalSpent,
        lastOrder,
        location,
        status: 'active', // You can add actual status logic here
        createdAt: user.createdAt
      }
    })

    return NextResponse.json({ data: usersWithStats, success: true })
  } catch (error: any) {
    console.error('API error:', error)
    return apiError(error.message, 500)
  }
}
