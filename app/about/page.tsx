import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Users, Heart, Leaf } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-50 to-yellow-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Our Story</Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-balance">
              Three Generations of
              <span className="text-orange-600"> Sweet Tradition</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
              From a small village kitchen in Atreyapuram to serving customers across India, our journey has been
              sweetened by tradition, quality, and the love of our customers.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Heritage</h2>
              <p className="text-muted-foreground">
                Established in 1950 by our founder Shri Rama Krishna, Atreyapuram Putharekulu began as a small family
                business in the heart of West Godavari district. What started as a passion for creating the perfect
                Putharekulu has now become a legacy that spans three generations.
              </p>
              <p className="text-muted-foreground">
                Our traditional recipes have been carefully preserved and passed down through generations, ensuring that
                every bite of our Putharekulu carries the authentic taste that our grandparents cherished. We use only
                the finest ingredients - pure ghee, organic jaggery, and premium rice flour - sourced directly from
                local farmers.
              </p>
              <p className="text-muted-foreground">
                Today, under the guidance of the third generation, we continue to honor our heritage while embracing
                modern hygiene standards and packaging techniques to bring the authentic taste of Atreyapuram to your
                doorstep.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/traditional-putharekulu-sweet.jpg"
                alt="Traditional Putharekulu Making"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide us in creating the finest Putharekulu
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold">Quality First</h3>
                <p className="text-sm text-muted-foreground">
                  We never compromise on quality. Every product is made with the finest ingredients and traditional
                  methods.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold">Made with Love</h3>
                <p className="text-sm text-muted-foreground">
                  Each Putharekulu is handcrafted with care and love, just like our grandmothers used to make.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold">Natural Ingredients</h3>
                <p className="text-sm text-muted-foreground">
                  We use only natural, organic ingredients sourced directly from local farmers and trusted suppliers.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold">Customer Satisfaction</h3>
                <p className="text-sm text-muted-foreground">
                  Your happiness is our success. We strive to exceed expectations with every order.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Our Process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From kitchen to your table - the journey of authentic Putharekulu
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-2xl font-bold text-orange-600">
                1
              </div>
              <h3 className="font-semibold text-lg">Traditional Preparation</h3>
              <p className="text-muted-foreground">
                We start with premium rice flour, pure ghee, and organic jaggery, following recipes passed down through
                generations.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-2xl font-bold text-orange-600">
                2
              </div>
              <h3 className="font-semibold text-lg">Handcrafted Excellence</h3>
              <p className="text-muted-foreground">
                Each Putharekulu is carefully handcrafted by our skilled artisans, ensuring perfect texture and
                authentic taste.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-2xl font-bold text-orange-600">
                3
              </div>
              <h3 className="font-semibold text-lg">Fresh Packaging</h3>
              <p className="text-muted-foreground">
                Freshly made products are carefully packaged to preserve taste and quality during delivery to your
                doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Meet Our Family</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind every delicious Putharekulu
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-orange-600">RK</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Rama Krishna</h3>
                  <p className="text-sm text-muted-foreground">Founder (1950)</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Started the legacy with a passion for creating the perfect Putharekulu using traditional family
                  recipes.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-orange-600">VK</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Venkata Krishna</h3>
                  <p className="text-sm text-muted-foreground">Second Generation</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Expanded the business while maintaining traditional quality and introducing modern hygiene standards.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-orange-600">SK</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Sai Krishna</h3>
                  <p className="text-sm text-muted-foreground">Current Owner</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Leading the third generation with innovation while preserving the authentic taste and family
                  traditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
