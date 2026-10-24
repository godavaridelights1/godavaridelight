import { ResponsiveImage } from "@/components/responsive-image"

export function HeroSection({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-[600px]">
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-400 to-amber-400 opacity-20 blur-2xl animate-pulse"></div>

      <div className="relative z-10 transform transition-transform duration-500 hover:scale-105">
        <ResponsiveImage
          src={imageUrl}
          alt="Traditional Putharekulu"
          width={600}
          height={400}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="h-auto w-full rounded-lg shadow-2xl"
        />
      </div>

      <div className="absolute -right-2 -top-2 z-20 h-16 w-16 overflow-hidden rounded-full shadow-lg animate-bounce sm:-right-8 sm:-top-8 sm:h-24 sm:w-24">
        <ResponsiveImage
          src="/dry-fruits-putharekulu-almonds-cashews.jpg"
          alt="Premium Putharekulu"
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>

      <div className="absolute -bottom-2 -left-2 z-20 h-14 w-14 overflow-hidden rounded-full shadow-lg animate-bounce sm:-bottom-6 sm:-left-6 sm:h-20 sm:w-20">
        <ResponsiveImage
          src="/coconut-putharekulu-traditional-sweet.jpg"
          alt="Coconut Putharekulu"
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      <div className="absolute right-0 top-1/2 z-20 h-12 w-12 overflow-hidden rounded-full shadow-lg animate-pulse sm:-right-12 sm:h-16 sm:w-16">
        <ResponsiveImage
          src="/saffron-putharekulu-premium-golden-sweet.jpg"
          alt="Saffron Putharekulu"
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
    </div>
  )
}
