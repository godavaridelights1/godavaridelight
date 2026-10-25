import { prisma } from "@/lib/prisma"
import { getProductImageUrl } from "@/lib/product-image"
import type { Product } from "@/lib/types"
import ProductsClient from "@/components/products-client"

async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { isArchived: false },
          { isArchived: { isSet: false } },
          { isArchived: null },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        originalPrice: true,
        image: true,
        category: true,
        inStock: true,
        featured: true,
        weight: true,
        averageRating: true,
        reviewCount: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return products.map((product) => ({
      ...product,
      description: product.description || "",
      originalPrice: product.originalPrice ?? undefined,
      image: product.image ? getProductImageUrl(product.id, product.image) : "",
      weight: product.weight ?? undefined,
      averageRating: product.averageRating ?? 0,
      images: [],
    }))
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}

export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductsClient initialProducts={products} />
}

export const revalidate = 0
