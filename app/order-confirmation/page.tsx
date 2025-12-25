"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { CheckCircle, Package, MapPin, CreditCard, Calendar, ArrowRight, Home } from "lucide-react"
import { format } from "date-fns"
import confetti from "canvas-confetti"

export default function OrderConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  
  const orderId = searchParams.get('orderId')
  
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/order-confirmation')
      return
    }

    if (!orderId) {
      router.push('/')
      return
    }

    loadOrderDetails()
    
    // Trigger confetti celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, orderId])

  const loadOrderDetails = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/orders/${orderId}`)
      
      if (!response.ok) {
        throw new Error('Order not found')
      }

      const result = await response.json()
      setOrder(result.data)
    } catch (error: any) {
      console.error('Error loading order:', error)
      router.push('/orders')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
              <Button onClick={() => router.push('/orders')}>
                View Orders
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Success Header */}
          <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-3xl font-bold text-green-900 dark:text-green-100 mb-2">
                Order Confirmed!
              </h1>
              <p className="text-green-700 dark:text-green-300 mb-4">
                Thank you for your order. We've received your payment successfully.
              </p>
              <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg">
                <span className="text-sm text-muted-foreground">Order Number:</span>
                <span className="font-mono font-bold text-lg">{order.orderNumber}</span>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardContent className="pt-6 space-y-6">
              {/* Order Status */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Order Status</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(order.createdAt), "PPP 'at' p")}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  {order.paymentMethod === 'cod' ? 'Confirmed' : 'Paid'}
                </Badge>
              </div>

              {/* Payment Method */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Payment Method</h4>
                  <p className="text-sm text-muted-foreground">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (Razorpay)'}
                  </p>
                  {order.paymentMethod === 'online' && order.razorpayPaymentId && (
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      Payment ID: {order.razorpayPaymentId}
                    </p>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              {order.address && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Delivery Address</h4>
                    <p className="text-sm text-muted-foreground">
                      {order.address.street}, {order.address.city}
                      <br />
                      {order.address.state} - {order.address.postalCode}
                      {order.address.phone && (
                        <>
                          <br />
                          Phone: {order.address.phone}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        {item.product?.image && (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h5 className="font-medium">{item.product?.name || 'Product'}</h5>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} × ₹{item.price?.toFixed(2)}
                          </p>
                        </div>
                        <div className="font-semibold">
                          ₹{(item.quantity * item.price)?.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{order.subtotal?.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.discount?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Charge</span>
                  <span>₹{order.deliveryCharge?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total Amount</span>
                  <span>₹{order.total?.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2">What happens next?</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• You'll receive an order confirmation email shortly</li>
                    <li>• We'll start preparing your order</li>
                    <li>• Track your order status in real-time</li>
                    <li>• Expect delivery within 2-3 business days</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => router.push(`/orders/${orderId}`)}
              className="flex-1"
              size="lg"
            >
              View Order Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              size="lg"
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>

          {/* Support */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Need help with your order?{" "}
              <a href="/contact" className="text-primary hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
