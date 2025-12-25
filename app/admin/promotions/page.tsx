"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Users, Mail, TrendingUp, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PromotionService } from "@/lib/promotion-service"
import { EmailService } from "@/lib/email-service"
import { NewsletterService } from "@/lib/newsletter-service"
import { CouponService } from "@/lib/coupon-service"
import type { Promotion } from "@/lib/types"
import { toast } from "sonner"
import Image from "next/image"

const mockCustomers = [
  {
    id: "1",
    name: "Priya Sharma",
    email: "priya@example.com",
    totalSpent: 2500,
    lastPurchase: "2024-01-15",
    category: "Premium",
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    totalSpent: 1200,
    lastPurchase: "2024-01-10",
    category: "Traditional",
  },
  {
    id: "3",
    name: "Meera Reddy",
    email: "meera@example.com",
    totalSpent: 3200,
    lastPurchase: "2024-01-20",
    category: "Festival",
  },
  {
    id: "4",
    name: "Amit Patel",
    email: "amit@example.com",
    totalSpent: 800,
    lastPurchase: "2024-01-05",
    category: "Gift",
  },
  {
    id: "5",
    name: "Sunita Devi",
    email: "sunita@example.com",
    totalSpent: 1800,
    lastPurchase: "2024-01-18",
    category: "Premium",
  },
]

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isCouponOpen, setIsCouponOpen] = useState(false)
  const [isCustomerFilterOpen, setIsCustomerFilterOpen] = useState(false)
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null)
  const [filteredCustomers, setFilteredCustomers] = useState(mockCustomers)

  useEffect(() => {
    setPromotions(PromotionService.getAllPromotions())
  }, [])

  const handleCreatePromotion = (formData: FormData) => {
    const promotion = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      image: (formData.get("image") as string) || "/placeholder.svg?height=200&width=400",
      type: formData.get("type") as "banner" | "popup" | "email",
      targetAudience: formData.get("targetAudience") as "all" | "subscribers" | "customers",
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      isActive: true,
    }

    const newPromotion = PromotionService.createPromotion(promotion)
    setPromotions(PromotionService.getAllPromotions())
    setIsCreateOpen(false)
    toast.success("Promotion created successfully!")
  }

  const handleSendCouponEmail = async (formData: FormData) => {
    const couponCode = formData.get("couponCode") as string
    const couponValue = Number.parseInt(formData.get("couponValue") as string)
    const couponType = formData.get("couponType") as "percentage" | "fixed"
    const targetAudience = formData.get("targetAudience") as string
    const minSpent = formData.get("minSpent") ? Number(formData.get("minSpent")) : 0
    const categoryFilter = formData.get("categoryFilter") as string

    let recipients: string[] = []
    let targetCustomers = mockCustomers

    if (minSpent > 0) {
      targetCustomers = targetCustomers.filter((customer) => customer.totalSpent >= minSpent)
    }

    if (categoryFilter && categoryFilter !== "all") {
      targetCustomers = targetCustomers.filter(
        (customer) => customer.category.toLowerCase() === categoryFilter.toLowerCase(),
      )
    }

    if (targetAudience === "all") {
      recipients = NewsletterService.getAllSubscribers().map((sub) => sub.email)
    } else if (targetAudience === "high-value") {
      recipients = targetCustomers.filter((c) => c.totalSpent > 2000).map((c) => c.email)
    } else if (targetAudience === "recent") {
      const recentDate = new Date()
      recentDate.setDate(recentDate.getDate() - 30)
      recipients = targetCustomers.filter((c) => new Date(c.lastPurchase) > recentDate).map((c) => c.email)
    } else {
      recipients = NewsletterService.getSubscribersByPreference(targetAudience).map((sub) => sub.email)
    }

    const newCoupon = CouponService.createCoupon({
      code: couponCode,
      type: couponType,
      value: couponValue,
      description: `Special ${couponValue}${couponType === "percentage" ? "%" : "₹"} discount`,
      minOrderAmount: 300,
      usageLimit: recipients.length * 2,
      usedCount: 0,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
    })

    let successCount = 0
    for (const email of recipients) {
      const success = await EmailService.sendCouponEmail(email, couponCode, couponValue, couponType)
      if (success) successCount++
    }

    setIsCouponOpen(false)
    toast.success(`Coupon emails sent to ${successCount} customers!`)
  }

  const togglePromotionStatus = (id: string) => {
    const promotion = promotions.find((p) => p.id === id)
    if (promotion) {
      PromotionService.updatePromotion(id, { isActive: !promotion.isActive })
      setPromotions(PromotionService.getAllPromotions())
      toast.success(`Promotion ${promotion.isActive ? "deactivated" : "activated"}`)
    }
  }

  const deletePromotion = (id: string) => {
    PromotionService.deletePromotion(id)
    setPromotions(PromotionService.getAllPromotions())
    toast.success("Promotion deleted successfully!")
  }

  const filterCustomers = (minSpent: number, category: string, days: number) => {
    let filtered = mockCustomers

    if (minSpent > 0) {
      filtered = filtered.filter((c) => c.totalSpent >= minSpent)
    }

    if (category !== "all") {
      filtered = filtered.filter((c) => c.category.toLowerCase() === category.toLowerCase())
    }

    if (days > 0) {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      filtered = filtered.filter((c) => new Date(c.lastPurchase) > cutoffDate)
    }

    setFilteredCustomers(filtered)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promotions & Marketing</h1>
          <p className="text-gray-600">Manage promotional campaigns and send targeted marketing emails</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isCustomerFilterOpen} onOpenChange={setIsCustomerFilterOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Customer Insights
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Customer Insights & Filtering</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="analytics" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="filter">Filter Customers</TabsTrigger>
                </TabsList>

                <TabsContent value="analytics" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <Users className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Total Customers</p>
                            <p className="text-2xl font-bold">{mockCustomers.length}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Avg. Spent</p>
                            <p className="text-2xl font-bold">
                              ₹
                              {Math.round(
                                mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0) / mockCustomers.length,
                              )}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-5 w-5 text-orange-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">High Value (&gt;₹2000)</p>
                            <p className="text-2xl font-bold">
                              {mockCustomers.filter((c) => c.totalSpent > 2000).length}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Customer Segments</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {["Premium", "Traditional", "Festival", "Gift"].map((category) => {
                        const categoryCustomers = mockCustomers.filter((c) => c.category === category)
                        const avgSpent =
                          categoryCustomers.length > 0
                            ? Math.round(
                                categoryCustomers.reduce((sum, c) => sum + c.totalSpent, 0) / categoryCustomers.length,
                              )
                            : 0

                        return (
                          <Card key={category}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{category} Buyers</span>
                                <Badge variant="outline">{categoryCustomers.length} customers</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">Avg: ₹{avgSpent}</p>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="filter" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Min. Amount Spent</Label>
                      <Input
                        type="number"
                        placeholder="1000"
                        onChange={(e) => filterCustomers(Number(e.target.value) || 0, "all", 0)}
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select onValueChange={(value) => filterCustomers(0, value, 0)}>
                        <SelectTrigger>
                          <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="traditional">Traditional</SelectItem>
                          <SelectItem value="festival">Festival</SelectItem>
                          <SelectItem value="gift">Gift</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Last Purchase (days)</Label>
                      <Input
                        type="number"
                        placeholder="30"
                        onChange={(e) => filterCustomers(0, "all", Number(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="max-h-60 overflow-y-auto">
                    <h4 className="font-medium mb-2">Filtered Customers ({filteredCustomers.length})</h4>
                    <div className="space-y-2">
                      {filteredCustomers.map((customer) => (
                        <div key={customer.id} className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{customer.totalSpent}</p>
                            <Badge variant="outline" className="text-xs">
                              {customer.category}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>

          <Dialog open={isCouponOpen} onOpenChange={setIsCouponOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Mail className="w-4 h-4 mr-2" />
                Send Coupon Email
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Send Targeted Coupon Email</DialogTitle>
              </DialogHeader>
              <form action={handleSendCouponEmail} className="space-y-4">
                <div>
                  <Label htmlFor="couponCode">Coupon Code</Label>
                  <Input id="couponCode" name="couponCode" defaultValue={CouponService.generateCouponCode()} required />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="couponValue">Value</Label>
                    <Input id="couponValue" name="couponValue" type="number" defaultValue="15" required />
                  </div>
                  <div>
                    <Label htmlFor="couponType">Type</Label>
                    <Select name="couponType" defaultValue="percentage">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Select name="targetAudience" defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subscribers</SelectItem>
                      <SelectItem value="high-value">High Value Customers (&gt;₹2000)</SelectItem>
                      <SelectItem value="recent">Recent Customers (30 days)</SelectItem>
                      <SelectItem value="offers">Offer Subscribers</SelectItem>
                      <SelectItem value="new-products">New Product Subscribers</SelectItem>
                      <SelectItem value="festivals">Festival Subscribers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="minSpent">Min. Spent (₹)</Label>
                    <Input id="minSpent" name="minSpent" type="number" placeholder="1000" />
                  </div>
                  <div>
                    <Label htmlFor="categoryFilter">Category</Label>
                    <Select name="categoryFilter" defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="traditional">Traditional</SelectItem>
                        <SelectItem value="festival">Festival</SelectItem>
                        <SelectItem value="gift">Gift</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Send Targeted Coupon Emails
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Promotion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Promotion</DialogTitle>
              </DialogHeader>
              <form action={handleCreatePromotion} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required />
                </div>
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input id="image" name="image" placeholder="/path/to/image.jpg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select name="type" defaultValue="banner">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="banner">Banner</SelectItem>
                        <SelectItem value="popup">Popup</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Select name="targetAudience" defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="subscribers">Subscribers</SelectItem>
                        <SelectItem value="customers">Customers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="datetime-local"
                      defaultValue={new Date().toISOString().slice(0, 16)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="datetime-local"
                      defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Create Promotion
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Promotions</p>
                <p className="text-2xl font-bold">{promotions.filter((p) => p.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Email Campaigns</p>
                <p className="text-2xl font-bold">{promotions.filter((p) => p.type === "email").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <p className="text-2xl font-bold">{promotions.reduce((sum, p) => sum + p.clickCount, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">High Value Customers</p>
                <p className="text-2xl font-bold">{mockCustomers.filter((c) => c.totalSpent > 2000).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {promotions.map((promotion) => (
          <Card key={promotion.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex space-x-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={promotion.image || "/placeholder.svg"}
                      alt={promotion.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{promotion.title}</span>
                      <Badge variant={promotion.isActive ? "default" : "secondary"}>
                        {promotion.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{promotion.type}</Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">{promotion.description}</CardDescription>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Target: {promotion.targetAudience}</span>
                      <span>Clicks: {promotion.clickCount}</span>
                      <span>
                        {promotion.startDate.toLocaleDateString()} - {promotion.endDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => togglePromotionStatus(promotion.id)}>
                    {promotion.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deletePromotion(promotion.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
