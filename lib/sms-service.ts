import axios from 'axios'

export interface SMSConfig {
  provider: 'fast2sms'
  apiKey: string
  smsType: 'quick' | 'dlt'
  // DLT fields
  dlcSenderId?: string      // DLT-approved 3-6 letter Sender ID
  dlcTemplateId?: string    // DLT Content Template ID
  dlcEntityId?: string      // DLT Principal Entity ID
  dlcMessageId?: string     // Message_ID for DLT SMS (used in GET DLT API)
  isActive: boolean
}

export interface SendOTPResponse {
  success: boolean
  requestId?: string
  message?: string
  error?: string
}

/**
 * Send OTP via Fast2SMS
 */
export async function sendOTP(
  phoneNumber: string,
  otp: string,
  config: SMSConfig
): Promise<SendOTPResponse> {
  try {
    if (!config.isActive || !config.apiKey) {
      return {
        success: false,
        error: 'SMS service is not configured'
      }
    }

    const message = `Your OTP is ${otp}. Valid for 10 minutes. Do not share this code.`

    if (config.smsType === 'quick') {
      return sendQuickSMS(phoneNumber, message, config.apiKey)
    } else if (config.smsType === 'dlt') {
      return sendDLTSMS(phoneNumber, message, config)
    }

    return {
      success: false,
      error: 'Invalid SMS type'
    }
  } catch (error: any) {
    console.error('Error sending OTP:', error)
    return {
      success: false,
      error: error.message || 'Failed to send OTP'
    }
  }
}

/**
 * Send Quick SMS via Fast2SMS
 */
async function sendQuickSMS(
  phoneNumber: string,
  message: string,
  apiKey: string
): Promise<SendOTPResponse> {
  try {
    const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
      params: {
        authorization: apiKey,
        route: 'q',
        numbers: phoneNumber,
        message: message,
        flash: 0
      }
    })

    if (response.data.return === true) {
      return {
        success: true,
        requestId: response.data.request_id
      }
    } else {
      return {
        success: false,
        error: response.data.message || 'Failed to send SMS'
      }
    }
  } catch (error: any) {
    console.error('Quick SMS error:', error)
    return {
      success: false,
      error: error.message || 'Failed to send Quick SMS'
    }
  }
}

/**
 * Send DLT SMS via Fast2SMS
 * Supports both DLT SMS (with registered template) and DLT Manual (manual message)
 */
async function sendDLTSMS(
  phoneNumber: string,
  message: string,
  config: SMSConfig
): Promise<SendOTPResponse> {
  try {
    if (!config.dlcSenderId) {
      return {
        success: false,
        error: 'DLT Sender ID not configured'
      }
    }

    // Use DLT Manual API if template_id and entity_id are available
    // This is safer for OTP since we can send custom messages
    const useManualAPI = config.dlcTemplateId || config.dlcEntityId

    let response
    
    if (useManualAPI) {
      // DLT Manual API - for custom messages without pre-registered template
      response = await axios.post(
        'https://www.fast2sms.com/dev/bulkV2',
        {
          sender_id: config.dlcSenderId,
          message: message,
          route: 'dlt_manual',
          numbers: phoneNumber,
          flash: 0,
          ...(config.dlcTemplateId && { template_id: config.dlcTemplateId }),
          ...(config.dlcEntityId && { entity_id: config.dlcEntityId })
        },
        {
          headers: {
            authorization: config.apiKey
          }
        }
      )
    } else if (config.dlcMessageId) {
      // DLT SMS API - for pre-registered templates via DLT Manager
      response = await axios.post(
        'https://www.fast2sms.com/dev/bulkV2',
        {
          sender_id: config.dlcSenderId,
          message: config.dlcMessageId,
          variables_values: message,
          route: 'dlt',
          numbers: phoneNumber,
          flash: 0
        },
        {
          headers: {
            authorization: config.apiKey
          }
        }
      )
    } else {
      return {
        success: false,
        error: 'DLT configuration incomplete. Please configure Sender ID and Template/Entity IDs or Message ID'
      }
    }

    if (response.data.return === true) {
      return {
        success: true,
        requestId: response.data.request_id
      }
    } else {
      return {
        success: false,
        error: response.data.message || 'Failed to send SMS'
      }
    }
  } catch (error: any) {
    console.error('DLT SMS error:', error)
    return {
      success: false,
      error: error.message || 'Failed to send DLT SMS'
    }
  }
}

/**
 * Get wallet balance from Fast2SMS
 */
export async function getWalletBalance(apiKey: string): Promise<number | null> {
  try {
    const response = await axios.get('https://www.fast2sms.com/dev/wallet', {
      params: {
        authorization: apiKey
      }
    })

    if (response.data.return === true) {
      return response.data.wallet_balance || 0
    } else {
      console.error('Wallet balance API error:', response.data.message)
      return null
    }
  } catch (error: any) {
    console.error('Error getting wallet balance:', error?.response?.data || error.message)
    return null
  }
}
