import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { PromotionBanner } from "@/components/promotion-banner"
import { PromotionPopup } from "@/components/promotion-popup"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { Chatbot } from "@/components/chatbot"
import { FadeInSection } from "@/components/fade-in-section"
import { AnimatedCounter } from "@/components/animated-counter"
import { FloatingElements } from "@/components/floating-elements"
import { ScrollProgress } from "@/components/scroll-progress"
import { WhyChooseUs } from "@/components/why-choose-us"
import { WhyGodavariDelights } from "@/components/why-godavari-delights"
import { HeroSection } from "@/components/hero-section"
import { FAQ } from "@/components/faq"
import { Star, Truck, Shield, Award, Users } from "lucide-react"
import { prisma } from "@/lib/prisma"

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        featured: true,
        inStock: true
      },
      include: {
        images: true,
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 4
    })

    return products.map((product: any) => {
      const ratings = product.reviews.map((r: any) => r.rating)
      const averageRating = ratings.length > 0
        ? Math.round((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length) * 10) / 10
        : 0

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        inStock: product.inStock,
        featured: product.featured,
        images: product.images,
        averageRating,
        reviewCount: product.reviews.length,
        createdAt: product.createdAt
      }
    })
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        inStock: true
      },
      include: {
        images: true,
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 8
    })

    return products.map((product: any) => {
      const ratings = product.reviews.map((r: any) => r.rating)
      const averageRating = ratings.length > 0
        ? Math.round((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length) * 10) / 10
        : 0

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        inStock: product.inStock,
        featured: product.featured,
        images: product.images,
        averageRating,
        reviewCount: product.reviews.length,
        createdAt: product.createdAt
      }
    })
  } catch (error) {
    console.error('Error fetching all products:', error)
    return []
  }
}

async function getActiveBanners() {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      take: 3
    })
    return banners
  } catch (error) {
    console.error('Error fetching banners:', error)
    return []
  }
}

const categoryImageMap: Record<string, string> = {
  traditional: '/traditional-indian-sweet-putharekulu.jpg',
  premium: '/premium-gift.png',
  festival: '/festival-indian-sweets-diwali.jpg',
  gifts: '/image_0901.jpeg',
}

const categoryDescriptionMap: Record<string, string> = {
  traditional: 'Classic handmade Putharekulu with authentic recipes',
  premium: 'Exclusive premium Putharekulu with dry fruits & saffron',
  festival: 'Special festival collections for every celebration',
  gifts: 'Beautifully packed gift hampers for every occasion',
}

const STATIC_CATEGORIES = [
  {
    id: 'traditional',
    name: 'Traditional',
    description: 'Classic handmade Putharekulu with authentic recipes',
    image: '/traditional-indian-sweet-putharekulu.jpg',
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Exclusive premium Putharekulu with dry fruits & saffron',
    image: '/premium-gift.png',
  },
  {
    id: 'festival',
    name: 'Festival',
    description: 'Special festival collections for every celebration',
    image: '/festival-indian-sweets-diwali.jpg',
  },
  {
    id: 'gifts',
    name: 'Gift Hampers',
    description: 'Beautifully packed gift hampers for every occasion',
    image: '/image_0901.jpeg',
  },
]

async function getCategories() {
  try {
    // Get unique categories from products
    const products = await prisma.product.findMany({
      where: {
        category: { not: "" }
      },
      select: { category: true },
      distinct: ['category']
    })

    const uniqueCategories = products.map((p: any) => p.category).filter(Boolean)

    if (uniqueCategories.length === 0) return STATIC_CATEGORIES

    // Create category objects with mapped images
    return uniqueCategories.map((cat: string) => {
      const key = cat.toLowerCase().trim()
      return {
        id: cat || '',
        name: cat || '',
        description: categoryDescriptionMap[key] || `Explore our ${cat} collection`,
        image: categoryImageMap[key] || '/traditional-indian-sweet-putharekulu.jpg'
      }
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return STATIC_CATEGORIES
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()
  const allProducts = await getAllProducts()
  const banners = await getActiveBanners()
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-background relative">
      <ScrollProgress />
      <FloatingElements />
      <Header />
      <PromotionBanner />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-50 to-yellow-50 py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-amber-200 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-yellow-200 rounded-full opacity-25 animate-bounce"></div>
          <div className="absolute bottom-32 right-1/3 w-28 h-28 bg-orange-300 rounded-full opacity-20 animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeInSection direction="left">
              <div className="space-y-6">
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 animate-pulse">
                  Authentic Since 1950
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-balance">
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
                <div className="flex items-center space-x-6 pt-4">
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

            <HeroSection />
          </div>
        </div>
      </section>

      {/* What Makes Us So Good Section */}
      <WhyChooseUs />

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: Award, title: "Premium Quality", desc: "Made with finest ingredients and traditional methods" },
                { icon: Truck, title: "Free Shipping", desc: "Free delivery on orders above ₹500" },
                {
                  icon: Shield,
                  title: "Fresh & Hygienic",
                  desc: "Prepared fresh daily with highest hygiene standards",
                },
                { icon: Users, title: "Family Tradition", desc: "Three generations of sweet-making expertise" },
              ].map((feature, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <div className="text-center space-y-4 group cursor-pointer">
                    <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-all duration-300 group-hover:scale-110">
                      <feature.icon className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold group-hover:text-orange-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Categories Section */}
      <FadeInSection>
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 animate-pulse"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold">Our Categories</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our wide range of traditional and premium Putharekulu varieties
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {STATIC_CATEGORIES.map((category: any, index: number) => (
                <FadeInSection key={category.id} delay={index * 100}>
                  <Link href={`/products?category=${category.id}`}>
                    <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:rotate-1">
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
                        <div className="absolute bottom-4 left-4 w-1 h-1 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse"></div>
                      </div>
                      <CardContent className="p-4 text-center">
                        <h3 className="font-semibold mb-2 group-hover:text-orange-600 transition-colors duration-300">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* All Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold">All Products</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our complete collection of authentic Putharekulu varieties
              </p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allProducts.map((product: any, index: number) => (
              <FadeInSection key={product.id} delay={index * 100}>
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <ProductCard product={product} />
                </div>
              </FadeInSection>
            ))}
          </div>
          <FadeInSection delay={400}>
            <div className="text-center mt-8">
              <Link href="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="hover:bg-orange-50 transform hover:scale-105 transition-all duration-200"
                >
                  View All Products
                </Button>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our most popular and loved Putharekulu varieties
              </p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: any, index: number) => (
              <FadeInSection key={product.id} delay={index * 100}>
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <ProductCard product={product} />
                </div>
              </FadeInSection>
            ))}
          </div>
          <FadeInSection delay={400}>
            <div className="text-center mt-8">
              <Link href="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="hover:bg-orange-50 transform hover:scale-105 transition-all duration-200 bg-transparent"
                >
                  View All Products
                </Button>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Why Godavari Delights Section */}
      <WhyGodavariDelights />

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
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
              ].map((testimonial, index) => (
                <FadeInSection key={index} delay={index * 150}>
                  <Card className="p-6 transform hover:scale-105 hover:shadow-lg transition-all duration-300">
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400 animate-pulse" />
                        ))}
                      </div>
                      <p className="text-muted-foreground italic">"{testimonial.review}"</p>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </CardContent>
                  </Card>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* FAQ Section */}
      <FAQ />

      <Footer />
      <PromotionPopup />
      <Chatbot />
    </div>
  )
}

// Revalidate every 60 seconds to pick up new products
export const revalidate = 60
