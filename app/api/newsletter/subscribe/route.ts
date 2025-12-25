import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, preferences } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const subscriber = await prisma.newsletter.upsert({
      where: { email },
      update: {
        isActive: true,
        ...(name && { name }),
        ...(preferences && { preferences })
      },
      create: {
        email,
        name,
        isActive: true,
        preferences: preferences && preferences.length > 0 ? preferences : ['offers']
      }
    });

    return NextResponse.json(
      { success: true, subscriber },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to subscribe:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}
