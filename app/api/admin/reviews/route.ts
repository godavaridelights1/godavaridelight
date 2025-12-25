import { NextRequest } from 'next/server'
import { requireAdmin, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/admin/reviews - Get all product reviews
export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const adminCheck = await requireAdmin(request)
    if (adminCheck) return adminCheck

    const reviews = await prisma.productReview.findMany({
      include: {
        user: {
          select: {
            name: true
          }
        },
        product: {
          select: {
            name: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return apiResponse(reviews)
  } catch (error: any) {
    console.error('Error fetching reviews:', error)
    return apiError(error.message || 'Failed to fetch reviews', 500)
  }
}
