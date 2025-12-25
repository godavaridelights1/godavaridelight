import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/products/[id] - Get single product with images, reviews, and related products
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get product with images and reviews
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!product) {
      return apiError('Product not found', 404)
    }

    // Get related products (same category, different product)
    const relatedProducts = await prisma.product.findMany({
      where: {
        category: product.category,
        id: { not: params.id },
        inStock: true
      },
      include: {
        images: true,
        reviews: {
          select: { rating: true }
        }
      },
      take: 4
    })

    // Calculate average rating and review count
    const ratings = product.reviews.map((r: any) => r.rating)
    const averageRating = ratings.length > 0 
      ? Math.round((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length) * 10) / 10
      : 0

    // Transform data
    const transformedProduct = {
      ...product,
      reviews: product.reviews.map((review: any) => ({
        ...review,
        userName: review.user?.name,
        userEmail: review.user?.email
      })),
      averageRating,
      reviewCount: product.reviews.length,
      relatedProducts: relatedProducts.map((p: any) => {
        const pRatings = p.reviews.map((r: any) => r.rating)
        const pAvgRating = pRatings.length > 0
          ? Math.round((pRatings.reduce((a: number, b: number) => a + b, 0) / pRatings.length) * 10) / 10
          : 0
        return {
          ...p,
          averageRating: pAvgRating,
          reviewCount: p.reviews.length,
          reviews: undefined // Remove reviews from related products response
        }
      })
    }

    return apiResponse(transformedProduct)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

// PUT /api/products/[id] - Update product (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof Response) return authResult

    const body = await request.json()
    const {
      name,
      description,
      price,
      originalPrice,
      image,
      images,
      category,
      inStock,
      featured,
      weight,
      ingredients,
      imagesToDelete
    } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = parseFloat(price)
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? parseFloat(originalPrice) : null
    if (image !== undefined) updateData.image = image
    if (category !== undefined) updateData.category = category
    if (inStock !== undefined) updateData.inStock = inStock
    if (featured !== undefined) updateData.featured = featured
    if (weight !== undefined) updateData.weight = weight
    if (ingredients !== undefined) updateData.ingredients = ingredients

    // Handle image updates
    if (images && Array.isArray(images) && images.length > 0) {
      // Delete specified images
      if (imagesToDelete && Array.isArray(imagesToDelete) && imagesToDelete.length > 0) {
        await prisma.productImage.deleteMany({
          where: { id: { in: imagesToDelete } }
        })
      }

      // Separate new images from existing ones
      const newImages = images.filter((img: any) => !img.id) // New images don't have id
      const existingImages = images.filter((img: any) => img.id) // Existing images have id

      // Create new images
      if (newImages.length > 0) {
        await prisma.productImage.createMany({
          data: newImages.map((img: any, idx: number) => ({
            productId: params.id,
            url: img.url,
            altText: img.altText || name,
            isPrimary: img.isPrimary || (idx === 0 && existingImages.length === 0),
            displayOrder: img.displayOrder || idx
          }))
        })
      }

      // Update existing images
      for (const img of existingImages) {
        await prisma.productImage.update({
          where: { id: img.id },
          data: {
            altText: img.altText || name,
            isPrimary: img.isPrimary || false,
            displayOrder: img.displayOrder || 0
          }
        })
      }
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
      include: {
        images: {
          orderBy: { displayOrder: 'asc' }
        }
      }
    })

    // Revalidate paths to clear cache
    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath(`/products/${params.id}`)
    revalidatePath('/admin/products')

    return apiResponse(product)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

// DELETE /api/products/[id] - Delete product (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof Response) return authResult

    // Get product to check for image
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      select: { image: true }
    })

    // Delete product from database (cascade will delete related images and reviews)
    await prisma.product.delete({
      where: { id: params.id }
    })

    // Delete image file from local storage if it exists
    if (product?.image && product.image.startsWith('/uploads/')) {
      try {
        const fs = require('fs/promises')
        const path = require('path')
        const filename = product.image.split('/uploads/')[1]
        const filepath = path.join(process.cwd(), 'public', 'uploads', filename)
        await fs.unlink(filepath).catch(() => {}) // Ignore if file doesn't exist
      } catch (imgError) {
        console.error('Failed to delete image from storage:', imgError)
        // Don't fail the whole operation if image deletion fails
      }
    }

    // Revalidate paths to clear cache
    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath(`/products/${params.id}`)
    revalidatePath('/admin/products')

    return apiResponse({ message: 'Product deleted successfully' })
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
