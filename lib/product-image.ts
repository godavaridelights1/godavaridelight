export function getProductImageUrl(productId: string, imageUrl: string, imageId?: string) {
  if (!imageUrl.startsWith("data:image/")) {
    return imageUrl
  }

  const imagePath = `/api/products/${productId}/image`
  return imageId ? `${imagePath}?imageId=${encodeURIComponent(imageId)}` : imagePath
}
