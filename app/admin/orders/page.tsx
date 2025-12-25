"use client"

import { useState, useEffect, useRef } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, MoreHorizontal, Eye, Truck, CheckCircle, XCircle, Loader2, Download } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface OrderItem {
  id: string
  productName: string
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: string
  user: {
    id: string
    name: string
    email: string
    phone?: string
  }
  items: OrderItem[]
  total: number
  status: string
  createdAt: string
  shippingAddress: any
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [showStatusChange, setShowStatusChange] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const statusChangeRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null)
      }
      if (statusChangeRef.current && !statusChangeRef.current.contains(event.target as Node)) {
        setShowStatusChange(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orders')
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data.data || [])
    } catch (error: any) {
      console.error('Fetch error:', error)
      toast.error(error.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdating(orderId)
      setShowStatusChange(null)
      setOpenDropdownId(null)
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update order status')
      }

      const result = await response.json()
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: result.data.status } : o)))
      toast.success(`Order status updated to ${newStatus}`)
    } catch (error: any) {
      console.error('Update error:', error)
      toast.error(error.message || 'Failed to update order status')
    } finally {
      setUpdating(null)
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return

    try {
      setUpdating(orderId)
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to cancel order')
      }

      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o)))
      toast.success('Order cancelled successfully')
    } catch (error: any) {
      console.error('Cancel error:', error)
      toast.error(error.message || 'Failed to cancel order')
    } finally {
      setUpdating(null)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "default"
      case "shipped":
        return "secondary"
      case "processing":
        return "outline"
      case "confirmed":
        return "outline"
      case "pending":
        return "destructive"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const exportToExcel = () => {
    try {
      const headers = ['Order ID', 'Order Number', 'Customer Name', 'Email', 'Phone', 'Products', 'Total', 'Status', 'Date', 'Address']
      const rows = filteredOrders.map((order) => [
        order.id,
        order.orderNumber,
        order.user?.name || 'N/A',
        order.user?.email || 'N/A',
        order.user?.phone || 'N/A',
        order.items.map(item => `${item.productName} x${item.quantity}`).join('; '),
        `₹${order.total}`,
        order.status,
        new Date(order.createdAt).toLocaleDateString('en-IN'),
        order.shippingAddress ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}` : 'N/A'
      ])

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n')

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `orders-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success(`Exported ${filteredOrders.length} orders to Excel`)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export orders')
    }
  }

  const exportToText = () => {
    try {
      let textContent = 'ORDERS REPORT\n'
      textContent += `Generated: ${new Date().toLocaleString('en-IN')}\n`
      textContent += `Total Orders: ${filteredOrders.length}\n`
      textContent += '='.repeat(80) + '\n\n'

      filteredOrders.forEach((order, index) => {
        textContent += `Order #${index + 1}\n`
        textContent += `ID: ${order.id}\n`
        textContent += `Order Number: ${order.orderNumber}\n`
        textContent += `Customer: ${order.user?.name || 'N/A'}\n`
        textContent += `Email: ${order.user?.email || 'N/A'}\n`
        textContent += `Phone: ${order.user?.phone || 'N/A'}\n`
        textContent += `Date: ${new Date(order.createdAt).toLocaleString('en-IN')}\n`
        textContent += `Status: ${order.status}\n`
        textContent += `Total: ₹${order.total}\n`
        textContent += `Address: ${order.shippingAddress ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}` : 'N/A'}\n`
        textContent += `Products:\n`
        order.items.forEach(item => {
          textContent += `  - ${item.productName} x ${item.quantity} @ ₹${item.price}\n`
        })
        textContent += '-'.repeat(80) + '\n\n'
      })

      // Create blob and download
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `orders-${new Date().toISOString().split('T')[0]}.txt`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success(`Exported ${filteredOrders.length} orders to Text`)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export orders')
    }
  }

  return (
    <div className="flex flex-col">
      <AdminHeader title="Orders" description="Manage customer orders and track deliveries" />

      {loading ? (
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      ) : (
      <div className="flex-1 p-6 space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={exportToExcel}
              variant="outline"
              size="sm"
              disabled={filteredOrders.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export to Excel
            </Button>
            <Button 
              onClick={exportToText}
              variant="outline"
              size="sm"
              disabled={filteredOrders.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export to Text
            </Button>
          </div>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const address = order.shippingAddress 
                    ? `${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''}`.trim()
                    : 'N/A'
                  const formattedDate = new Date(order.createdAt).toLocaleDateString()
                  
                  return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.orderNumber}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.user?.name || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{order.user?.email || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">{address}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map((item) => (
                          <p key={item.id} className="text-sm">
                            {item.productName} x {item.quantity}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{order.items.length - 2} more
                          </p>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {order.items.length} item{order.items.length > 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">₹{order.total}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{formattedDate}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="relative inline-block" ref={openDropdownId === order.id ? dropdownRef : null}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          disabled={updating === order.id}
                          onClick={() => setOpenDropdownId(openDropdownId === order.id ? null : order.id)}
                        >
                          {updating === order.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                        {openDropdownId === order.id && (
                          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  router.push(`/orders/${order.id}`)
                                  setOpenDropdownId(null)
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </button>
                              
                              {/* Change Status Option */}
                              <div className="relative">
                                <button
                                  onClick={() => {
                                    setShowStatusChange(showStatusChange === order.id ? null : order.id)
                                  }}
                                  className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Change Status
                                  </div>
                                  <span className="text-xs">▶</span>
                                </button>
                                
                                {showStatusChange === order.id && (
                                  <div 
                                    ref={statusChangeRef}
                                    className="absolute left-full top-0 ml-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                                  >
                                    <div className="py-1">
                                      <button
                                        onClick={() => handleUpdateStatus(order.id, 'pending')}
                                        disabled={order.status === 'pending'}
                                        className={`flex items-center w-full px-4 py-2 text-sm ${
                                          order.status === 'pending' 
                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' 
                                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                      >
                                        <Badge variant="destructive" className="mr-2 text-xs">●</Badge>
                                        Pending
                                      </button>
                                      <button
                                        onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                                        disabled={order.status === 'confirmed'}
                                        className={`flex items-center w-full px-4 py-2 text-sm ${
                                          order.status === 'confirmed' 
                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' 
                                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                      >
                                        <Badge variant="outline" className="mr-2 text-xs">●</Badge>
                                        Confirmed
                                      </button>
                                      <button
                                        onClick={() => handleUpdateStatus(order.id, 'processing')}
                                        disabled={order.status === 'processing'}
                                        className={`flex items-center w-full px-4 py-2 text-sm ${
                                          order.status === 'processing' 
                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' 
                                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                      >
                                        <Badge variant="outline" className="mr-2 text-xs">●</Badge>
                                        Processing
                                      </button>
                                      <button
                                        onClick={() => handleUpdateStatus(order.id, 'shipped')}
                                        disabled={order.status === 'shipped'}
                                        className={`flex items-center w-full px-4 py-2 text-sm ${
                                          order.status === 'shipped' 
                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' 
                                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                      >
                                        <Badge variant="secondary" className="mr-2 text-xs">●</Badge>
                                        Shipped
                                      </button>
                                      <button
                                        onClick={() => handleUpdateStatus(order.id, 'delivered')}
                                        disabled={order.status === 'delivered'}
                                        className={`flex items-center w-full px-4 py-2 text-sm ${
                                          order.status === 'delivered' 
                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' 
                                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                      >
                                        <Badge variant="default" className="mr-2 text-xs">●</Badge>
                                        Delivered
                                      </button>
                                      <button
                                        onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                        disabled={order.status === 'cancelled'}
                                        className={`flex items-center w-full px-4 py-2 text-sm ${
                                          order.status === 'cancelled' 
                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' 
                                            : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                                        }`}
                                      >
                                        <Badge variant="destructive" className="mr-2 text-xs">●</Badge>
                                        Cancelled
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Quick Action Buttons */}
                              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                              
                              {order.status === "pending" && (
                                <button
                                  onClick={() => {
                                    handleUpdateStatus(order.id, 'confirmed')
                                    setOpenDropdownId(null)
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Quick: Confirm Order
                                </button>
                              )}
                              {order.status === "confirmed" && (
                                <button
                                  onClick={() => {
                                    handleUpdateStatus(order.id, 'processing')
                                    setOpenDropdownId(null)
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Quick: Start Processing
                                </button>
                              )}
                              {order.status === "processing" && (
                                <button
                                  onClick={() => {
                                    handleUpdateStatus(order.id, 'shipped')
                                    setOpenDropdownId(null)
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <Truck className="h-4 w-4 mr-2" />
                                  Quick: Mark as Shipped
                                </button>
                              )}
                              {order.status === "shipped" && (
                                <button
                                  onClick={() => {
                                    handleUpdateStatus(order.id, 'delivered')
                                    setOpenDropdownId(null)
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Quick: Mark as Delivered
                                </button>
                              )}
                              
                              {(order.status === "pending" || order.status === "confirmed" || order.status === "processing") && (
                                <>
                                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                  <button
                                    onClick={() => {
                                      handleCancelOrder(order.id)
                                      setOpenDropdownId(null)
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancel Order
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      )}
    </div>
  )
}
