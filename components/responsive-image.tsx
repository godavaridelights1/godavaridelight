import Image, { type ImageProps } from "next/image"

export function ResponsiveImage({ src, unoptimized, ...props }: ImageProps) {
  const isExternalSource = typeof src === "string" && !src.startsWith("/")

  return (
    <Image
      {...props}
      src={src}
      unoptimized={unoptimized || isExternalSource}
    />
  )
}
