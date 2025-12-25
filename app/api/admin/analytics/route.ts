import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/admin/analytics - Get analytics data (admin only)
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    if (user.role !== 'admin') {
      return apiError('Unauthorized', 403)
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7d'

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (range) {
      case '24h':
        startDate.setHours(now.getHours() - 24)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // Get previous period for comparison
    const periodLength = now.getTime() - startDate.getTime()
    const previousStartDate = new Date(startDate.getTime() - periodLength)

    // Get total revenue for current period
    const currentOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: now,
        },
        status: { not: 'cancelled' }
      },
      select: {
        total: true,
        status: true,
      },
    })

    const currentRevenue = currentOrders.reduce((sum, order) => sum + order.total, 0)

    // Get previous period revenue for comparison
    const previousOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: previousStartDate,
          lt: startDate,
        },
        status: { not: 'cancelled' }
      },
      select: {
        total: true,
      },
    })

    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0)
    const revenueChange = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0

    // Get total orders
    const totalOrders = currentOrders.length
    const previousTotalOrders = previousOrders.length
    const ordersChange = previousTotalOrders > 0
      ? ((totalOrders - previousTotalOrders) / previousTotalOrders) * 100
      : 0

    // Get customers
    const currentCustomers = await prisma.user.count({
      where: {
        role: { in: ['customer', 'user'] },
        createdAt: {
          gte: startDate,
          lte: now,
        },
      },
    })

    const previousCustomers = await prisma.user.count({
      where: {
        role: { in: ['customer', 'user'] },
        createdAt: {
          gte: previousStartDate,
          lt: startDate,
        },
      },
    })

    const customersChange = previousCustomers > 0
      ? ((currentCustomers - previousCustomers) / previousCustomers) * 100
      : 0

    // Get total customers count (all time)
    const totalCustomers = await prisma.user.count({
      where: {
        role: { in: ['customer', 'user'] },
      },
    })

    // Get products count
    const totalProducts = await prisma.product.count()

    // Get order status breakdown
    const recentOrders = await prisma.order.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: startDate,
          lte: now,
        },
      },
      _count: true,
    })

    const ordersByStatus = {
      pending: 0,
      confirmed: 0,
      preparing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    }

    recentOrders.forEach((group) => {
      const status = group.status as keyof typeof ordersByStatus
      if (status in ordersByStatus) {
        ordersByStatus[status] = group._count
      }
    })

    // Get top products
    const orderItems = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          createdAt: {
            gte: startDate,
            lte: now,
          },
          status: { not: 'cancelled' }
        },
      },
      _count: true,
      _sum: {
        quantity: true,
        price: true,
      },
      orderBy: {
        _sum: {
          price: 'desc',
        },
      },
      take: 5,
    })

    const topProducts = await Promise.all(
      orderItems.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true },
        })
        return {
          id: item.productId,
          name: product?.name || 'Unknown Product',
          sales: item._sum.quantity || 0,
          revenue: item._sum.price || 0,
        }
      })
    )

    // Get sales by day
    const salesByDay = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: now,
        },
        status: { not: 'cancelled' }
      },
      select: {
        createdAt: true,
        total: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Group by day
    const salesMap = new Map<string, { sales: number; revenue: number }>()
    
    salesByDay.forEach((order) => {
      const dateKey = order.createdAt.toISOString().split('T')[0]
      const existing = salesMap.get(dateKey) || { sales: 0, revenue: 0 }
      salesMap.set(dateKey, {
        sales: existing.sales + 1,
        revenue: existing.revenue + order.total,
      })
    })

    const salesByDayArray = Array.from(salesMap.entries())
      .map(([date, data]) => ({
        date,
        sales: data.sales,
        revenue: data.revenue,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7)
      .reverse()

    const analytics = {
      revenue: {
        total: currentRevenue,
        change: Math.round(revenueChange),
        trend: revenueChange >= 0 ? 'up' : 'down',
      },
      orders: {
        total: totalOrders,
        change: Math.round(ordersChange),
        trend: ordersChange >= 0 ? 'up' : 'down',
      },
      customers: {
        total: totalCustomers,
        change: Math.round(customersChange),
        trend: customersChange >= 0 ? 'up' : 'down',
      },
      products: {
        total: totalProducts,
        change: 0, // Products don't typically change dramatically
        trend: 'up',
      },
      recentOrders: ordersByStatus,
      topProducts,
      salesByDay: salesByDayArray,
    }

    return apiResponse({ analytics })
  } catch (error: any) {
    console.error('Error fetching analytics:', error)
    return apiError(error.message, 500)
  }
}
