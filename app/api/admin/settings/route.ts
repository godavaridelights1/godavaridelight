import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/admin/settings - Get all site settings
export async function GET(request: NextRequest) {
  try {
    let settings = await prisma.siteSettings.findFirst()
    
    // If no settings exist, create default ones
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          headerLogoUrl: '/placeholder-logo.svg',
          heroSectionImageUrl: '/traditional-indian-sweet-putharekulu.jpg',
          whyGodavariImageUrl: '/homepage-about-section.jpg',
        }
      })
    }

    return apiResponse({ settings })
  } catch (error: any) {
    console.error('Error fetching settings:', error)
    return apiError(error.message, 500)
  }
}

// PUT /api/admin/settings - Update site settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    if (user.role !== 'admin') {
      return apiError('Unauthorized', 403)
    }

    const body = await request.json()
    const { headerLogoUrl, heroSectionImageUrl, whyGodavariImageUrl } = body

    // Get existing settings or create new
    let settings = await prisma.siteSettings.findFirst()

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          headerLogoUrl: headerLogoUrl || '/placeholder-logo.svg',
          heroSectionImageUrl: heroSectionImageUrl || '/traditional-indian-sweet-putharekulu.jpg',
          whyGodavariImageUrl: whyGodavariImageUrl || '/homepage-about-section.jpg',
        }
      })
    } else {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          ...(headerLogoUrl && { headerLogoUrl }),
          ...(heroSectionImageUrl && { heroSectionImageUrl }),
          ...(whyGodavariImageUrl && { whyGodavariImageUrl }),
        }
      })
    }

    return apiResponse({ settings })
  } catch (error: any) {
    console.error('Error updating settings:', error)
    return apiError(error.message, 500)
  }
}
