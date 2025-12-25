"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/contexts/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "sonner"
import { MapPin, Plus, Check, Tag, Truck, CreditCard, Package } from "lucide-react"
import Image from "next/image"

interface Address {
  id: string
  name: string
  phone: string
  street: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user, session } = useAuth()
  const { cart, getCartTotal, getCartCount, clearCart, isLoading: cartLoading } = useCart()
  
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod")
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [discount, setDiscount] = useState(0)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: ""
  })
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [isSavingAddress, setIsSavingAddress] = useState(false)

  const subtotal = getCartTotal()
  const deliveryCharge = subtotal >= 500 ? 0 : 50
  const total = subtotal - discount + deliveryCharge

  useEffect(() => {
    if (!user || !session) {
      router.push('/login?redirect=/checkout')
      return
    }
    loadAddresses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, session?.user?.id])

  const loadAddresses = async () => {
    try {
      setIsLoadingAddresses(true)
      const response = await fetch('/api/addresses')
      
      if (!response.ok) {
        throw new Error('Failed to load addresses')
      }

      const data = await response.json()
      // API wraps response in { data: [...] }
      const addressesData = data.data || data || []
      setAddresses(addressesData)
      
      // Select default address if available
      const defaultAddr = addressesData?.find((addr: Address) => addr.isDefault)
      if (defaultAddr) {
        setSelectedAddress(defaultAddr.id)
      } else if (addressesData && addressesData.length > 0) {
        setSelectedAddress(addressesData[0].id)
      }
    } catch (error) {
      console.error('Error loading addresses:', error)
      toast.error('Failed to load addresses')
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  const handleAddAddress = async () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.street || 
        !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast.error('Please fill all address fields')
      return
    }

    // Validate phone number
    if (!/^\d{10}$/.test(newAddress.phone.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }

    // Validate pincode
    if (!/^\d{6}$/.test(newAddress.pincode)) {
      toast.error('Please enter a valid 6-digit pincode')
      return
    }

    try {
      setIsSavingAddress(true)
      
      // If editing, use PUT; if new, use POST
      const method = editingAddressId ? 'PUT' : 'POST'
      const url = editingAddressId ? `/api/addresses/${editingAddressId}` : '/api/addresses'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newAddress,
          isDefault: editingAddressId ? undefined : addresses.length === 0 // Set as default only for new address if no addresses exist
        })
      })

      if (!response.ok) throw new Error('Failed to save address')

      const data = await response.json()
      toast.success(editingAddressId ? 'Address updated successfully' : 'Address added successfully')
      
      await loadAddresses()
      // Handle both wrapped and unwrapped responses
      const addressId = editingAddressId || data.data?.id || data.id
      if (addressId) {
        setSelectedAddress(addressId)
      }
      setShowAddressForm(false)
      setEditingAddressId(null)
      setNewAddress({
        name: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: ""
      })
    } catch (error) {
      console.error('Error saving address:', error)
      toast.error(editingAddressId ? 'Failed to update address' : 'Failed to add address')
    } finally {
      setIsSavingAddress(false)
    }
  }

  const handleEditAddress = (address: Address) => {
    setNewAddress({
      name: address.name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode
    })
    setEditingAddressId(address.id)
    setShowAddressForm(true)
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return

    try {
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete address')

      toast.success('Address deleted successfully')
      await loadAddresses()
      setSelectedAddress("")
    } catch (error) {
      console.error('Error deleting address:', error)
      toast.error('Failed to delete address')
    }
  }

  const handleCancelEditAddress = () => {
    setShowAddressForm(false)
    setEditingAddressId(null)
    setNewAddress({
      name: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: ""
    })
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code')
      return
    }

    try {
      const response = await fetch(`/api/coupons?code=${couponCode.toUpperCase()}`)
      
      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || 'Invalid coupon code')
        return
      }

      const coupon = await response.json()

      // Validate minimum order amount
      if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
        toast.error(`Minimum order amount of ₹${coupon.minOrderValue} required`)
        return
      }

      // Calculate discount
      let discountAmount = 0
      if (coupon.discountType === 'percentage') {
        discountAmount = (subtotal * coupon.discountValue) / 100
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount
        }
      } else {
        discountAmount = coupon.discountValue
      }

      setAppliedCoupon(coupon)
      setDiscount(discountAmount)
      toast.success(`Coupon applied! You saved ₹${discountAmount}`)
    } catch (error) {
      console.error('Error applying coupon:', error)
      toast.error('Failed to apply coupon')
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setDiscount(0)
    setCouponCode("")
    toast.success('Coupon removed')
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address')
      return
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    try {
      setIsPlacingOrder(true)

      const selectedAddr = addresses.find(addr => addr.id === selectedAddress)
      if (!selectedAddr) {
        toast.error('Invalid address selected')
        return
      }

      const orderData = {
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        addressId: selectedAddress,
        paymentMethod,
        couponCode: appliedCoupon?.code || null,
        notes: ""
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to place order')
      }

      const result = await response.json()

      if (paymentMethod === 'online') {
        // Redirect to payment gateway (Razorpay)
        const orderId = result.data?.order?.id
        if (!orderId) {
          throw new Error('Order ID not found in response')
        }
        toast.success('Redirecting to payment...')
        router.push(`/payment?orderId=${orderId}`)
      } else {
        // COD order placed successfully
        const orderId = result.data?.order?.id
        if (!orderId) {
          throw new Error('Order ID not found in response')
        }
        toast.success('Order placed successfully!')
        await clearCart()
        router.push(`/orders/${orderId}`)
      }
    } catch (error: any) {
      console.error('Error placing order:', error)
      toast.error(error.message || 'Failed to place order')
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (cartLoading || isLoadingAddresses) {
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

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-6">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Add some delicious products to your cart to continue
              </p>
              <Button onClick={() => router.push('/products')}>
                Continue Shopping
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.length === 0 && !showAddressForm && (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-4">No saved addresses yet</p>
                    <p className="text-sm text-muted-foreground mb-6">Add your delivery address to continue checkout</p>
                    <Button onClick={() => setShowAddressForm(true)} size="lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Address
                    </Button>
                  </div>
                )}

                {addresses.length > 0 && !showAddressForm && (
                  <>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm">Select Delivery Address</h3>
                      <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                        {addresses.map((address) => (
                          <div key={address.id} className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                            <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                            <label htmlFor={address.id} className="flex-1 cursor-pointer">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{address.name}</span>
                                {address.isDefault && (
                                  <Badge variant="default" className="text-xs">Default</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{address.phone}</p>
                              <p className="text-sm mt-1 text-foreground">
                                {address.street}, {address.city}, {address.state} - {address.pincode}
                              </p>
                            </label>
                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditAddress(address)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAddress(address.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowAddressForm(true)
                        setEditingAddressId(null)
                      }}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Address
                    </Button>
                  </>
                )}

                {showAddressForm && (
                  <div className="space-y-4 border rounded-lg p-4 bg-accent/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
                      {addresses.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelEditAddress}
                          className="text-muted-foreground"
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                          placeholder="John Doe"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          placeholder="9876543210"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="street">Street Address *</Label>
                      <Input
                        id="street"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        placeholder="House no., Street, Area"
                        className="mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          placeholder="City"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          placeholder="State"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                          placeholder="123456"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={handleAddAddress}
                        disabled={isSavingAddress}
                        className="flex-1"
                      >
                        {isSavingAddress ? 'Saving...' : (editingAddressId ? 'Update Address' : 'Save Address')}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleCancelEditAddress}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(value: "cod" | "online") => setPaymentMethod(value)}>
                  <div className="flex items-center space-x-3 border rounded-lg p-4">
                    <RadioGroupItem value="cod" id="cod" />
                    <label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Cash on Delivery</div>
                      <p className="text-sm text-muted-foreground">Pay when you receive</p>
                    </label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4">
                    <RadioGroupItem value="online" id="online" />
                    <label htmlFor="online" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Online Payment</div>
                      <p className="text-sm text-muted-foreground">Pay via Razorpay (Cards, UPI, Wallets)</p>
                    </label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Cart Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary ({getCartCount()} items)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Coupon Code */}
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4" />
                    Apply Coupon
                  </Label>
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <Input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="uppercase"
                      />
                      <Button onClick={handleApplyCoupon} variant="outline">
                        Apply
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800">{appliedCoupon.code}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleRemoveCoupon}
                        className="text-green-800"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      Delivery Charge
                    </span>
                    <span>
                      {deliveryCharge === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${deliveryCharge}`
                      )}
                    </span>
                  </div>
                  {subtotal < 500 && (
                    <p className="text-xs text-muted-foreground">
                      Add ₹{(500 - subtotal).toFixed(2)} more for FREE delivery
                    </p>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder || !selectedAddress}
                >
                  {isPlacingOrder ? (
                    <>
                      <div className="mr-2"><LoadingSpinner /></div>
                      Placing Order...
                    </>
                  ) : (
                    `Place Order (₹${total.toFixed(2)})`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
