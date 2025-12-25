import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin, apiResponse, apiError } from '@/lib/api-middleware'
import { prisma } from '@/lib/prisma'

// Disable caching for this API route
export const dynamic = 'force-dynamic'

// GET /api/products - Get all products with images and ratings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const inStock = searchParams.get('inStock')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')
    const includeImages = searchParams.get('includeImages') !== 'false'

    // Build Prisma where clause
    const where: any = {}

    if (category && category !== 'all') {
      where.category = { contains: category, mode: 'insensitive' }
    }

    if (featured === 'true') {
      where.featured = true
    }

    if (inStock === 'true') {
      where.inStock = true
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Fetch products with optional images and reviews
    const products = await prisma.product.findMany({
      where,
      include: {
        images: includeImages,
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined
    })

    // Calculate average rating for each product
    const productsWithRatings = products.map((product: any) => {
      const ratings = product.reviews.map((r: any) => r.rating)
      const averageRating = ratings.length > 0 
        ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length 
        : 0

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        inStock: product.inStock,
        featured: product.featured,
        weight: product.weight,
        ingredients: product.ingredients,
        nutritionalInfo: product.nutritionalInfo,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: product.reviews.length,
        images: product.images,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }
    })

    return apiResponse(productsWithRatings)
  } catch (error: any) {
    console.error('API error:', error)
    return apiError(error.message, 500)
  }
}

// POST /api/products - Create new product (Admin only)
export async function POST(request: NextRequest) {
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
      category,
      inStock = true,
      featured = false,
      weight,
      ingredients,
      images = [] // Array of image objects { url, altText, isPrimary, displayOrder }
    } = body

    // Validation
    if (!name || !price || !category) {
      return apiError('Name, price, and category are required', 400)
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        image, // Keep legacy image field
        category,
        inStock,
        featured,
        weight,
        ingredients,
        // Create images if provided
        ...(images.length > 0 && {
          images: {
            create: images.map((img: any, idx: number) => ({
              url: img.url,
              altText: img.altText || name,
              isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
              displayOrder: img.displayOrder !== undefined ? img.displayOrder : idx
            }))
          }
        })
      },
      include: {
        images: true
      }
    })

    // Revalidate paths to clear cache
    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/admin/products')

    return apiResponse(product, 201)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
