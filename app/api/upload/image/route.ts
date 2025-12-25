import { requireAdmin, apiResponse, apiError } from '@/lib/api-middleware'
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req)
    if (authResult instanceof Response) return authResult

    // Get the form data
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return apiError('No file provided', 400)
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return apiError('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed', 400)
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return apiError('File too large. Maximum size is 5MB', 400)
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    // Save file
    const filePath = path.join(uploadsDir, fileName)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await writeFile(filePath, buffer)

    return apiResponse({
      success: true,
      url: `/uploads/${fileName}`,
      path: `uploads/${fileName}`
    })

  } catch (error: any) {
    console.error('Upload error:', error)
    return apiError(error.message || 'Internal server error', 500)
  }
}

// Delete image from storage
export async function DELETE(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req)
    if (authResult instanceof Response) return authResult

    const { searchParams } = new URL(req.url)
    const filePath = searchParams.get('path')
    
    if (!filePath) {
      return apiError('No file path provided', 400)
    }

    // Delete file
    const fullPath = path.join(process.cwd(), 'public', filePath)
    await unlink(fullPath)

    return apiResponse({ success: true, message: 'Image deleted successfully' })

  } catch (error: any) {
    console.error('Delete error:', error)
    return apiError(error.message || 'Internal server error', 500)
  }
}
