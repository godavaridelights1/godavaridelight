import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'
import { getWalletBalance } from '@/lib/sms-service'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/sms-config
 * Get current SMS configuration
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    if (user.role !== 'admin') {
      return apiError('Unauthorized', 403)
    }

    const config = await prisma.sMSConfig.findFirst()

    return apiResponse({
      config: config ? {
        id: config.id,
        provider: config.provider,
        apiKey: config.apiKey.slice(-4).padStart(config.apiKey.length, '*'),
        smsType: config.smsType,
        dlcSenderId: config.dlcSenderId,
        dlcMessageId: config.dlcMessageId,
        isActive: config.isActive
      } : null
    })
  } catch (error: any) {
    console.error('Error fetching SMS config:', error)
    return apiError(error.message, 500)
  }
}

/**
 * POST /api/admin/sms-config
 * Save or update SMS configuration
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { user } = authResult

    if (user.role !== 'admin') {
      return apiError('Unauthorized', 403)
    }

    const body = await request.json()
    const { apiKey, smsType, dlcSenderId, dlcTemplateId, dlcEntityId, dlcMessageId, isActive } = body

    if (!apiKey) {
      return apiError('API Key is required', 400)
    }

    // For DLT, require at least Sender ID and either (Template ID + Entity ID) or Message ID
    if (smsType === 'dlt' && !dlcSenderId) {
      return apiError('DLT Sender ID is required for DLT SMS', 400)
    }

    // Find existing config
    const existingConfig = await prisma.sMSConfig.findFirst()

    let config
    if (existingConfig) {
      config = await prisma.sMSConfig.update({
        where: { id: existingConfig.id },
        data: {
          apiKey,
          smsType,
          dlcSenderId: dlcSenderId || null,
          dlcTemplateId: dlcTemplateId || null,
          dlcEntityId: dlcEntityId || null,
          dlcMessageId: dlcMessageId || null,
          isActive
        }
      })
    } else {
      config = await prisma.sMSConfig.create({
        data: {
          apiKey,
          smsType,
          dlcSenderId: dlcSenderId || null,
          dlcTemplateId: dlcTemplateId || null,
          dlcEntityId: dlcEntityId || null,
          dlcMessageId: dlcMessageId || null,
          isActive,
          provider: 'fast2sms'
        }
      })
    }

    return apiResponse({
      config: {
        id: config.id,
        provider: config.provider,
        apiKey: config.apiKey.slice(-4).padStart(config.apiKey.length, '*'),
        smsType: config.smsType,
        dlcSenderId: config.dlcSenderId,
        dlcTemplateId: config.dlcTemplateId,
        dlcEntityId: config.dlcEntityId,
        dlcMessageId: config.dlcMessageId,
        isActive: config.isActive
      },
      message: 'SMS configuration saved successfully'
    })
  } catch (error: any) {
    console.error('Error saving SMS config:', error)
    return apiError(error.message, 500)
  }
}
