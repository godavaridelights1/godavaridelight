import { NextRequest } from 'next/server'
import { apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'
import { sendOTPToPhone } from '@/lib/otp-service'

export const dynamic = 'force-dynamic'

/**
 * POST /api/auth/send-otp
 * Send OTP to phone number
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone } = body

    if (!phone) {
      return apiError('Phone number is required', 400)
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(phone)) {
      return apiError('Invalid phone number format. Please enter a valid Indian mobile number.', 400)
    }

    // Get SMS configuration
    const smsConfig = await prisma.sMSConfig.findFirst({
      where: { isActive: true }
    })

    if (!smsConfig) {
      return apiError('SMS service is not configured. Please contact administrator.', 503)
    }

    // Send OTP
    const result = await sendOTPToPhone(phone, {
      provider: 'fast2sms',
      apiKey: smsConfig.apiKey,
      smsType: smsConfig.smsType as 'quick' | 'dlt',
      dlcSenderId: smsConfig.dlcSenderId || undefined,
      dlcMessageId: smsConfig.dlcMessageId || undefined,
      isActive: smsConfig.isActive
    })

    if (!result.success) {
      return apiError(result.message, 500)
    }

    return apiResponse({
      message: 'OTP sent successfully',
      phone: phone.slice(-4).padStart(10, '*')
    })
  } catch (error: any) {
    console.error('Error sending OTP:', error)
    return apiError(error.message || 'Failed to send OTP', 500)
  }
}
