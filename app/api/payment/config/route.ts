import { NextRequest } from 'next/server'
import { requireAdmin, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/payment/config - Get payment configuration
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof Response) return authResult

    let config = await prisma.paymentConfig.findFirst()

    console.log('📖 Loading payment config:', config ? {
      id: config.id,
      hasKeyId: !!config.razorpayKeyId,
      keyIdPrefix: config.razorpayKeyId?.substring(0, 12),
      hasSecret: !!config.razorpayKeySecret,
      secretLength: config.razorpayKeySecret?.length,
      isTestMode: config.isTestMode
    } : 'No config found')

    if (!config) {
      // Create default config if doesn't exist
      console.log('➕ Creating default config')
      config = await prisma.paymentConfig.create({
        data: {
          razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
          razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
          isTestMode: true
        }
      })
    }

    // Only mask secret if it exists and is not empty
    const maskedSecret = (config.razorpayKeySecret && config.razorpayKeySecret.length > 0) 
      ? '••••••••••••••••' 
      : ''

    return apiResponse({
      razorpayKeyId: config.razorpayKeyId || '',
      razorpayKeySecret: maskedSecret,
      isTestMode: config.isTestMode ?? true,
      hasKeys: !!(config.razorpayKeyId && config.razorpayKeySecret)
    })
  } catch (error: any) {
    console.error('❌ Error fetching payment config:', error)
    return apiError(error.message, 500)
  }
}

// PUT /api/payment/config - Update payment configuration
export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof Response) return authResult

    const body = await request.json()
    const { razorpayKeyId, razorpayKeySecret, isTestMode, keepExistingSecret } = body

    console.log('💾 Saving payment config:', {
      keyIdLength: razorpayKeyId?.length,
      keyIdPrefix: razorpayKeyId?.substring(0, 12),
      hasNewSecret: !!razorpayKeySecret,
      secretLength: razorpayKeySecret?.length,
      keepExistingSecret,
      isTestMode
    })

    if (!razorpayKeyId) {
      return apiError('Razorpay Key ID is required', 400)
    }

    // Validate key format
    if (isTestMode && !razorpayKeyId.startsWith('rzp_test_')) {
      return apiError('Test mode requires test keys (rzp_test_)', 400)
    }

    if (!isTestMode && !razorpayKeyId.startsWith('rzp_live_')) {
      return apiError('Live mode requires live keys (rzp_live_)', 400)
    }

    // Update or create config
    const existingConfig = await prisma.paymentConfig.findFirst()
    console.log('📋 Existing config found:', !!existingConfig)

    let config
    
    // Prepare update data
    const updateData: any = {
      razorpayKeyId,
      isTestMode: isTestMode ?? true
    }
    
    // Only update secret if a new one is provided
    if (razorpayKeySecret) {
      updateData.razorpayKeySecret = razorpayKeySecret
    } else if (!keepExistingSecret) {
      // If no secret provided and not keeping existing, this is an error
      return apiError('Razorpay Key Secret is required', 400)
    }
    // If keepExistingSecret is true, we don't include razorpayKeySecret in update
    
    if (existingConfig) {
      console.log('✏️ Updating existing config with ID:', existingConfig.id)
      
      // If keeping existing secret, don't include it in the update
      if (keepExistingSecret && !razorpayKeySecret) {
        config = await prisma.paymentConfig.update({
          where: { id: existingConfig.id },
          data: {
            razorpayKeyId: updateData.razorpayKeyId,
            isTestMode: updateData.isTestMode
            // razorpayKeySecret is intentionally omitted to keep existing value
          }
        })
      } else {
        config = await prisma.paymentConfig.update({
          where: { id: existingConfig.id },
          data: updateData
        })
      }
    } else {
      console.log('➕ Creating new config')
      // For new config, secret is required
      if (!razorpayKeySecret) {
        return apiError('Razorpay Key Secret is required for new configuration', 400)
      }
      config = await prisma.paymentConfig.create({
        data: updateData
      })
    }

    console.log('✅ Config saved successfully:', {
      id: config.id,
      keyIdPrefix: config.razorpayKeyId.substring(0, 12),
      hasSecret: !!config.razorpayKeySecret,
      isTestMode: config.isTestMode
    })

    return apiResponse({
      message: 'Payment configuration updated successfully',
      isTestMode: config.isTestMode,
      keyIdPrefix: config.razorpayKeyId.substring(0, 12),
      hasSecret: !!config.razorpayKeySecret
    })
  } catch (error: any) {
    console.error('❌ Error updating payment config:', error)
    return apiError(error.message, 500)
  }
}
