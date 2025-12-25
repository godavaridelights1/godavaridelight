'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useAuth } from '@/hooks/use-auth'
import { ArrowLeft, Package, MapPin, CreditCard, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface OrderDetails {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod: string
  subtotal: number
  discount: number
  deliveryCharge: number
  total: number
  couponCode: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  items: {
    id: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      image: string
      description: string
    }
  }[]
  address: {
    id: string
    name: string
    phone: string
    street: string
    city: string
    state: string
    pincode: string
  }
}

export default function OrderDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  const { user, isLoading: authLoading } = useAuth()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/orders')
      } else if (orderId) {
        fetchOrderDetails()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, authLoading, orderId])

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/orders/${orderId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch order details')
      }

      const data = await response.json()
      setOrder(data.data)
    } catch (error: any) {
      console.error('Error fetching order:', error)
      toast.error('Failed to load order details')
      router.push('/orders')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-blue-500',
      preparing: 'bg-purple-500',
      shipped: 'bg-indigo-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500',
      paid: 'bg-green-500',
      failed: 'bg-red-500',
      refunded: 'bg-orange-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  if (authLoading || isLoading) {
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
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Order not found</h2>
              <Button onClick={() => router.push('/orders')}>
                Back to Orders
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
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push('/orders')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-muted-foreground">Order #{order.orderNumber || order.id}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Order Items */}
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Order Items</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(order.status || 'pending')}>
                      {order.status || 'pending'}
                    </Badge>
                    <Badge className={getPaymentStatusColor(order.paymentStatus || 'pending')}>
                      {order.paymentStatus || 'pending'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.filter(item => item && item.product).map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.product?.image || '/placeholder.jpg'}
                        alt={item.product?.name || 'Product'}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.product?.name || 'Unknown Product'}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.product?.description || 'No description available'}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm">Quantity: {item.quantity}</span>
                          <span className="font-semibold">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-semibold">{order.address?.name || 'N/A'}</p>
                  <p className="text-sm">{order.address?.phone || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.address?.street || 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.address?.city || 'N/A'}, {order.address?.state || 'N/A'} - {order.address?.pincode || 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{(order.subtotal || 0).toFixed(2)}</span>
                  </div>
                  {(order.discount || 0) > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                      <span>-₹{(order.discount || 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Delivery Charge</span>
                    <span>
                      {(order.deliveryCharge || 0) === 0 ? 'FREE' : `₹${(order.deliveryCharge || 0).toFixed(2)}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{(order.total || 0).toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-medium">Payment Method:</span>
                    <span className="text-muted-foreground capitalize">
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'online' ? 'Online Payment' : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Ordered on:</span>
                    <span className="text-muted-foreground">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'}
                    </span>
                  </div>
                </div>

                {order.notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-1">Notes:</p>
                      <p className="text-sm text-muted-foreground">{order.notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
