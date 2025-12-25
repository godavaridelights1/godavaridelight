import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'
import { getWalletBalance } from '@/lib/sms-service'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/sms-config/balance
 * Check wallet balance for Fast2SMS
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    if (user.role !== 'admin') {
      return apiError('Unauthorized', 403)
    }

    // Get the real API key from database instead of relying on frontend
    const config = await prisma.sMSConfig.findFirst()

    if (!config || !config.apiKey) {
      return apiError('SMS configuration not found. Please configure SMS settings first.', 400)
    }

    const balance = await getWalletBalance(config.apiKey)

    if (balance === null) {
      return apiError('Failed to fetch wallet balance. Please check your API key.', 500)
    }

    return apiResponse({
      balance
    })
  } catch (error: any) {
    console.error('Error fetching wallet balance:', error)
    return apiError(error.message || 'Failed to fetch wallet balance', 500)
  }
}
