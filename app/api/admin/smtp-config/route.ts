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

    const config = await prisma.sMTPConfig.findFirst({
      select: {
        id: true,
        provider: true,
        host: true,
        port: true,
        secure: true,
        username: true,
        fromEmail: true,
        fromName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
        // Don't return password
      }
    });

    return NextResponse.json(config || {});
  } catch (error) {
    console.error('Failed to fetch SMTP config:', error);
    return NextResponse.json({ error: 'Failed to fetch configuration' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { provider, host, port, secure, username, password, fromEmail, fromName, isActive } = body;

    // Validate required fields
    if (!host || !username || !password || !fromEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if config exists
    const existing = await prisma.sMTPConfig.findFirst();

    const config = existing
      ? await prisma.sMTPConfig.update({
          where: { id: existing.id },
          data: {
            provider: provider || 'custom',
            host,
            port: parseInt(port) || 587,
            secure: secure === 'true' || secure === true,
            username,
            password,
            fromEmail,
            fromName: fromName || 'Athrayapuram',
            isActive: isActive === 'true' || isActive === true
          },
          select: {
            id: true,
            provider: true,
            host: true,
            port: true,
            secure: true,
            username: true,
            fromEmail: true,
            fromName: true,
            isActive: true,
            updatedAt: true
          }
        })
      : await prisma.sMTPConfig.create({
          data: {
            provider: provider || 'custom',
            host,
            port: parseInt(port) || 587,
            secure: secure === 'true' || secure === true,
            username,
            password,
            fromEmail,
            fromName: fromName || 'Athrayapuram',
            isActive: isActive === 'true' || isActive === true
          },
          select: {
            id: true,
            provider: true,
            host: true,
            port: true,
            secure: true,
            username: true,
            fromEmail: true,
            fromName: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
          }
        });

    return NextResponse.json(config);
  } catch (error) {
    console.error('Failed to save SMTP config:', error);
    return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 });
  }
}

// Test SMTP configuration
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { testEmail } = await req.json();

    if (!testEmail) {
      return NextResponse.json({ error: 'Test email required' }, { status: 400 });
    }

    const config = await prisma.sMTPConfig.findFirst();
    if (!config) {
      return NextResponse.json({ error: 'No SMTP configuration found' }, { status: 404 });
    }

    // Try to send test email
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.username,
        pass: config.password
      }
    });

    const info = await transporter.sendMail({
      from: `${config.fromName} <${config.fromEmail}>`,
      to: testEmail,
      subject: 'SMTP Configuration Test - Athrayapuram',
      html: '<h2>SMTP Configuration Test</h2><p>This is a test email. If you received this, your SMTP configuration is working correctly!</p>'
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Failed to send test email:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send test email' },
      { status: 500 }
    );
  }
}
