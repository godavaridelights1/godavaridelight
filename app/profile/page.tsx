"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { 
  User, Mail, Phone, MapPin, Package, Lock, Trash2, Edit2, Plus, 
  CheckCircle2, Truck, Clock, MessageCircle, Send, Eye 
} from "lucide-react"
import Link from "next/link"

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

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    name: string
    image: string
  }
}

interface ChatMessage {
  id: string
  orderId: string
  message: string
  senderRole: "customer" | "admin"
  createdAt: string
  senderName: string
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  paymentMethod: string
  createdAt: string
  updatedAt: string
  orderItems: OrderItem[]
  address: Address
  statusHistory?: Array<{
    status: string
    timestamp: string
  }>
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const [addresses, setAddresses] = useState<Address[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Ref to track if addresses have been loaded
  const addressesLoadedRef = useRef(false)

  const loadAddresses = useCallback(async () => {
    try {
      const response = await fetch("/api/addresses")
      if (response.ok) {
        const data = await response.json()
        // API returns addresses directly, not wrapped in { addresses: [] }
        setAddresses(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Failed to load addresses:", error)
    }
  }, [])

  useEffect(() => {
    if (user && !addressesLoadedRef.current) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      })
      loadAddresses()
      addressesLoadedRef.current = true
    }
  }, [user]) // loadAddresses is stable (empty deps), no need to include

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true)
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        // API returns { data: orders, success: true }
        // Map 'items' to 'orderItems' for compatibility
        const ordersWithItems = (data.data || []).map((order: any) => ({
          ...order,
          orderItems: order.items || order.orderItems || []
        }))
        setOrders(ordersWithItems)
      }
    } catch (error) {
      console.error("Failed to load orders:", error)
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      })
    } finally {
      setOrdersLoading(false)
    }
  }, [toast])

  const loadChatMessages = async (orderId: string) => {
    setChatLoading(true)
    try {
      const response = await fetch(`/api/chat/messages?orderId=${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setChatMessages(data.messages || [])
      }
    } catch (error) {
      console.error("Failed to load chat messages:", error)
      toast({
        title: "Error",
        description: "Failed to load chat messages",
        variant: "destructive",
      })
    } finally {
      setChatLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!profileData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      })
      return
    }

    if (!profileData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
        setIsEditing(false)
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to update profile")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openAddAddressDialog = useCallback(() => {
    // Batch all state updates together
    setEditingAddress(null)
    setAddressForm({
      name: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    })
    setIsAddressDialogOpen(true)
  }, [])

  const openEditAddressDialog = useCallback((address: Address) => {
    setEditingAddress(address)
    setAddressForm({
      name: address.name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault
    })
    setIsAddressDialogOpen(true)
  }, [])

  const handleCloseAddressDialog = useCallback(() => {
    setIsAddressDialogOpen(false)
    setEditingAddress(null)
    setAddressForm({
      name: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    })
  }, [])

  const handleAddressDialogOpenChange = useCallback((open: boolean) => {
    if (!open) {
      handleCloseAddressDialog()
    } else {
      setIsAddressDialogOpen(true)
    }
  }, [handleCloseAddressDialog])

  const handleSaveAddress = async () => {
    if (!addressForm.name || !addressForm.phone || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.pincode) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const url = editingAddress ? `/api/addresses/${editingAddress.id}` : "/api/addresses"
      const method = editingAddress ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: editingAddress ? "Address updated successfully" : "Address added successfully",
        })
        setIsAddressDialogOpen(false)
        setEditingAddress(null)
        // Reset form
        setAddressForm({
          name: "",
          phone: "",
          street: "",
          city: "",
          state: "",
          pincode: "",
          isDefault: false,
        })
        // Reload addresses
        await loadAddresses()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save address")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save address",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Address deleted successfully",
        })
        await loadAddresses()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete address")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete address",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetDefaultAddress = async (id: string) => {
    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Default address updated",
        })
        loadAddresses()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update default address",
        variant: "destructive",
      })
    }
  }

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill all fields",
        variant: "destructive",
      })
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Password changed successfully",
        })
        setIsPasswordDialogOpen(false)
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to change password")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedOrder) return

    try {
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          message: newMessage.trim(),
        }),
      })

      if (response.ok) {
        setNewMessage("")
        loadChatMessages(selectedOrder.id)
        toast({
          title: "Message sent",
          description: "Your message has been sent to support",
        })
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    }
  }

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsOrderDetailsOpen(true)
  }

  const openOrderChat = (order: Order) => {
    setSelectedOrder(order)
    loadChatMessages(order.id)
    setIsChatOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, any> = {
      pending: { variant: "secondary", icon: Clock },
      confirmed: { variant: "default", icon: CheckCircle2 },
      shipped: { variant: "default", icon: Truck },
      delivered: { variant: "default", icon: CheckCircle2 },
      cancelled: { variant: "destructive", icon: Trash2 },
    }

    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="capitalize">
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    )
  }

  const getTotalItems = (order: Order) => {
    if (!order.orderItems || !Array.isArray(order.orderItems)) {
      return 0
    }
    return order.orderItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
  }

  const getStatusTimeline = (order: Order) => {
    const allStatuses = ["pending", "confirmed", "shipped", "delivered"]
    const currentIndex = allStatuses.indexOf(order.status)
    
    return allStatuses.map((status, index) => ({
      status,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }))
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
              <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">My Profile</h1>
                <p className="text-muted-foreground">Manage your account and preferences</p>
              </div>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="orders" onClick={() => orders.length === 0 && loadOrders()}>Orders</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details and contact information</CardDescription>
                      </div>
                      <Button
                        variant={isEditing ? "default" : "outline"}
                        onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
                        disabled={isLoading}
                      >
                        {isEditing ? (isLoading ? "Saving..." : "Save Changes") : "Edit Profile"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                            disabled={!isEditing}
                            className="pl-10"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                            disabled={!isEditing}
                            className="pl-10"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="+91 9876543210"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Account Role</Label>
                        <div className="flex items-center h-10">
                          <Badge variant={user?.role === "admin" ? "default" : "secondary"} className="text-sm">
                            {user?.role === "admin" ? "Administrator" : "Customer"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addresses">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Saved Addresses</CardTitle>
                        <CardDescription>Manage your delivery addresses</CardDescription>
                      </div>
                      <Button onClick={openAddAddressDialog}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Address
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {addresses.length === 0 ? (
                      <div className="text-center py-12">
                        <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No addresses saved</h3>
                        <p className="text-muted-foreground mb-4">Add your first delivery address to get started</p>
                        <Button onClick={openAddAddressDialog}>Add Address</Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {addresses.map((address) => (
                          <div
                            key={address.id}
                            className="p-4 border rounded-lg hover:border-primary transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {address.isDefault && (
                                    <Badge variant="default" className="text-xs">
                                      Default
                                    </Badge>
                                  )}
                                </div>
                                <p className="font-semibold">{address.name}</p>
                                <p className="text-sm text-muted-foreground">{address.phone}</p>
                                <p className="text-sm mt-2">
                                  {address.street}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {address.city}, {address.state} - {address.pincode}
                                </p>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openEditAddressDialog(address)}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteAddress(address.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                                {!address.isDefault && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSetDefaultAddress(address.id)}
                                  >
                                    Set Default
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View and track your recent orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {ordersLoading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Loading orders...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                        <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
                        <Link href="/products">
                          <Button>Browse Products</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="p-4 border rounded-lg hover:border-primary transition-colors">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-4">
                                <Package className="h-8 w-8 text-muted-foreground" />
                                <div>
                                  <p className="font-semibold">{order.orderNumber}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {getTotalItems(order)} items • {new Date(order.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right space-y-2">
                                <p className="font-semibold">₹{order.total.toFixed(2)}</p>
                                {getStatusBadge(order.status)}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openOrderDetails(order)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openOrderChat(order)}
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Contact Support
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security and privacy</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Lock className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Change Password</h3>
                            <p className="text-sm text-muted-foreground">Update your account password</p>
                          </div>
                        </div>
                        <Button variant="outline" onClick={() => setIsPasswordDialogOpen(true)}>
                          Change
                        </Button>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-destructive/10 rounded-full flex items-center justify-center">
                            <Trash2 className="h-5 w-5 text-destructive" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Logout</h3>
                            <p className="text-sm text-muted-foreground">Sign out from your account</p>
                          </div>
                        </div>
                        <Button variant="outline" onClick={logout}>
                          Logout
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <Footer />

        <Dialog 
          open={isAddressDialogOpen} 
          onOpenChange={handleAddressDialogOpenChange}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
              <DialogDescription>
                {editingAddress ? "Update your delivery address" : "Add a new delivery address"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="addr-name">Name *</Label>
                <Input
                  id="addr-name"
                  placeholder="Recipient name (e.g., Home, Office, John Doe)"
                  value={addressForm.name}
                  onChange={(e) => setAddressForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addr-phone">Phone *</Label>
                <Input
                  id="addr-phone"
                  placeholder="+91 9876543210"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Street Address *</Label>
                <Textarea
                  id="street"
                  placeholder="Enter full street address"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm((prev) => ({ ...prev, street: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm((prev) => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    placeholder="State"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm((prev) => ({ ...prev, state: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    placeholder="123456"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm((prev) => ({ ...prev, pincode: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isDefault" className="cursor-pointer">
                  Set as default address
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddressDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSaveAddress} disabled={isLoading}>
                {isLoading ? "Saving..." : editingAddress ? "Update Address" : "Add Address"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter your current password and choose a new one
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password (min 6 characters)"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleChangePassword} disabled={isLoading}>
                {isLoading ? "Changing..." : "Change Password"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                Order #{selectedOrder?.orderNumber}
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Order Status</h3>
                  <div className="relative">
                    {getStatusTimeline(selectedOrder).map((item, index) => (
                      <div key={item.status} className="flex items-center gap-4 pb-8 last:pb-0">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.completed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            {item.completed ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                          </div>
                          {index < getStatusTimeline(selectedOrder).length - 1 && (
                            <div className={`w-0.5 h-16 ${item.completed ? 'bg-primary' : 'bg-muted'}`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium capitalize ${item.active ? 'text-primary' : ''}`}>
                            {item.status}
                          </p>
                          {item.completed && (
                            <p className="text-sm text-muted-foreground">
                              {item.status === selectedOrder.status && 'Current status'}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-muted rounded" />
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium">{selectedOrder.paymentMethod.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Date</span>
                    <span className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold">₹{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
          <DialogContent className="max-w-2xl h-[600px] flex flex-col">
            <DialogHeader>
              <DialogTitle>Order Support Chat</DialogTitle>
              <DialogDescription>
                Order #{selectedOrder?.orderNumber}
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {chatLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading messages...</p>
                </div>
              ) : chatMessages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderRole === 'customer' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.senderRole === 'customer'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-xs font-semibold mb-1">
                        {msg.senderRole === 'admin' ? 'Support Team' : 'You'}
                      </p>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="flex-1 min-h-[60px]"
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
