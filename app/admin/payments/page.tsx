"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  XCircle,
  Search,
  Download,
  Eye,
  RefreshCw
} from "lucide-react"
import { format } from "date-fns"

interface Payment {
  id: string
  orderId: string
  orderNumber: string
  amount: number
  paymentMethod: string
  paymentStatus: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  razorpaySignature?: string
  transactionId?: string
  createdAt: string
  updatedAt: string
  order: {
    user: {
      name: string
      email: string
      phone?: string
    }
  }
}

export default function AdminPaymentsPage() {
  const { toast } = useToast()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    completedPayments: 0,
    failedPayments: 0,
  })

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/payments")
      if (response.ok) {
        const result = await response.json()
        const paymentsData = result.data?.payments || result.payments || []
        setPayments(paymentsData)
        calculateStats(paymentsData)
      } else {
        toast({
          title: "Error",
          description: "Failed to load payments",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to load payments:", error)
      toast({
        title: "Error",
        description: "Failed to load payments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (paymentsData: Payment[]) => {
    const totalRevenue = paymentsData
      .filter(p => p.paymentStatus === "paid")
      .reduce((sum, p) => sum + p.amount, 0)

    const pendingAmount = paymentsData
      .filter(p => p.paymentStatus === "pending")
      .reduce((sum, p) => sum + p.amount, 0)

    const completedPayments = paymentsData.filter(p => p.paymentStatus === "paid").length
    const failedPayments = paymentsData.filter(p => p.paymentStatus === "failed").length

    setStats({
      totalRevenue,
      pendingAmount,
      completedPayments,
      failedPayments,
    })
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = 
      payment.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.order.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.paymentStatus === statusFilter
    const matchesMethod = methodFilter === "all" || payment.paymentMethod === methodFilter

    return matchesSearch && matchesStatus && matchesMethod
  })

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: any; icon: any }> = {
      paid: { label: "Paid", variant: "default", icon: CheckCircle2 },
      pending: { label: "Pending", variant: "secondary", icon: Clock },
      failed: { label: "Failed", variant: "destructive", icon: XCircle },
    }

    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getPaymentMethodBadge = (method: string) => {
    const methodConfig: Record<string, { label: string; color: string }> = {
      cod: { label: "Cash on Delivery", color: "bg-blue-100 text-blue-800" },
      online: { label: "Online Payment", color: "bg-green-100 text-green-800" },
      razorpay: { label: "Razorpay", color: "bg-purple-100 text-purple-800" },
    }

    const config = methodConfig[method] || { label: method, color: "bg-gray-100 text-gray-800" }

    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const exportPayments = () => {
    const csv = [
      ["Order Number", "Customer", "Amount", "Payment Method", "Status", "Transaction ID", "Date"].join(","),
      ...filteredPayments.map(p => 
        [
          p.orderNumber,
          p.order.user.name,
          p.amount,
          p.paymentMethod,
          p.paymentStatus,
          p.transactionId || "-",
          format(new Date(p.createdAt), "dd/MM/yyyy HH:mm")
        ].join(",")
      )
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `payments-${format(new Date(), "dd-MM-yyyy")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading payments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Manage and track all payment transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadPayments}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportPayments}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From {stats.completedPayments} completed payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedPayments}</div>
            <p className="text-xs text-muted-foreground">
              Successfully processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failedPayments}</div>
            <p className="text-xs text-muted-foreground">
              Needs attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order, customer, email, or transaction ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="cod">Cash on Delivery</SelectItem>
                <SelectItem value="online">Online Payment</SelectItem>
                <SelectItem value="razorpay">Razorpay</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.orderNumber}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{payment.order.user.name}</span>
                          <span className="text-xs text-muted-foreground">{payment.order.user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">₹{payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{getPaymentMethodBadge(payment.paymentMethod)}</TableCell>
                      <TableCell>{getPaymentStatusBadge(payment.paymentStatus)}</TableCell>
                      <TableCell className="text-xs font-mono">
                        {payment.transactionId || payment.razorpayPaymentId || "-"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(payment.createdAt), "dd MMM yyyy, HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/admin/orders?order=${payment.orderNumber}`}>
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {filteredPayments.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredPayments.length} of {payments.length} payments
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
