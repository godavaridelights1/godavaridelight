import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-middleware'
import { ImageStorageConfigurationError, storeImage } from '@/lib/image-storage'

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof Response) return authResult

    const formData = await request.formData()
    const file = formData.get('file')
    
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      )
    }

    // Keep multipart uploads below Vercel Function's request body limit.
    const maxSize = 4 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 4MB.' },
        { status: 400 }
      )
    }

    const image = await storeImage(file)

    return NextResponse.json({
      success: true,
      url: image.url,
      filename: image.filename,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload file' },
      { status: error instanceof ImageStorageConfigurationError ? 503 : 500 }
    )
  }
}
