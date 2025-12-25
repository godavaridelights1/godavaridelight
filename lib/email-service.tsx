// Email service for sending coupons and newsletters
export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export class EmailService {
  // Mock email service - replace with actual email provider (SendGrid, Resend, etc.)
  static async sendEmail(data: EmailData): Promise<boolean> {
    try {
      // Simulate API call
      console.log("[v0] Sending email:", data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return true
    } catch (error) {
      console.error("[v0] Email sending failed:", error)
      return false
    }
  }

  static async sendCouponEmail(
    email: string,
    couponCode: string,
    couponValue: number,
    type: "percentage" | "fixed",
  ): Promise<boolean> {
    const subject = `🎉 Special Offer: ${couponValue}${type === "percentage" ? "%" : "₹"} Off on Putharekulu!`
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #8B4513; margin: 0;">Athrayapuram Putharekulu</h1>
          <p style="color: #666; margin: 5px 0;">Traditional Sweets, Modern Convenience</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #FFF8DC, #F5E6D3); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <h2 style="color: #8B4513; margin: 0 0 15px 0;">🎉 Special Offer Just for You!</h2>
          <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
            Get ${couponValue}${type === "percentage" ? "% OFF" : "₹ OFF"} on your next order of delicious Putharekulu!
          </p>
          <div style="background: white; padding: 15px; border-radius: 8px; border: 2px dashed #8B4513; margin: 20px 0;">
            <p style="margin: 0; color: #666; font-size: 14px;">Use Coupon Code:</p>
            <h3 style="margin: 5px 0; color: #8B4513; font-size: 24px; letter-spacing: 2px;">${couponCode}</h3>
          </div>
          <p style="color: #666; font-size: 14px; margin: 0;">Valid until limited time. Terms and conditions apply.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/products" 
             style="background: #8B4513; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Shop Now
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
          <p>Thank you for choosing Athrayapuram Putharekulu!</p>
          <p>If you don't want to receive these emails, you can unsubscribe at any time.</p>
        </div>
      </div>
    `

    return this.sendEmail({ to: email, subject, html })
  }

  static async sendNewsletterEmail(email: string, subject: string, content: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #8B4513; margin: 0;">Athrayapuram Putharekulu</h1>
          <p style="color: #666; margin: 5px 0;">Traditional Sweets Newsletter</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          ${content}
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
          <p>Thank you for subscribing to our newsletter!</p>
          <p>If you don't want to receive these emails, you can unsubscribe at any time.</p>
        </div>
      </div>
    `

    return this.sendEmail({ to: email, subject, html })
  }

  static async sendContactFormEmail(data: {
    name: string
    email: string
    phone: string
    subject: string
    message: string
  }): Promise<boolean> {
    const subject = `New Contact Form Submission: ${data.subject}`
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@restaurant.com'
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #8B4513; margin: 0;">Athrayapuram Putharekulu</h1>
          <p style="color: #666; margin: 5px 0;">Contact Form Submission</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #8B4513; margin: 0 0 20px 0;">New Contact Form Submission</h2>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #333;">Name:</strong>
            <p style="margin: 5px 0; color: #666;">${data.name}</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #333;">Email:</strong>
            <p style="margin: 5px 0; color: #666;">${data.email}</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #333;">Phone:</strong>
            <p style="margin: 5px 0; color: #666;">${data.phone}</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #333;">Subject:</strong>
            <p style="margin: 5px 0; color: #666;">${data.subject}</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #333;">Message:</strong>
            <p style="margin: 5px 0; color: #666; white-space: pre-wrap;">${data.message}</p>
          </div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
          <p>This is an automated message from your website contact form.</p>
        </div>
      </div>
    `

    return this.sendEmail({ to: adminEmail, subject, html })
  }
}

// Standalone password reset email function
export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
  userName?: string
): Promise<boolean> {
  const subject = 'Reset Your Password - Athrayapuram Putharekulu'
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8B4513; margin: 0;">Athrayapuram Putharekulu</h1>
        <p style="color: #666; margin: 5px 0;">Password Reset Request</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
          ${userName ? `Hi ${userName},` : 'Hello,'}
        </p>
        <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
          We received a request to reset your password. Click the button below to create a new password.
          This link will expire in 1 hour.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background: #8B4513; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #999; font-size: 12px; line-height: 1.6; margin-top: 30px;">
          If you didn't request this password reset, you can safely ignore this email. Your password will not be changed.
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 10px;">
          If the button doesn't work, copy and paste this URL into your browser:<br/>
          <span style="color: #8B4513;">${resetUrl}</span>
        </p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
        <p>Thank you for choosing Athrayapuram Putharekulu!</p>
      </div>
    </div>
  `

  return EmailService.sendEmail({ to: email, subject, html })
}
