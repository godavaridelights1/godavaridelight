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
              <span className="text-orange-600"> Atreyapuram</span>
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
                    Atreyapuram,
                    <br />
                    East Godavari District,
                    <br />
                    Andhra Pradesh - 533235
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
                    <a href="tel:+919885317726" className="hover:text-primary block">+91 9885317726</a>
                    <a href="tel:+918522914714" className="hover:text-primary block">+91 8522914714</a>
                    <a href="tel:+919885469456" className="hover:text-primary block">+91 9885469456</a>
                    <span className="mt-1 block">Mon-Sat: 9AM-7PM</span>
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
                    <a href="mailto:godavaridelights1@gmail.com" className="hover:text-primary break-all">
                      godavaridelights1@gmail.com
                    </a>
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
                  <div className="w-full rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3822.5!2d81.9167!3d16.6833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37c5b5b5b5b5b5%3A0x0!2sAtreyapuram%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                      width="100%"
                      height="280"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                      title="Godavari Delights Location - Atreyapuram"
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <strong>Address:</strong> Atreyapuram Village, East Godavari Konaseema District, Andhra Pradesh - 533235
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Landmark:</strong> Near Atreyapuram, opposite to SBI Bank
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
