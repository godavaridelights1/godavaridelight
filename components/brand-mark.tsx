import { ResponsiveImage } from "@/components/responsive-image"

interface BrandMarkProps {
  size?: number
}

export function BrandMark({ size = 40 }: BrandMarkProps) {
  return (
    <span
      className="relative block shrink-0 overflow-hidden rounded-full"
      style={{ width: size, height: size }}
    >
      <ResponsiveImage
        src="/godavari-delights-emblem.jpg"
        alt="Godavari Delights logo"
        fill
        sizes={`${size}px`}
        className="object-cover"
      />
    </span>
  )
}
