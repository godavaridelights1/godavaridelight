import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/lib/email-service';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const campaigns = await prisma.newsletterCampaign.findMany({
      include: {
        template: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, templateId, content, recipientEmails, type, scheduledAt, sendNow } = body;

    if (!title || !templateId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get template
    const template = await prisma.newsletterTemplate.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Determine recipients and get subscriber data
    let recipients: string[] = [];
    let subscriberMap: { [key: string]: string } = {}; // email -> subscriberId mapping
    
    if (recipientEmails && recipientEmails.length > 0) {
      // If specific emails provided, get their IDs
      const subscribersByEmail = await prisma.newsletter.findMany({
        where: { 
          email: { in: recipientEmails },
          isActive: true
        },
        select: { id: true, email: true }
      });
      recipients = subscribersByEmail.map(s => s.email);
      subscribersByEmail.forEach(s => {
        subscriberMap[s.email] = s.id;
      });
    } else {
      // Get all active newsletter subscribers
      const subscribers = await prisma.newsletter.findMany({
        where: { isActive: true },
        select: { id: true, email: true }
      });
      recipients = subscribers.map(s => s.email);
      subscribers.forEach(s => {
        subscriberMap[s.email] = s.id;
      });
    }

    const campaign = await prisma.newsletterCampaign.create({
      data: {
        title,
        subject: template.subject,
        templateId,
        content: content || template.htmlContent,
        recipients,
        recipientCount: recipients.length,
        type: type || 'newsletter',
        status: sendNow ? 'sent' : scheduledAt ? 'scheduled' : 'draft',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        sentAt: sendNow ? new Date() : null
      },
      include: {
        template: true
      }
    });

    // Send immediately if requested
    if (sendNow) {
      // Create email logs only if we have subscriber IDs
      if (recipients.length > 0) {
        const emailLogsData = recipients
          .filter(email => subscriberMap[email]) // Only include emails with valid subscriber IDs
          .map(email => ({
            subscriberId: subscriberMap[email],
            campaignId: campaign.id,
            email,
            subject: template.subject,
            status: 'sent' as const
          }));

        if (emailLogsData.length > 0) {
          try {
            await prisma.emailLog.createMany({
              data: emailLogsData
            });
          } catch (logError) {
            console.error('Error creating email logs:', logError);
            // Continue anyway, don't fail the campaign
          }
        }
      }

      // Send emails asynchronously
      EmailService.sendBulkEmails(recipients, template.subject, content || template.htmlContent)
        .then(async (sentCount) => {
          // Update campaign with sent count
          await prisma.newsletterCampaign.update({
            where: { id: campaign.id },
            data: {
              sentCount
            }
          });
        })
        .catch(error => {
          console.error('Error sending campaign emails:', error);
        });
    }

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('Failed to create campaign:', error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}
