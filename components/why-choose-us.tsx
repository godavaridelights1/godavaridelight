"use client"

import { useEffect, useRef, useState } from "react"
import {
  Award,
  Beaker,
  Globe,
  Heart,
  Leaf,
  Package,
  Sparkles,
  Users,
} from "lucide-react"

const features = [
  {
    icon: Package,
    title: "Eco-Friendly Packaging",
    description: "Sustainable, thoughtful packaging",
    color: "text-green-600",
    background: "from-green-100 to-emerald-100",
  },
  {
    icon: Users,
    title: "Artisan Made",
    description: "Crafted by skilled Atreyapuram artisans",
    color: "text-pink-600",
    background: "from-pink-100 to-rose-100",
  },
  {
    icon: Globe,
    title: "Delivery Across India",
    description: "Fresh delivery to your doorstep",
    color: "text-blue-600",
    background: "from-blue-100 to-cyan-100",
  },
  {
    icon: Heart,
    title: "Quality Ingredients",
    description: "Pure ghee, jaggery, and premium dry fruits",
    color: "text-red-600",
    background: "from-red-100 to-pink-100",
  },
  {
    icon: Beaker,
    title: "Preservative Free",
    description: "No artificial preservatives or additives",
    color: "text-purple-600",
    background: "from-purple-100 to-indigo-100",
  },
  {
    icon: Award,
    title: "Certified Quality",
    description: "Made to high quality standards",
    color: "text-yellow-600",
    background: "from-yellow-100 to-amber-100",
  },
  {
    icon: Sparkles,
    title: "Authentic Taste",
    description: "Traditional flavor, naturally delicious",
    color: "text-orange-600",
    background: "from-orange-100 to-amber-100",
  },
  {
    icon: Leaf,
    title: "Pure Vegetarian",
    description: "Made with vegetarian ingredients",
    color: "text-teal-600",
    background: "from-teal-100 to-cyan-100",
  },
]

export function WhyChooseUs() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const firstSetRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const scroller = scrollerRef.current
    const firstSet = firstSetRef.current
    if (!scroller || !firstSet) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frameId = 0
    let previousTime = 0

    const animate = (time: number) => {
      if (previousTime && !isPaused) {
        scroller.scrollLeft += ((time - previousTime) / 1000) * 20
        if (scroller.scrollLeft >= firstSet.offsetWidth) {
          scroller.scrollLeft -= firstSet.offsetWidth
        }
      }
      previousTime = time
      frameId = window.requestAnimationFrame(animate)
    }

    frameId = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(frameId)
  }, [isPaused])

  const renderFeatures = () =>
    features.map(({ icon: Icon, title, description, color, background }) => (
      <article
        key={title}
        className={`flex h-[160px] w-[220px] shrink-0 flex-col items-center justify-center gap-3 rounded-2xl bg-gradient-to-br ${background} px-4 py-4 text-center sm:h-[170px] sm:w-[250px]`}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/80 shadow-sm">
          <Icon aria-hidden="true" className={`h-6 w-6 ${color}`} />
        </div>
        <h3 className="text-sm font-bold leading-tight text-gray-900">{title}</h3>
        <p className="text-xs leading-snug text-gray-700">{description}</p>
      </article>
    ))

  return (
    <section className="overflow-hidden bg-gradient-to-br from-white via-orange-50/20 to-white py-8 sm:py-10">
      <div className="container mx-auto px-4">
        <h2 className="mb-5 text-center text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl">
          Why Choose Godavari Delights?
        </h2>
        <div
          ref={scrollerRef}
          aria-label="Why choose Godavari Delights"
          className="overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onPointerEnter={() => setIsPaused(true)}
          onPointerLeave={() => setIsPaused(false)}
          onPointerDown={() => setIsPaused(true)}
          onPointerUp={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setIsPaused(false)
            }
          }}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="flex w-max gap-3">
            <div ref={firstSetRef} className="flex shrink-0 gap-3 pr-3">
              {renderFeatures()}
            </div>
            <div aria-hidden="true" className="flex shrink-0 gap-3 pr-3">
              {renderFeatures()}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
