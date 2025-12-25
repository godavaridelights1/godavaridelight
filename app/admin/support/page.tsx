"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "sonner"
import { MessageSquare, Eye, Send, Filter, Clock, User, Package } from "lucide-react"
import { format } from "date-fns"

interface SupportTicket {
  id: string
  subject: string
  priority: string
  status: string
  createdAt: string
  updatedAt: string
  user: { name: string; email: string }
  order: { orderNumber: string; total: number; status: string }
  messages: any[]
  _count?: { messages: number }
}

export default function AdminSupportPage() {
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [ticketDialog, setTicketDialog] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  useEffect(() => {
    loadTickets()
  }, [])

  useEffect(() => {
    filterTickets()
  }, [tickets, statusFilter, priorityFilter])

  const loadTickets = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/support")
      if (!response.ok) throw new Error("Failed to load tickets")
      const result = await response.json()
      setTickets(result.tickets || [])
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const filterTickets = () => {
    let filtered = [...tickets]
    if (statusFilter !== "all") filtered = filtered.filter(t => t.status === statusFilter)
    if (priorityFilter !== "all") filtered = filtered.filter(t => t.priority === priorityFilter)
    setFilteredTickets(filtered)
  }

  const handleViewTicket = async (ticket: SupportTicket) => {
    try {
      const response = await fetch(`/api/admin/support/${ticket.id}`)
      if (!response.ok) throw new Error("Failed to load ticket details")
      const result = await response.json()
      setSelectedTicket(result.ticket)
      setTicketDialog(true)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleSendReply = async () => {
    if (!selectedTicket || !newMessage.trim()) return
    try {
      const response = await fetch(`/api/admin/support/${selectedTicket.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage })
      })
      if (!response.ok) throw new Error("Failed to send reply")
      setNewMessage("")
      const ticketResponse = await fetch(`/api/admin/support/${selectedTicket.id}`)
      const result = await ticketResponse.json()
      setSelectedTicket(result.ticket)
      toast.success("Reply sent!")
      await loadTickets()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleUpdateStatus = async (ticketId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/support/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })
      if (!response.ok) throw new Error("Failed to update status")
      toast.success("Status updated!")
      await loadTickets()
      if (selectedTicket?.id === ticketId) {
        const ticketResponse = await fetch(`/api/admin/support/${ticketId}`)
        const result = await ticketResponse.json()
        setSelectedTicket(result.ticket)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleUpdatePriority = async (ticketId: string, priority: string) => {
    try {
      const response = await fetch(`/api/admin/support/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority })
      })
      if (!response.ok) throw new Error("Failed to update priority")
      toast.success("Priority updated!")
      await loadTickets()
      if (selectedTicket?.id === ticketId) {
        const ticketResponse = await fetch(`/api/admin/support/${ticketId}`)
        const result = await ticketResponse.json()
        setSelectedTicket(result.ticket)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      open: "bg-blue-100 text-blue-800",
      closed: "bg-gray-100 text-gray-800",
      resolved: "bg-green-100 text-green-800"
    }
    return variants[status] || "bg-gray-100 text-gray-800"
  }

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, string> = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800"
    }
    return variants[priority] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground">Manage customer support requests</p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1" />
        
        <Badge variant="secondary">
          {filteredTickets.length} ticket{filteredTickets.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No support tickets found</p>
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{ticket.subject}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{ticket.user.name}</span>
                        <span className="text-xs">({ticket.user.email})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        <span>Order #{ticket.order.orderNumber}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{format(new Date(ticket.createdAt), "PPp")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge className={getPriorityBadge(ticket.priority)}>{ticket.priority}</Badge>
                      <Badge className={getStatusBadge(ticket.status)}>{ticket.status}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {ticket._count?.messages || ticket.messages?.length || 0} messages
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleViewTicket(ticket)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={ticketDialog} onOpenChange={setTicketDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTicket?.subject}</DialogTitle>
            <DialogDescription className="space-y-1">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{selectedTicket?.user.name} ({selectedTicket?.user.email})</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>Order #{selectedTicket?.order.orderNumber} - ₹{selectedTicket?.order.total}</span>
              </div>
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Status</Label>
                  <Select value={selectedTicket.status} onValueChange={(value) => handleUpdateStatus(selectedTicket.id, value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label>Priority</Label>
                  <Select value={selectedTicket.priority} onValueChange={(value) => handleUpdatePriority(selectedTicket.id, value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="mb-2 block">Conversation</Label>
                <div className="border rounded-lg p-4 max-h-96 overflow-y-auto space-y-4 bg-muted/30">
                  {selectedTicket.messages?.map((msg: any, idx: number) => (
                    <div key={idx} className={`flex ${msg.isAdminReply ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-lg p-3 ${msg.isAdminReply ? "bg-primary text-primary-foreground" : "bg-background border"}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold">{msg.isAdminReply ? "You (Admin)" : msg.user?.name || "Customer"}</span>
                          <span className="text-xs opacity-70">{format(new Date(msg.createdAt), "PPp")}</span>
                        </div>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedTicket.status === "open" && (
                <div>
                  <Label htmlFor="reply">Your Reply</Label>
                  <div className="flex gap-2 mt-2">
                    <Textarea id="reply" placeholder="Type your reply to the customer..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendReply(); } }} rows={3} className="flex-1" />
                    <Button onClick={handleSendReply} disabled={!newMessage.trim()} className="self-end">
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              )}

              {selectedTicket.status !== "open" && (
                <div className="text-center text-sm text-muted-foreground py-4 bg-muted rounded-lg">
                  This ticket is {selectedTicket.status}. Change status to "open" to reply.
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
