import { requireAdmin, apiResponse, apiError } from '@/lib/api-middleware'
import { NextRequest } from 'next/server'
import { deleteStoredImage, ImageStorageConfigurationError, storeImage } from '@/lib/image-storage'

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req)
    if (authResult instanceof Response) return authResult

    // Get the form data
    const formData = await req.formData()
    const file = formData.get('file')
    
    if (!(file instanceof File)) {
      return apiError('No file provided', 400)
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return apiError('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed', 400)
    }

    const maxSize = 4 * 1024 * 1024
    if (file.size > maxSize) {
      return apiError('File too large. Maximum size is 4MB', 400)
    }

    const image = await storeImage(file)

    return apiResponse({
      success: true,
      url: image.url,
      path: image.path,
    })

  } catch (error) {
    console.error('Upload error:', error)
    return apiError(
      error instanceof Error ? error.message : 'Internal server error',
      error instanceof ImageStorageConfigurationError ? 503 : 500
    )
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

    await deleteStoredImage(filePath)

    return apiResponse({ success: true, message: 'Image deleted successfully' })

  } catch (error) {
    console.error('Delete error:', error)
    return apiError(error instanceof Error ? error.message : 'Internal server error', 500)
  }
}
