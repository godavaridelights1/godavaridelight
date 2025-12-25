import { NextRequest } from 'next/server'
import { requireAdmin, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/banners - Get all banners
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' }
    })

    return apiResponse(banners)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

// POST /api/banners - Create banner (Admin only)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof Response) return authResult

    const body = await request.json()
    const { title, description, image, link, buttonText, displayOrder, isActive } = body

    if (!title || !image) {
      return apiError('Title and image are required', 400)
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        description,
        image,
        link,
        buttonText,
        displayOrder: displayOrder || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return apiResponse(banner, 201)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
