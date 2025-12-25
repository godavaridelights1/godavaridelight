import { AdminHeader } from "@/components/admin-header"
import { AdminStatsCard } from "@/components/admin-stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { prisma } from "@/lib/prisma"
import {
  Package,
  ShoppingCart,
  Users,
  Eye,
  Plus,
  Clock,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getDashboardStats() {
  try {
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: oneMonthAgo }
      },
      select: {
        total: true,
        createdAt: true
      }
    })

    const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0)
    const totalOrders = orders.length

    const productCount = await prisma.product.count({
      where: { inStock: true }
    })

    const customerCount = await prisma.user.count({
      where: { role: 'customer' }
    })

    return {
      totalRevenue,
      totalOrders,
      productCount,
      customerCount,
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      totalRevenue: 0,
      totalOrders: 0,
      productCount: 0,
      customerCount: 0,
    }
  }
}

async function getRecentOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    return orders
  } catch (error) {
    console.error('Error fetching recent orders:', error)
    return []
  }
}

async function getLowStockProducts() {
  try {
    // Since we don't have a stock field, we'll return empty array
    // You can add a stock field to the Product model if needed
    return []
  } catch (error) {
    console.error('Error fetching low stock products:', error)
    return []
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()
  const recentOrders = await getRecentOrders()
  const lowStockProducts = await getLowStockProducts()

  const statsCards = [
    {
      title: "Total Revenue",
      value: stats.totalRevenue.toFixed(0),
      change: "+12.5%",
      trend: "up" as const,
      icon: "IndianRupee",
      description: "last 30 days",
      prefix: "₹",
      animated: true,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      change: "+8.2%",
      trend: "up" as const,
      icon: "ShoppingCart",
      description: "last 30 days",
      animated: true,
    },
    {
      title: "Total Products",
      value: stats.productCount,
      change: `${lowStockProducts.length} low stock`,
      trend: "up" as const,
      icon: "Package",
      description: "active products",
      animated: true,
    },
    {
      title: "Total Customers",
      value: stats.customerCount,
      change: "+15.3%",
      trend: "up" as const,
      icon: "Users",
      description: "registered users",
      animated: true,
    },
  ]

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "delivered":
        return "default"
      case "shipped":
        return "secondary"
      case "confirmed":
        return "outline"
      default:
        return "outline"
    }
  }

  const headerActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" asChild>
        <Link href="/admin/products">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Link>
      </Button>
    </div>
  )

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with your store today."
        actions={headerActions}
      />

      <div className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => (
            <AdminStatsCard key={stat.title} {...stat} />
          ))}
        </div>

        {lowStockProducts.length > 0 && (
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-orange-900">Low Stock Alert</CardTitle>
              </div>
              <CardDescription className="text-orange-700">
                {lowStockProducts.length} product{lowStockProducts.length > 1 ? "s are" : " is"} running low on stock
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {lowStockProducts.map((product: any) => (
                  <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border bg-white">
                    <span className="text-sm font-medium">{product.name}</span>
                    <Badge variant="destructive" className="text-xs">
                      {product.stock} left
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest orders from your customers</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/orders">
                      <Eye className="h-4 w-4 mr-1" />
                      View All
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No recent orders</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order: any) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{order.user?.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">{order.user?.name || "Unknown"}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-sm font-medium">₹{order.total.toFixed(2)}</p>
                          <Badge variant={getStatusBadgeVariant(order.status)} className="text-xs capitalize">
                            {order.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground flex items-center justify-end">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/admin/products">
                  <Button className="w-full h-20 flex-col space-y-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    <Plus className="h-5 w-5" />
                    <span className="text-xs">Add Product</span>
                  </Button>
                </Link>
                <Link href="/admin/orders">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex-col space-y-2 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-200"
                  >
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                    <span className="text-xs text-green-700">Orders</span>
                  </Button>
                </Link>
                <Link href="/admin/customers">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex-col space-y-2 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200"
                  >
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="text-xs text-purple-700">Customers</span>
                  </Button>
                </Link>
                <Link href="/admin/promotions">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex-col space-y-2 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border-orange-200"
                  >
                    <Package className="h-5 w-5 text-orange-600" />
                    <span className="text-xs text-orange-700">Promotions</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
