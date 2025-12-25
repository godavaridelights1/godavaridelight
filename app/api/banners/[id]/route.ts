import { NextRequest } from 'next/server'
import { requireAdmin, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// PUT /api/banners/[id] - Update banner (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof Response) return authResult

    const body = await request.json()

    const updateData: any = {}
    if (body.title) updateData.title = body.title
    if (body.subtitle !== undefined) updateData.subtitle = body.subtitle
    if (body.image) updateData.image = body.image
    if (body.link !== undefined) updateData.link = body.link
    if (body.buttonText !== undefined) updateData.buttonText = body.buttonText
    if (body.displayOrder !== undefined) updateData.displayOrder = body.displayOrder
    if (body.isActive !== undefined) updateData.isActive = body.isActive

    const banner = await prisma.banner.update({
      where: { id: params.id },
      data: updateData
    })

    return apiResponse(banner)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

// DELETE /api/banners/[id] - Delete banner (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof Response) return authResult

    await prisma.banner.delete({
      where: { id: params.id }
    })

    return apiResponse({ message: 'Banner deleted successfully' })
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
