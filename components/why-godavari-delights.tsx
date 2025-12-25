"use client"

import Image from "next/image"
import { FadeInSection } from "@/components/fade-in-section"
import { useSiteSettings } from "@/hooks/use-site-settings"
import { Check, Heart, Star, Zap } from "lucide-react"

export function WhyGodavariDelights() {
  const { settings } = useSiteSettings()
  const whyGodavariImage = settings?.whyGodavariImageUrl || "/homepage-about-section.jpg"

  const highlights = [
    {
      icon: Zap,
      text: "1.5x Bigger & Heavier",
      description: "Generously crafted for maximum satisfaction",
    },
    {
      icon: Heart,
      text: "3x More Nutritious",
      description: "Packed with wholesome ingredients",
    },
    {
      icon: Star,
      text: "5x More Delicious",
      description: "Authentic taste that melts in your mouth",
    },
    {
      icon: Check,
      text: "10x More Loveable",
      description: "Crafted with passion and purpose",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white via-orange-50/20 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-200 to-transparent opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-yellow-200 to-transparent opacity-10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Image */}
          <FadeInSection direction="left">
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -inset-4 bg-gradient-to-br from-orange-300 to-yellow-300 rounded-3xl opacity-20 blur-lg animate-pulse"></div>
              <div className="absolute -inset-2 bg-gradient-to-br from-orange-200 to-amber-200 rounded-3xl opacity-30 animate-pulse" style={{ animationDelay: "0.5s" }}></div>

              {/* Image container */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src={whyGodavariImage}
                  alt="Why Godavari Delights - Pootharekulu Story"
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />

                {/* Overlay badge */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md rounded-2xl px-6 py-4 shadow-lg">
                  <p className="text-sm font-bold text-orange-700">✨ India's Top Selling</p>
                  <p className="text-xs text-gray-600 font-medium">Putharekulu Brand</p>
                </div>
              </div>
            </div>
          </FadeInSection>

          {/* Right Side - Content */}
          <FadeInSection direction="right" delay={200}>
            <div className="space-y-8">
              {/* Title Section */}
              <div className="space-y-4">
                <div className="inline-block">
                  <span className="text-xs font-bold text-orange-600 bg-orange-100/50 px-4 py-2 rounded-full border border-orange-200">
                    🌟 OUR STORY
                  </span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Why Godavari Delights?
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed font-medium">
                  Our Pootharekulu sweets are crafted using a <span className="text-orange-600 font-bold">Secret & Unique Recipe</span> passed down 
                  from our beloved grandmothers—a legacy of authenticity and tradition.
                </p>
              </div>

              {/* Comparison Highlights */}
              <div className="grid grid-cols-2 gap-4">
                {highlights.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <FadeInSection key={index} delay={300 + index * 100}>
                      <div className="group p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-100 hover:border-orange-400 transition-all duration-500 hover:shadow-lg cursor-pointer relative overflow-hidden">
                        {/* Animated background on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-orange-400 to-amber-400 transition-opacity duration-500"></div>

                        <div className="relative z-10 space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <p className="font-bold text-gray-900 text-sm group-hover:text-orange-700 transition-colors duration-300">
                              {item.text}
                            </p>
                          </div>
                          <p className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors duration-300 ml-10">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </FadeInSection>
                  )
                })}
              </div>

              {/* Mission Statement */}
              <div className="space-y-6 pt-6 border-t-2 border-orange-200">
                {/* Empowerment Message */}
                <FadeInSection delay={500}>
                  <div className="group p-6 rounded-2xl bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 hover:border-red-400 transition-all duration-500 cursor-pointer relative overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-15 bg-gradient-to-br from-red-400 to-pink-400 transition-opacity duration-500"></div>

                    <div className="relative z-10">
                      <p className="text-sm font-bold text-red-700 mb-2 flex items-center space-x-2">
                        <Heart className="h-5 w-5" />
                        <span>Happier Women = Healthier Families</span>
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Every Putharekulu sweet purchased empowers rural women in need, helping them become financially independent and self-reliant.
                      </p>
                    </div>
                  </div>
                </FadeInSection>

                {/* Purpose Message */}
                <FadeInSection delay={600}>
                  <div className="group p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 hover:border-amber-400 transition-all duration-500 cursor-pointer relative overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-15 bg-gradient-to-br from-amber-400 to-orange-400 transition-opacity duration-500"></div>

                    <div className="relative z-10">
                      <p className="text-sm font-bold text-amber-800 mb-3 flex items-center space-x-2">
                        <Star className="h-5 w-5" />
                        <span>Our 3-Pillar Promise</span>
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 rounded-full bg-orange-600 mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold text-orange-700">Purpose:</span> Making your celebrations brighter
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 rounded-full bg-orange-600 mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold text-orange-700">Mission:</span> Empowering rural women
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 rounded-full bg-orange-600 mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold text-orange-700">Message:</span> Spreading happiness everywhere
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeInSection>
              </div>

              {/* Bottom accent line */}
              <div className="pt-6 flex items-center space-x-4">
                <div className="flex-1 h-1 bg-gradient-to-r from-orange-400 to-transparent rounded-full"></div>
                <p className="text-sm font-semibold text-orange-700 whitespace-nowrap">Crafted with Love</p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  )
}
