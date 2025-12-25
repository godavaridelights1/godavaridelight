"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "sonner"
import { CreditCard, CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import Script from "next/script"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  
  const orderId = searchParams.get('orderId')
  
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [isTestMode, setIsTestMode] = useState<boolean | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/payment')
      return
    }

    if (!orderId) {
      toast.error('Invalid payment request')
      router.push('/')
      return
    }

    loadOrderDetails()
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
      toast.error('Failed to load order details')
      router.push('/orders')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      toast.error('Payment gateway is loading. Please wait...')
      return
    }

    try {
      setIsProcessing(true)
      setPaymentError(null)

      // Create Razorpay order
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId })
      })

      if (!response.ok) {
        const error = await response.json()
        
        // Check if it's a configuration error
        if (error.error && error.error.includes('not configured')) {
          setPaymentError('Payment gateway is not configured. Please contact support or use Cash on Delivery.')
          toast.error('Payment system not configured')
          return
        }
        
        throw new Error(error.error || 'Failed to initialize payment')
      }

      const paymentData = await response.json()
      
      // Extract data from wrapped response
      const paymentInfo = paymentData.data
      
      if (!paymentInfo || !paymentInfo.razorpayKeyId) {
        throw new Error('Payment gateway key not found in response')
      }

      // Set test mode based on key prefix
      if (paymentInfo.razorpayKeyId) {
        setIsTestMode(paymentInfo.razorpayKeyId.startsWith('rzp_test_'))
      }

      // Razorpay options
      const options = {
        key: paymentInfo.razorpayKeyId,
        amount: paymentInfo.amount,
        currency: paymentInfo.currency,
        name: 'Restaurant Order',
        description: `Order #${order.orderNumber}`,
        order_id: paymentInfo.razorpayOrderId,
        handler: async function (response: any) {
          // Payment successful, verify it
          try {
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId
              })
            })

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed')
            }

            toast.success('Payment successful!')
            router.push(`/order-confirmation?orderId=${orderId}`)
          } catch (error: any) {
            console.error('Payment verification error:', error)
            setPaymentError('Payment verification failed. Please contact support.')
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: '#3b82f6'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false)
            toast.error('Payment cancelled')
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      
      razorpay.on('payment.failed', function (response: any) {
        setPaymentError(response.error.description)
        toast.error('Payment failed')
        setIsProcessing(false)
      })

      razorpay.open()
    } catch (error: any) {
      console.error('Payment error:', error)
      setPaymentError(error.message || 'Failed to process payment')
      toast.error(error.message || 'Failed to process payment')
      setIsProcessing(false)
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
              <XCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
              <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The order you're trying to pay for could not be found.
              </p>
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

  if (order.paymentStatus === 'paid' || order.paymentStatus === 'completed') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold mb-2">Already Paid</h2>
              <p className="text-muted-foreground mb-6">
                This order has already been paid for.
              </p>
              <Button onClick={() => router.push(`/orders/${orderId}`)}>
                View Order Details
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() => {
          toast.error('Failed to load payment gateway')
          setPaymentError('Failed to load payment gateway')
        }}
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => router.push(`/orders/${orderId}`)}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Order
            </Button>

            {/* Payment Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Complete Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Summary */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Order Details</h3>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Number</span>
                      <span className="font-medium">{order.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Total</span>
                      <span className="text-2xl font-bold">₹{order.total?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method</span>
                      <span className="font-medium">Online Payment</span>
                    </div>
                  </div>
                </div>

                {/* Payment Error */}
                {paymentError && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-destructive">Payment Error</h4>
                        <p className="text-sm text-muted-foreground mt-1">{paymentError}</p>
                        {paymentError.includes('not configured') && (
                          <div className="mt-3 space-y-2">
                            <p className="text-sm font-medium">Alternative Payment Options:</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push('/checkout')}
                              className="w-full"
                            >
                              Return to Checkout - Use Cash on Delivery
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Test Mode Warning */}
                {isTestMode === true && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                      🧪 Test Mode Active
                    </h4>
                    <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                      <li>• This is a test payment - No real money will be charged</li>
                      <li>• Use test card: 4111 1111 1111 1111</li>
                      <li>• Any CVV and future expiry date will work</li>
                    </ul>
                  </div>
                )}

                {/* Live Mode Info */}
                {isTestMode === false && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                      ✓ Live Payment Mode
                    </h4>
                    <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                      <li>• Real payment will be processed</li>
                      <li>• Use your actual card/UPI/wallet</li>
                      <li>• Secure payment powered by Razorpay</li>
                    </ul>
                  </div>
                )}

                {/* Payment Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Secure Payment
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Pay via Credit/Debit Card, UPI, or Wallet</li>
                    <li>• 128-bit SSL encrypted payment</li>
                    <li>• Powered by Razorpay</li>
                  </ul>
                </div>

                {/* Pay Button */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePayment}
                  disabled={isProcessing || !razorpayLoaded}
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner />
                      <span className="ml-2">Processing...</span>
                    </>
                  ) : !razorpayLoaded ? (
                    'Loading Payment Gateway...'
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay ₹{order.total?.toFixed(2)}
                    </>
                  )}
                </Button>

                {/* Alternative Actions */}
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Having trouble with payment?
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/orders/${orderId}`)}
                  >
                    View Order Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Need help? Contact our support team</p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
