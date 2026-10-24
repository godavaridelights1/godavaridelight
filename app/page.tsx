import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"
import { PromotionBanner } from "@/components/promotion-banner"
import { PromotionPopup } from "@/components/promotion-popup"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { LazyChatbot } from "@/components/lazy-chatbot"
import { FadeInSection } from "@/components/fade-in-section"
import { AnimatedCounter } from "@/components/animated-counter"
import { FloatingElements } from "@/components/floating-elements"
import { ScrollProgress } from "@/components/scroll-progress"
import { WhyChooseUs } from "@/components/why-choose-us"
import { WhyGodavariDelights } from "@/components/why-godavari-delights"
import { HeroSection } from "@/components/hero-section"
import { FAQ } from "@/components/faq"
import { Star } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { getProductImageUrl } from "@/lib/product-image"

async function getHomepageProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { inStock: true },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        originalPrice: true,
        image: true,
        category: true,
        inStock: true,
        featured: true,
        weight: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    })

    return products.map((product) => ({
      ...product,
      description: product.description || "",
      originalPrice: product.originalPrice ?? undefined,
      image: product.image ? getProductImageUrl(product.id, product.image) : "",
      weight: product.weight ?? undefined,
      images: [],
      averageRating: 0,
      reviewCount: 0,
    }))
  } catch (error) {
    console.error("Error fetching homepage products:", error)
    return []
  }
}

async function getHomepageImages() {
  try {
    const settings = await prisma.siteSettings.findFirst({
      select: {
        heroSectionImageUrl: true,
        whyGodavariImageUrl: true,
      },
    })
    return {
      heroImageUrl:
        settings?.heroSectionImageUrl || "/traditional-indian-sweet-putharekulu.jpg",
      whyGodavariImageUrl:
        settings?.whyGodavariImageUrl || "/homepage-about-section.jpg",
    }
  } catch (error) {
    console.error("Error fetching homepage images:", error)
    return {
      heroImageUrl: "/traditional-indian-sweet-putharekulu.jpg",
      whyGodavariImageUrl: "/homepage-about-section.jpg",
    }
  }
}

export default async function HomePage() {
  const [products, homepageImages] = await Promise.all([
    getHomepageProducts(),
    getHomepageImages(),
  ])

  return (
    <div className="relative min-h-screen max-w-full overflow-x-clip bg-background">
      <ScrollProgress />
      <FloatingElements />
      <Header />
      <PromotionBanner />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-50 to-yellow-50 py-12 sm:py-20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-amber-200 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-yellow-200 rounded-full opacity-25 animate-bounce"></div>
          <div className="absolute bottom-32 right-1/3 w-28 h-28 bg-orange-300 rounded-full opacity-20 animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid min-w-0 grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <FadeInSection direction="left">
              <div className="min-w-0 space-y-6">
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 animate-pulse">
                  Authentic Since 2000
                </Badge>
                <h1 className="text-3xl font-bold text-balance sm:text-4xl lg:text-6xl">
                  Traditional
                  <span className="text-orange-600 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent animate-pulse">
                    {" "}
                    Putharekulu{" "}
                  </span>
                  from Atreyapuram
                </h1>
                <p className="text-lg text-muted-foreground text-pretty">
                  Experience the authentic taste of handmade Putharekulu, crafted with traditional recipes passed down
                  through generations. Made with pure ghee, jaggery, and love.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/products">
                    <Button
                      size="lg"
                      className="bg-orange-600 hover:bg-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Shop Now
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button
                      variant="outline"
                      size="lg"
                      className="hover:bg-orange-50 transform hover:scale-105 transition-all duration-200 bg-transparent"
                    >
                      Our Story
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4">
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400 animate-pulse" />
                    ))}
                    <span className="ml-2 font-semibold">4.8/5</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Trusted by <AnimatedCounter end={10000} suffix="+" /> customers
                  </div>
                </div>
              </div>
            </FadeInSection>

            <HeroSection imageUrl={homepageImages.heroImageUrl} />
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="mb-12 space-y-4 text-center">
              <h2 className="text-3xl font-bold">All Products</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Explore our complete collection of authentic Putharekulu varieties
              </p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <FadeInSection key={product.id} delay={index * 100} className="min-w-0">
                <div className="transform transition-transform duration-300 hover:scale-105">
                  <ProductCard product={product} />
                </div>
              </FadeInSection>
            ))}
          </div>
          <FadeInSection delay={400}>
            <div className="mt-8 text-center">
              <Link href="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="transition-all duration-200 hover:scale-105 hover:bg-orange-50"
                >
                  View All Products
                </Button>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Why Godavari Delights Section */}
      <WhyGodavariDelights imageUrl={homepageImages.whyGodavariImageUrl} />

      {/* Newsletter Section */}
      <FadeInSection>
        <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/traditional-pattern.jpg')] opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <FadeInSection direction="left">
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-amber-900">Stay Connected</h2>
                    <p className="text-lg text-amber-700">
                      Join our newsletter to get the latest updates on new products, special offers, festival
                      collections, and traditional recipes delivered straight to your inbox.
                    </p>
                    <div className="space-y-4">
                      {[
                        "Exclusive offers and discounts",
                        "New product launches",
                        "Festival special collections",
                        "Traditional recipes and tips",
                      ].map((item, index) => (
                        <FadeInSection key={index} delay={index * 100}>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse"></div>
                            <span className="text-amber-800">{item}</span>
                          </div>
                        </FadeInSection>
                      ))}
                    </div>
                  </div>
                </FadeInSection>
                <FadeInSection direction="right" delay={200}>
                  <div className="flex justify-center">
                    <div className="transform hover:scale-105 transition-transform duration-300">
                      <NewsletterSignup />
                    </div>
                  </div>
                </FadeInSection>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Testimonials */}
      <FadeInSection>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold">What Our Customers Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Read what our happy customers have to say about our products
              </p>
            </div>
            <TestimonialsCarousel
              testimonials={[
                {
                  name: "Priya Sharma",
                  location: "Hyderabad",
                  review: "The best Putharekulu I've ever tasted! Reminds me of my grandmother's homemade sweets.",
                  rating: 5,
                },
                {
                  name: "Rajesh Kumar",
                  location: "Bangalore",
                  review: "Excellent quality and packaging. Perfect for gifting during festivals.",
                  rating: 5,
                },
                {
                  name: "Meera Reddy",
                  location: "Chennai",
                  review: "Authentic taste and fresh delivery. Will definitely order again!",
                  rating: 5,
                },
                {
                  name: "Avinash Reddy",
                  location: "Nellore",
                  review: "The sweets were fresh and delicious, and the traditional flavor made them a hit with my family.",
                  rating: 5,
                },
                {
                  name: "Ramesh Babu",
                  location: "Srikakulam",
                  review: "Loved the crisp texture and careful packing. A delightful treat to share with everyone.",
                  rating: 5,
                },
                {
                  name: "Pankaj Sharma",
                  location: "Mumbai",
                  review: "Authentic taste, great quality, and arrived in excellent condition. I would happily try these again.",
                  rating: 5,
                },
              ]}
            />
          </div>
        </section>
      </FadeInSection>

      <WhyChooseUs />

      {/* FAQ Section */}
      <FAQ />

      <Footer />
      <PromotionPopup />
      <LazyChatbot />
    </div>
  )
}

// Revalidate every 60 seconds to pick up new products
export const revalidate = 60
