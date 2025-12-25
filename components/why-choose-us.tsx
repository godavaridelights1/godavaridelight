"use client"

import { FadeInSection } from "@/components/fade-in-section"
import {
  Package,
  Users,
  Globe,
  Heart,
  Beaker,
  Award,
  Sparkles,
  Leaf,
  Flame,
  Crown,
} from "lucide-react"

interface WhyChooseUsItem {
  icon: React.ElementType
  title: string
  description: string
  color: string
  bgColor: string
}

const whyChooseUsItems: WhyChooseUsItem[] = [
  {
    icon: Package,
    title: "Eco-Friendly Packaging",
    description: "Sustainable and environmentally conscious packaging",
    color: "text-green-600",
    bgColor: "from-green-100 to-emerald-100",
  },
  {
    icon: Users,
    title: "Artisan Made",
    description: "Crafted by 500+ skilled women artisans from Atreyapuram",
    color: "text-pink-600",
    bgColor: "from-pink-100 to-rose-100",
  },
  {
    icon: Globe,
    title: "Worldwide Delivery",
    description: "Fresh delivery to your doorstep anywhere in India",
    color: "text-blue-600",
    bgColor: "from-blue-100 to-cyan-100",
  },
  {
    icon: Heart,
    title: "Highly Nutritious",
    description: "Pure ghee, natural jaggery, and premium dry fruits",
    color: "text-red-600",
    bgColor: "from-red-100 to-pink-100",
  },
  {
    icon: Beaker,
    title: "Preservative Free",
    description: "No artificial preservatives or additives",
    color: "text-purple-600",
    bgColor: "from-purple-100 to-indigo-100",
  },
  {
    icon: Award,
    title: "Certified Quality",
    description: "ISO certified and industry approved standards",
    color: "text-yellow-600",
    bgColor: "from-yellow-100 to-amber-100",
  },
  {
    icon: Sparkles,
    title: "No Artificial Flavoring",
    description: "100% natural ingredients and authentic taste",
    color: "text-orange-600",
    bgColor: "from-orange-100 to-amber-100",
  },
  {
    icon: Leaf,
    title: "100% Pure Vegetarian",
    description: "FSSAI approved and purely vegetarian",
    color: "text-teal-600",
    bgColor: "from-teal-100 to-cyan-100",
  },
]

const specialFeatures = [
  {
    icon: Crown,
    title: "Bigger & Richer",
    description: "Each sheet is crafted to be more generous, filled with authentic ingredients",
  },
  {
    icon: Flame,
    title: "Wholesome Goodness",
    description: "Prepared with pure ghee, handpicked nuts, and natural jaggery",
  },
  {
    icon: Sparkles,
    title: "Unmatched Taste",
    description: "Melt-in-mouth delight that captures the essence of joy in every bite",
  },
  {
    icon: Heart,
    title: "Made with Heart",
    description: "Every Pootharekulu is handcrafted with care and empowerment",
  },
]

export function WhyChooseUs() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-white via-orange-50/20 to-white overflow-hidden">
      {/* Animated background decorations */}
      <div className="absolute top-10 left-5 w-32 h-32 bg-orange-200 rounded-full opacity-10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-200 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-amber-200 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <FadeInSection>
          <div className="text-center space-y-6 mb-20">
            <div className="inline-block">
              <span className="text-sm font-semibold text-orange-600 bg-orange-100/50 px-4 py-2 rounded-full border border-orange-200">
                ✨ What Makes Us Special
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
              What Makes Our Pootharekulu So Good?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
              Straight from Atreyapuram, the birthplace of authentic Pootharekulu. Every bite melts in your mouth, 
              wrapping you in the rich, nostalgic taste of tradition.
            </p>
          </div>
        </FadeInSection>

        {/* Special Features in Circle Cards */}
        <div className="mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {specialFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <FadeInSection key={index} delay={index * 100}>
                  <div className="group cursor-pointer h-full">
                    <div className="relative h-full flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-gradient-to-br from-white to-orange-50/30 border-2 border-orange-100 transition-all duration-500 hover:border-orange-400 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50">
                      {/* Animated glow effect on hover */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-orange-300/20 to-amber-300/20 blur-lg"></div>

                      <div className="relative z-10 space-y-4">
                        <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          <Icon className="h-7 w-7 text-orange-700" />
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-700 transition-colors duration-300">
                          {feature.title}
                        </h3>

                        <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                          {feature.description}
                        </p>
                      </div>

                      {/* Bottom accent line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                    </div>
                  </div>
                </FadeInSection>
              )
            })}
          </div>
        </div>

        {/* Main Features Grid */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-12 text-gray-900">
            Why Choose Godavari Delights?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUsItems.map((item, index) => {
              const Icon = item.icon
              return (
                <FadeInSection key={index} delay={index * 75}>
                  <div className="group cursor-pointer h-full">
                    <div className={`h-full flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-br ${item.bgColor} border-2 border-transparent transition-all duration-500 hover:border-orange-400 relative overflow-hidden group`}>
                      {/* Background animation on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-orange-400 to-amber-400"></div>

                      <div className="relative z-10 flex flex-col items-center w-full space-y-4">
                        {/* Circular icon container */}
                        <div className="w-20 h-20 rounded-full bg-white/80 flex items-center justify-center group-hover:bg-white transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg shadow-md">
                          <Icon className={`h-10 w-10 ${item.color} transition-transform duration-500 group-hover:rotate-6`} />
                        </div>

                        <h3 className="text-base font-bold text-gray-900 group-hover:text-orange-700 transition-colors duration-300 leading-tight">
                          {item.title}
                        </h3>

                        <p className="text-xs text-gray-700 group-hover:text-gray-800 transition-colors duration-300 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Animated accent line at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    </div>
                  </div>
                </FadeInSection>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA Section */}
        <FadeInSection delay={600}>
          <div className="mt-20 p-10 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 rounded-3xl border-2 border-orange-200/50 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-300 to-transparent opacity-10 rounded-full blur-3xl"></div>
            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
              <p className="text-lg text-gray-800 leading-relaxed">
                <span className="font-bold text-orange-700 text-xl">Godavari Delights</span> brings you authentic <span className="font-bold">Atreyapuram Pootharekulu</span> — 
                a sweet tradition revived with pride. Each Pootharekulu is more than a delicacy; it's a heartfelt connection to tradition, 
                crafted with care by our skilled artisans for your joy and satisfaction.
              </p>
              <p className="text-sm text-gray-700 font-medium">
                🍬 Experience the taste of heritage, one bite at a time! 🍬
              </p>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}
