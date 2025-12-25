"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Download, Trash2, Eye, Filter, Search, Loader } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface BulkOrder {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  productName: string
  quantity: number
  message: string
  status: "pending" | "approved" | "rejected" | "completed"
  adminNotes?: string
  createdAt: string
  updatedAt: string
}

export default function BulkOrdersPage() {
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<BulkOrder | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")
  const [newStatus, setNewStatus] = useState<string>("")
  const [isUpdating, setIsUpdating] = useState(false)

  // Fetch bulk orders
  useEffect(() => {
    fetchBulkOrders()
  }, [statusFilter])

  const fetchBulkOrders = async () => {
    setIsLoading(true)
    try {
      const url = new URL("/api/bulk-orders", window.location.origin)
      if (statusFilter !== "all") {
        url.searchParams.append("status", statusFilter)
      }

      const response = await fetch(url.toString(), {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch bulk orders")
      }

      const result = await response.json()
      setBulkOrders(result?.data?.bulkOrders || result?.bulkOrders || [])
    } catch (error: any) {
      console.error("Error fetching bulk orders:", error)
      toast.error(error.message || "Failed to fetch bulk orders")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredOrders = bulkOrders.filter((order) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      order.name.toLowerCase().includes(searchLower) ||
      order.email.toLowerCase().includes(searchLower) ||
      order.company?.toLowerCase().includes(searchLower)
    )
  })

  const openDetails = (order: BulkOrder) => {
    setSelectedOrder(order)
    setAdminNotes(order.adminNotes || "")
    setNewStatus(order.status)
    setIsDetailOpen(true)
  }

  const updateStatusAndNotes = async () => {
    if (!selectedOrder) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/bulk-orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          adminNotes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update bulk order")
      }

      toast.success("Bulk order updated successfully")
      setIsDetailOpen(false)
      setIsEditingNotes(false)
      fetchBulkOrders()
    } catch (error: any) {
      console.error("Error updating bulk order:", error)
      toast.error(error.message || "Failed to update bulk order")
    } finally {
      setIsUpdating(false)
    }
  }

  const deleteBulkOrder = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this bulk order request?")) {
      return
    }

    try {
      const response = await fetch(`/api/bulk-orders/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete bulk order")
      }

      toast.success("Bulk order deleted successfully")
      fetchBulkOrders()
      setIsDetailOpen(false)
    } catch (error: any) {
      console.error("Error deleting bulk order:", error)
      toast.error(error.message || "Failed to delete bulk order")
    }
  }

  const exportToExcel = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Company", "Product", "Quantity", "Status", "Date", "Admin Notes"]
    const rows = filteredOrders.map((order) => [
      order.id,
      order.name,
      order.email,
      order.phone,
      order.company || "-",
      order.productName,
      order.quantity.toString(),
      order.status,
      new Date(order.createdAt).toLocaleDateString(),
      order.adminNotes || "-",
    ])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `bulk-orders-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToText = () => {
    let text = "BULK ORDERS REPORT\n"
    text += "==================\n\n"
    text += `Report Generated: ${new Date().toLocaleString()}\n`
    text += `Filter: ${statusFilter === "all" ? "All" : statusFilter}\n`
    text += `Total Orders: ${filteredOrders.length}\n\n`

    text += "---\n\n"

    filteredOrders.forEach((order) => {
      text += `Order ID: ${order.id}\n`
      text += `Customer: ${order.name}\n`
      text += `Email: ${order.email}\n`
      text += `Phone: ${order.phone}\n`
      if (order.company) text += `Company: ${order.company}\n`
      text += `Product: ${order.productName}\n`
      text += `Quantity: ${order.quantity} boxes\n`
      text += `Status: ${order.status}\n`
      text += `Requested: ${new Date(order.createdAt).toLocaleString()}\n`
      text += `Message: ${order.message}\n`
      if (order.adminNotes) text += `Admin Notes: ${order.adminNotes}\n`
      text += "\n---\n\n"
    })

    const blob = new Blob([text], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `bulk-orders-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <main>
      <AdminHeader title="Bulk Orders" />

      <div className="p-6">
          {/* Filters and Actions */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by name, email, or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={exportToExcel} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Button onClick={exportToText} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Text
              </Button>
            </div>
          </div>

          {/* Orders Table */}
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">No bulk orders found</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-6 py-3 text-left text-sm font-medium">Customer</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Product</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Quantity</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Requested</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-sm">{order.name}</p>
                            <p className="text-xs text-muted-foreground">{order.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">{order.productName}</td>
                        <td className="px-6 py-4 text-sm">{order.quantity} boxes</td>
                        <td className="px-6 py-4">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDetails(order)}
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteBulkOrder(order.id)}
                              title="Delete"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        {/* Detail Modal */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedOrder.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedOrder.phone}</p>
                  </div>
                  {selectedOrder.company && (
                    <div>
                      <p className="text-muted-foreground">Company</p>
                      <p className="font-medium">{selectedOrder.company}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Info */}
              <div>
                <h3 className="font-semibold mb-3">Order Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Product</p>
                    <p className="font-medium">{selectedOrder.productName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-medium">{selectedOrder.quantity} boxes</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Requested Date</p>
                    <p className="font-medium">
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <h3 className="font-semibold mb-3">Customer Message</h3>
                <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">
                  {selectedOrder.message}
                </p>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="font-semibold mb-3">Update Status</h3>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Admin Notes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Admin Notes</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingNotes(!isEditingNotes)}
                  >
                    {isEditingNotes ? "Done" : "Edit"}
                  </Button>
                </div>
                {isEditingNotes ? (
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add admin notes..."
                    rows={4}
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">
                    {adminNotes || "No notes"}
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Close
            </Button>
            <Button onClick={updateStatusAndNotes} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
        </Dialog>
      </main>
    )
  }
