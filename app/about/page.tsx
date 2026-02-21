import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Users, Heart, Leaf } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-50 to-yellow-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 md:space-y-6">
            <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Our Story</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight">
              Authentic Atreyapuram
              <span className="text-orange-600"> Putharekulu</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              From a small family effort in Atreyapuram, East Godavari, Konaseema, to delivering authentic sweetness
              across India — a tradition of taste, crafted with care since 2000.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">
                Our Story –{" "}
                <span className="text-orange-600">The Taste of Authentic Atreyapuram Putharekulu</span>
              </h2>
              <p className="text-muted-foreground">
                Established in 2000 by our founder <strong>Ganesh</strong> in Atreyapuram, East Godavari, Konaseema,
                our journey began with a simple vision — to share the authentic taste of traditional Atreyapuram
                Putharekulu with everyone.
              </p>
              <p className="text-muted-foreground">
                What started as a small family effort has grown steadily through dedication, hard work, and a passion
                for preserving tradition. From the very beginning, our focus has been on maintaining the original
                preparation methods that make Atreyapuram Putharekulu special and unique.
              </p>
              <p className="text-muted-foreground">
                We prepare every Putharekulu using carefully selected rice flour, pure ghee, and high-quality jaggery,
                ensuring rich taste and premium quality in every bite. Each sheet is handmade with patience and
                expertise, following the time-honored techniques that define the true flavor of Konaseema.
              </p>
              <p className="text-muted-foreground">
                Today, we proudly continue our founder Ganesh's vision by combining traditional recipes with modern
                hygiene standards and secure packaging. Our mission is to deliver the authentic sweetness of
                Atreyapuram Putharekulu from East Godavari, Konaseema, directly to your home.
              </p>
              <p className="text-orange-700 font-semibold italic">
                A tradition of taste, crafted with care.
              </p>
            </div>
            <div className="relative w-full">
              <Image
                src="/traditional-putharekulu-sweet.jpg"
                alt="Traditional Putharekulu Making"
                width={600}
                height={400}
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-10 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide us in creating the finest Putharekulu
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card className="text-center">
              <CardContent className="p-4 md:p-6 space-y-3">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-sm md:text-base">Quality First</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  We never compromise on quality. Every product is made with the finest ingredients and traditional
                  methods.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4 md:p-6 space-y-3">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-sm md:text-base">Made with Love</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Each Putharekulu is handcrafted with care and love, just like our grandmothers used to make.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4 md:p-6 space-y-3">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-sm md:text-base">Natural Ingredients</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  We use only natural, organic ingredients sourced directly from local farmers and trusted suppliers.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4 md:p-6 space-y-3">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-sm md:text-base">Customer Satisfaction</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Your happiness is our success. We strive to exceed expectations with every order.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">Our Process</h2>
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
      <section className="py-10 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">Meet Our Family</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind every delicious Putharekulu
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
            <Card className="text-center">
              <CardContent className="p-4 md:p-6 space-y-4">
                <div className="mx-auto w-20 h-20 md:w-24 md:h-24 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xl md:text-2xl font-bold text-orange-600">G</span>
                </div>
                <div>
                  <h3 className="font-semibold text-base md:text-lg">Ganesh</h3>
                  <p className="text-sm text-muted-foreground">Founder (2000)</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Started the legacy in Atreyapuram, East Godavari, Konaseema with a vision to share authentic
                  traditional Putharekulu with everyone.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4 md:p-6 space-y-4">
                <div className="mx-auto w-20 h-20 md:w-24 md:h-24 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xl md:text-2xl font-bold text-orange-600">AP</span>
                </div>
                <div>
                  <h3 className="font-semibold text-base md:text-lg">Artisan Team</h3>
                  <p className="text-sm text-muted-foreground">Handcraft Experts</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Skilled artisans who handcraft every Putharekulu sheet with patience and expertise, preserving
                  the time-honored techniques of Konaseema.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4 md:p-6 space-y-4">
                <div className="mx-auto w-20 h-20 md:w-24 md:h-24 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xl md:text-2xl font-bold text-orange-600">GD</span>
                </div>
                <div>
                  <h3 className="font-semibold text-base md:text-lg">Godavari Delights</h3>
                  <p className="text-sm text-muted-foreground">Our Promise</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Combining traditional recipes with modern hygiene standards and secure packaging to deliver
                  authentic sweetness from Konaseema directly to your home.
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
