"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Send, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export default function BulkOrderPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    productName: "",
    quantity: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const products = [
    "Traditional Putharekulu",
    "Saffron Putharekulu",
    "Coconut Putharekulu",
    "Premium Gift Box",
    "Festival Gift Box",
    "Custom Mix Pack",
    "Other (mention in message)",
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProductChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      productName: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validation
      if (!formData.name || !formData.email || !formData.phone || !formData.productName || !formData.quantity || !formData.message) {
        toast.error("Please fill in all required fields")
        setIsSubmitting(false)
        return
      }

      const quantity = parseInt(formData.quantity)
      if (isNaN(quantity) || quantity < 10) {
        toast.error("Minimum quantity is 10 boxes")
        setIsSubmitting(false)
        return
      }

      const response = await fetch("/api/bulk-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company || null,
          productName: formData.productName,
          quantity,
          message: formData.message,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit bulk order request")
      }

      toast.success("Bulk order request submitted successfully! We'll contact you soon.")
      setSubmitted(true)
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        productName: "",
        quantity: "",
        message: "",
      })

      // Hide success message after 5 seconds and allow new submission
      setTimeout(() => {
        setSubmitted(false)
      }, 5000)
    } catch (error: any) {
      console.error("Bulk order submission error:", error)
      toast.error(error.message || "Failed to submit bulk order request")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-50 to-yellow-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Bulk Orders</Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-balance">
              Bulk Order
              <span className="text-orange-600"> Inquiry</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
              Looking for bulk quantities of our authentic Putharekulu? We offer competitive pricing for bulk orders. Submit your inquiry and our team will get back to you with a customized quote.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">Minimum Order</h3>
                <p className="text-sm text-muted-foreground">Minimum 10 boxes for bulk orders</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">Special Pricing</h3>
                <p className="text-sm text-muted-foreground">Competitive rates for bulk purchases</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">Custom Options</h3>
                <p className="text-sm text-muted-foreground">Custom packaging & delivery options available</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Submit Your Bulk Order Inquiry</CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-semibold">Thank You!</h3>
                    <p className="text-muted-foreground">
                      Your bulk order inquiry has been submitted successfully. Our team will review your request and contact you within 24 hours with pricing details and availability.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="text-sm font-medium mb-2 block">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="text-sm font-medium mb-2 block">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="text-sm font-medium mb-2 block">
                          Phone Number *
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 9885317726"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="company" className="text-sm font-medium mb-2 block">
                          Company Name (Optional)
                        </label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Your company name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Select Product *
                        </label>
                        <Select value={formData.productName} onValueChange={handleProductChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product} value={product}>
                                {product}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label htmlFor="quantity" className="text-sm font-medium mb-2 block">
                          Quantity (boxes) *
                        </label>
                        <Input
                          id="quantity"
                          name="quantity"
                          type="number"
                          value={formData.quantity}
                          onChange={handleChange}
                          placeholder="Minimum 10 boxes"
                          min="10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="text-sm font-medium mb-2 block">
                        Message / Special Requirements *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your bulk order requirements, delivery timeline, custom packaging needs, etc."
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Bulk Order Inquiry
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-lg">Why Choose Us for Bulk Orders?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">✓ Competitive Pricing</h4>
                  <p className="text-sm text-muted-foreground">
                    We offer attractive bulk discounts based on order quantity. The more you order, the better the pricing.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">✓ Authentic Quality</h4>
                  <p className="text-sm text-muted-foreground">
                    Every box is made with the same care and quality ingredients as our retail products. No compromises!
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">✓ Custom Packaging</h4>
                  <p className="text-sm text-muted-foreground">
                    We can customize packaging with your branding for corporate gifts and promotional purposes.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">✓ Fast Delivery</h4>
                  <p className="text-sm text-muted-foreground">
                    Quick processing and reliable shipping across India with tracking available.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
