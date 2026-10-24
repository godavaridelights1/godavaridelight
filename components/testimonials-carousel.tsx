"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Testimonial {
  name: string
  location: string
  review: string
  rating: number
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const firstGroupRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    const firstGroup = firstGroupRef.current
    if (!container || !firstGroup || testimonials.length < 2) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reduceMotion.matches) return

    let animationFrame = 0
    let previousTime = 0
    const pixelsPerSecond = 24

    const animate = (time: number) => {
      if (previousTime && !isPaused) {
        container.scrollLeft += ((time - previousTime) / 1000) * pixelsPerSecond
        if (container.scrollLeft >= firstGroup.offsetWidth) {
          container.scrollLeft -= firstGroup.offsetWidth
        }
      }
      previousTime = time
      animationFrame = window.requestAnimationFrame(animate)
    }

    animationFrame = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [isPaused, testimonials.length])

  const renderTestimonials = () =>
    testimonials.map((testimonial, index) => (
      <Card
        key={`${testimonial.name}-${index}`}
        className="flex h-[230px] w-[min(78vw,300px)] shrink-0 snap-start flex-col p-0 transition-shadow duration-300 hover:shadow-lg sm:w-[320px]"
      >
        <CardContent className="flex h-full flex-col space-y-3 p-5 sm:p-6">
          <div className="flex items-center space-x-1" aria-label={`${testimonial.rating} out of 5 stars`}>
            {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
              <Star key={starIndex} aria-hidden="true" className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="flex-1 overflow-y-auto text-sm text-muted-foreground italic">
            {testimonial.review ? `"${testimonial.review}"` : "Rated 5 stars"}
          </p>
          <div className="mt-auto">
            <p className="font-semibold">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">{testimonial.location}</p>
          </div>
        </CardContent>
      </Card>
    ))

  return (
    <div
      ref={containerRef}
      aria-label="Customer reviews"
      className="-mx-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false)
        }
      }}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="flex w-max snap-x snap-mandatory gap-5">
        <div ref={firstGroupRef} className="flex shrink-0 gap-5 pr-5">
          {renderTestimonials()}
        </div>
        <div aria-hidden="true" className="flex shrink-0 gap-5 pr-5">
          {renderTestimonials()}
        </div>
      </div>
    </div>
  )
}
