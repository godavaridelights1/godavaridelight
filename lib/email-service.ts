import nodemailer from 'nodemailer';
import { prisma } from './prisma';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static transporter: nodemailer.Transporter | null = null;

  static async initializeTransport() {
    try {
      const smtpConfig = await prisma.sMTPConfig.findFirst({
        where: { isActive: true }
      });

      if (!smtpConfig) {
        console.warn('No active SMTP configuration found');
        return false;
      }

      this.transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.secure,
        auth: {
          user: smtpConfig.username,
          pass: smtpConfig.password
        }
      });

      // Verify connection
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Failed to initialize email transport:', error);
      return false;
    }
  }

  static async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!this.transporter) {
        const initialized = await this.initializeTransport();
        if (!initialized) return false;
      }

      const smtpConfig = await prisma.sMTPConfig.findFirst({
        where: { isActive: true }
      });

      if (!smtpConfig) return false;

      const mailOptions = {
        from: `${smtpConfig.fromName} <${smtpConfig.fromEmail}>`,
        to: Array.isArray(options.to) ? options.to.join(',') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || ''
      };

      const info = await this.transporter!.sendMail(mailOptions);
      return !!info.messageId;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  static async sendBulkEmails(emails: string[], subject: string, html: string): Promise<number> {
    let successCount = 0;

    for (const email of emails) {
      try {
        const sent = await this.sendEmail({
          to: email,
          subject,
          html
        });
        if (sent) successCount++;
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
      }
    }

    return successCount;
  }

  // Render template with shortcodes
  static renderTemplate(htmlTemplate: string, data: Record<string, string>): string {
    let rendered = htmlTemplate;

    // Replace shortcodes with data
    Object.entries(data).forEach(([key, value]) => {
      const shortcode = new RegExp(`{{${key}}}`, 'gi');
      rendered = rendered.replace(shortcode, value || '');
    });

    return rendered;
  }
}
