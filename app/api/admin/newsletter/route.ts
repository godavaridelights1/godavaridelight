import { NextRequest } from 'next/server'
import { requireAdmin, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/admin/newsletter - Get all newsletter subscribers (Admin only)
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof Response) return authResult

    const subscribers = await prisma.newsletter.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return apiResponse(subscribers)
  } catch (error: any) {
    console.error('API error:', error)
    return apiError(error.message, 500)
  }
}
