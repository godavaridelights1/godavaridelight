"use client"

import Image from "next/image"
import { FadeInSection } from "@/components/fade-in-section"
import { useSiteSettings } from "@/hooks/use-site-settings"

export function HeroSection() {
  const { settings } = useSiteSettings()

  const heroImage = settings?.heroSectionImageUrl || "/traditional-indian-sweet-putharekulu.jpg"

  return (
    <FadeInSection direction="right" delay={200}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-lg blur-2xl opacity-20 animate-pulse"></div>

        <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
          <Image
            src={heroImage}
            alt="Traditional Putharekulu"
            width={600}
            height={400}
            className="rounded-lg shadow-2xl"
          />
        </div>

        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full overflow-hidden shadow-lg animate-bounce z-20">
          <Image
            src="/dry-fruits-putharekulu-almonds-cashews.jpg"
            alt="Premium Putharekulu"
            fill
            className="object-cover"
          />
        </div>

        <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full overflow-hidden shadow-lg animate-bounce z-20">
          <Image
            src="/coconut-putharekulu-traditional-sweet.jpg"
            alt="Coconut Putharekulu"
            fill
            className="object-cover"
          />
        </div>

        <div className="absolute top-1/2 -right-12 w-16 h-16 rounded-full overflow-hidden shadow-lg animate-pulse z-20">
          <Image
            src="/saffron-putharekulu-premium-golden-sweet.jpg"
            alt="Saffron Putharekulu"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </FadeInSection>
  )
}
