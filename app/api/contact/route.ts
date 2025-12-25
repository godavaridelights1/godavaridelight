import { NextRequest } from 'next/server'
import { apiResponse, apiError } from '@/lib/api-middleware'
import { EmailService } from '@/lib/email-service'

// POST /api/contact - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validation
    if (!name || !email || !subject || !message) {
      return apiError('Name, email, subject, and message are required', 400)
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return apiError('Invalid email address', 400)
    }

    // Send email notification to admin
    try {
      await EmailService.sendContactFormEmail({
        name,
        email,
        phone: phone || 'Not provided',
        subject,
        message
      })
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
      // Don't fail the request if email fails
    }

    // You could also save to database here
    // await prisma.contactSubmission.create({
    //   data: { name, email, phone, subject, message }
    // })

    return apiResponse({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.'
    })
  } catch (error: any) {
    console.error('Contact form error:', error)
    return apiError(error.message || 'Failed to submit contact form', 500)
  }
}
