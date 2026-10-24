import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const imageId = request.nextUrl.searchParams.get("imageId")
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    select: {
      image: true,
      images: imageId
        ? {
            where: { id: imageId },
            select: { url: true },
            take: 1,
          }
        : false,
    },
  })

  const imageUrl = imageId ? product?.images[0]?.url : product?.image
  const match = imageUrl?.match(
    /^data:(image\/(?:jpeg|jpg|png|webp|gif));base64,([A-Za-z0-9+/]*={0,2})$/i,
  )

  if (!match) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 })
  }

  if (match[2].length > 7 * 1024 * 1024) {
    return NextResponse.json({ error: "Image exceeds the supported size" }, { status: 413 })
  }

  const image = Buffer.from(match[2], "base64")
  return new NextResponse(image, {
    headers: {
      "Content-Type": match[1],
      "Content-Length": String(image.length),
      "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
    },
  })
}
