import { prisma } from './prisma'
import { sendOTP, SMSConfig } from './sms-service'

const OTP_VALIDITY_MINUTES = 10
const OTP_LENGTH = 6

/**
 * Generate a random 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Send OTP to phone number
 */
export async function sendOTPToPhone(
  phone: string,
  smsConfig: SMSConfig
): Promise<{ success: boolean; message: string; requestId?: string }> {
  try {
    // Generate OTP
    const otp = generateOTP()

    // Set expiration time
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + OTP_VALIDITY_MINUTES)

    // Save OTP to database
    await prisma.oTP.upsert({
      where: { phone },
      update: {
        otp,
        attempts: 0,
        expiresAt,
        verified: false
      },
      create: {
        phone,
        otp,
        expiresAt,
        verified: false,
        attempts: 0
      }
    })

    // Send OTP via SMS
    const smsResult = await sendOTP(phone, otp, smsConfig)

    if (!smsResult.success) {
      return {
        success: false,
        message: smsResult.error || 'Failed to send OTP'
      }
    }

    return {
      success: true,
      message: 'OTP sent successfully',
      requestId: smsResult.requestId
    }
  } catch (error: any) {
    console.error('Error sending OTP to phone:', error)
    return {
      success: false,
      message: error.message || 'Failed to send OTP'
    }
  }
}

/**
 * Verify OTP
 */
export async function verifyOTP(
  phone: string,
  otp: string
): Promise<{ success: boolean; message: string }> {
  try {
    const otpRecord = await prisma.oTP.findUnique({
      where: { phone }
    })

    if (!otpRecord) {
      return {
        success: false,
        message: 'OTP not found. Please request a new OTP.'
      }
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      return {
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      }
    }

    // Check if max attempts exceeded
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      return {
        success: false,
        message: 'Maximum attempts exceeded. Please request a new OTP.'
      }
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      // Increment attempts
      await prisma.oTP.update({
        where: { phone },
        data: { attempts: otpRecord.attempts + 1 }
      })

      return {
        success: false,
        message: 'Invalid OTP. Please try again.'
      }
    }

    // Mark as verified
    await prisma.oTP.update({
      where: { phone },
      data: { verified: true }
    })

    return {
      success: true,
      message: 'OTP verified successfully'
    }
  } catch (error: any) {
    console.error('Error verifying OTP:', error)
    return {
      success: false,
      message: error.message || 'Failed to verify OTP'
    }
  }
}

/**
 * Check if OTP is verified
 */
export async function isOTPVerified(phone: string): Promise<boolean> {
  try {
    const otpRecord = await prisma.oTP.findUnique({
      where: { phone }
    })

    return otpRecord?.verified || false
  } catch (error) {
    console.error('Error checking OTP verification:', error)
    return false
  }
}

/**
 * Clear OTP record
 */
export async function clearOTP(phone: string): Promise<void> {
  try {
    await prisma.oTP.delete({
      where: { phone }
    })
  } catch (error) {
    console.error('Error clearing OTP:', error)
  }
}
