"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-50 to-yellow-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Get in Touch</Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-balance">
              Contact
              <span className="text-orange-600"> Athrayapuram</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
              Have questions about our products? Want to place a bulk order? We'd love to hear from you and help you
              with all your Putharekulu needs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Visit Us</h3>
                  <p className="text-sm text-muted-foreground">
                    Athrayapuram Village
                    <br />
                    West Godavari District
                    <br />
                    Andhra Pradesh - 534134
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <p className="text-sm text-muted-foreground">
                    +91 9876543210
                    <br />
                    +91 8765432109
                    <br />
                    Mon-Sat: 9AM-7PM
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <p className="text-sm text-muted-foreground">
                    info@athrayapuram.com
                    <br />
                    orders@athrayapuram.com
                    <br />
                    support@athrayapuram.com
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Business Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    Monday - Saturday
                    <br />
                    9:00 AM - 7:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map and Additional Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Find Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Interactive Map Coming Soon</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <strong>Address:</strong> Athrayapuram Village, West Godavari District, Andhra Pradesh - 534134
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Landmark:</strong> Near Athrayapuram Bus Stand, opposite to Sri Rama Temple
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Bulk Orders</h4>
                    <p className="text-sm text-muted-foreground">
                      For bulk orders (50+ boxes), please call us directly or send an email with your requirements. We
                      offer special pricing for bulk purchases.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Custom Packaging</h4>
                    <p className="text-sm text-muted-foreground">
                      We provide custom packaging solutions for corporate gifts and special occasions. Contact us for
                      personalized options.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Delivery Areas</h4>
                    <p className="text-sm text-muted-foreground">
                      We deliver across India. Same-day delivery available in Vijayawada, Rajahmundry, and surrounding
                      areas.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
