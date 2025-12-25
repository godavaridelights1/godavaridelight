import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get overall analytics
    const totalCampaigns = await prisma.newsletterCampaign.count();
    const totalSubscribers = await prisma.newsletter.count({ where: { isActive: true } });
    const totalEmails = await prisma.emailLog.count();
    
    const sentEmails = await prisma.emailLog.count({ where: { status: 'sent' } });
    const openedEmails = await prisma.emailLog.count({ where: { status: 'opened' } });
    const bouncedEmails = await prisma.emailLog.count({ where: { status: 'bounced' } });

    // Get top campaigns
    const topCampaigns = await prisma.newsletterCampaign.findMany({
      orderBy: { sentAt: 'desc' },
      take: 5,
      include: {
        template: true
      }
    });

    // Calculate metrics
    const openRate = totalEmails > 0 ? Math.round((openedEmails / totalEmails) * 100) : 0;
    const bounceRate = totalEmails > 0 ? Math.round((bouncedEmails / totalEmails) * 100) : 0;

    return NextResponse.json({
      totalCampaigns,
      totalSubscribers,
      totalEmails,
      sentEmails,
      openedEmails,
      bouncedEmails,
      openRate,
      bounceRate,
      topCampaigns
    });
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
