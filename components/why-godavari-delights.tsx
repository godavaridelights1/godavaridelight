"use client"

import { ResponsiveImage as Image } from "@/components/responsive-image"
import { FadeInSection } from "@/components/fade-in-section"
import { useSiteSettings } from "@/hooks/use-site-settings"
import { Check, Heart, Star } from "lucide-react"

const values = [
  {
    icon: Star,
    title: "Rooted in tradition",
    description: "A treasured recipe, made the traditional way.",
  },
  {
    icon: Heart,
    title: "Made with care",
    description: "Every sweet is prepared with love and attention.",
  },
  {
    icon: Check,
    title: "Empowering women",
    description: "Your order helps support rural women artisans.",
  },
]

export function WhyGodavariDelights() {
  const { settings } = useSiteSettings()
  const whyGodavariImage = settings?.whyGodavariImageUrl || "/homepage-about-section.jpg"

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/20 to-white py-14 sm:py-16 lg:py-20">
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-gradient-to-bl from-orange-200 to-transparent opacity-10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-gradient-to-tr from-yellow-200 to-transparent opacity-10 blur-3xl" />

      <FadeInSection className="relative z-10 w-full">
        <Image
          src={whyGodavariImage}
          alt="The story, mission, and values behind Godavari Delights"
          width={853}
          height={1280}
          className="h-auto w-full object-contain"
          sizes="100vw"
        />
      </FadeInSection>

      <div className="container relative z-10 mx-auto px-4">
        <FadeInSection>
          <div>
            <div className="mx-auto max-w-4xl pt-8 text-center sm:pt-10">
              <span className="inline-flex rounded-full border border-orange-200 bg-orange-100/70 px-4 py-2 text-xs font-bold tracking-wide text-orange-700">
                OUR STORY
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-orange-800 sm:text-4xl lg:text-5xl">
                Why Godavari Delights?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
                Traditional Pootharekulu, made with a treasured family recipe and a purpose
                that supports rural women.
              </p>
            </div>

            <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {values.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 rounded-2xl border border-orange-100 bg-white/90 p-4 shadow-sm sm:p-5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-400">
                    <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                  </span>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}
