import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'customer'
}

export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return null
    }

    return {
      id: session.user.id,
      email: session.user.email || '',
      name: session.user.name || '',
      role: session.user.role as 'admin' | 'customer'
    }
  } catch (error) {
    console.error('Auth verification error:', error)
    return null
  }
}

export async function requireAuth(request: NextRequest): Promise<{ user: AuthUser } | NextResponse> {
  const user = await verifyAuth(request)
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  return { user }
}

export async function requireAdmin(request: NextRequest): Promise<{ user: AuthUser } | NextResponse> {
  const user = await verifyAuth(request)
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  if (user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden: Admin access required' },
      { status: 403 }
    )
  }
  
  return { user }
}

export function apiResponse<T>(data: T, status: number = 200) {
  return NextResponse.json({ data }, { status })
}

export function apiError(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status })
}
