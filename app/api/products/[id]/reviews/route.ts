import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/products/[id]/reviews - Get reviews for a product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviews = await prisma.productReview.findMany({
      where: { productId: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const transformedReviews = reviews.map((review: any) => ({
      ...review,
      userName: review.user?.name,
      userEmail: review.user?.email
    }))

    return apiResponse(transformedReviews)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

// POST /api/products/[id]/reviews - Create a review
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    const body = await request.json()
    const { rating, comment } = body

    if (!rating || rating < 1 || rating > 5) {
      return apiError('Rating must be between 1 and 5', 400)
    }

    // Check if user has already reviewed this product
    const existing = await prisma.productReview.findFirst({
      where: {
        productId: params.id,
        userId: user.id
      }
    })

    if (existing) {
      return apiError('You have already reviewed this product', 400)
    }

    // Check if user has purchased this product
    const purchase = await prisma.orderItem.findFirst({
      where: {
        productId: params.id,
        order: {
          userId: user.id,
          status: 'delivered'
        }
      }
    })

    const isVerifiedPurchase = !!purchase

    const review = await prisma.productReview.create({
      data: {
        productId: params.id,
        userId: user.id,
        rating,
        comment
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    const transformedReview = {
      ...review,
      userName: review.user?.name,
      userEmail: review.user?.email
    }

    return apiResponse(transformedReview, 201)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
