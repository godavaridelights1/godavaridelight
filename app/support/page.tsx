"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { MessageCircle, Plus, Send, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

interface Chat {
  id: string
  subject: string
  status: string
  created_at: string
  updated_at: string
  order?: {
    order_number: string
  }
}

interface Message {
  id: string
  message: string
  is_admin: boolean
  created_at: string
  user?: {
    name: string
  }
}

export default function SupportPage() {
  const { user } = useAuth()
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState("")
  const [isSending, setIsSending] = useState(false)

  const [newChatForm, setNewChatForm] = useState({
    subject: "",
    message: "",
    order_id: "",
  })

  useEffect(() => {
    if (user) {
      loadChats()
    }
  }, [user])

  const loadChats = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/chats")

      if (response.ok) {
        const data = await response.json()
        setChats(data.chats || [])
      }
    } catch (error) {
      console.error("Error loading chats:", error)
      toast.error("Failed to load support tickets")
    } finally {
      setIsLoading(false)
    }
  }

  const loadMessages = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}/messages`)

      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error("Error loading messages:", error)
      toast.error("Failed to load messages")
    }
  }

  const handleCreateChat = async () => {
    if (!newChatForm.subject.trim() || !newChatForm.message.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSending(true)
    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newChatForm),
      })

      if (response.ok) {
        toast.success("Support ticket created successfully")
        setIsNewChatOpen(false)
        setNewChatForm({ subject: "", message: "", order_id: "" })
        loadChats()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to create ticket")
      }
    } catch (error) {
      console.error("Error creating chat:", error)
      toast.error("Failed to create ticket")
    } finally {
      setIsSending(false)
    }
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChat) return

    setIsSending(true)
    try {
      const response = await fetch(`/api/chats/${selectedChat.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageText }),
      })

      if (response.ok) {
        setMessageText("")
        loadMessages(selectedChat.id)
      } else {
        toast.error("Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message")
    } finally {
      setIsSending(false)
    }
  }

  const openChat = (chat: Chat) => {
    setSelectedChat(chat)
    loadMessages(chat.id)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="default" className="capitalize"><Clock className="h-3 w-3 mr-1" />{status}</Badge>
      case "resolved":
        return <Badge variant="secondary" className="capitalize"><CheckCircle className="h-3 w-3 mr-1" />{status}</Badge>
      case "closed":
        return <Badge variant="outline" className="capitalize"><XCircle className="h-3 w-3 mr-1" />{status}</Badge>
      default:
        return <Badge variant="outline" className="capitalize">{status}</Badge>
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Support Center</h1>
                  <p className="text-muted-foreground">Get help with your orders and inquiries</p>
                </div>
              </div>
              <Button onClick={() => setIsNewChatOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Tickets</CardTitle>
                    <CardDescription>View and manage support tickets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Loading...</p>
                      </div>
                    ) : chats.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <p className="text-muted-foreground mb-4">No support tickets yet</p>
                        <Button onClick={() => setIsNewChatOpen(true)} size="sm">
                          Create Ticket
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {chats.map((chat) => (
                          <div
                            key={chat.id}
                            onClick={() => openChat(chat)}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedChat?.id === chat.id
                                ? "bg-primary/10 border-primary"
                                : "hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-sm line-clamp-1">{chat.subject}</h3>
                              {getStatusBadge(chat.status)}
                            </div>
                            {chat.order && (
                              <p className="text-xs text-muted-foreground mb-1">
                                Order: {chat.order.order_number}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {new Date(chat.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Chat Messages */}
              <div className="lg:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  {selectedChat ? (
                    <>
                      <CardHeader className="border-b">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{selectedChat.subject}</CardTitle>
                            <CardDescription>
                              Created {new Date(selectedChat.created_at).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          {getStatusBadge(selectedChat.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.is_admin ? "justify-start" : "justify-end"}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                message.is_admin
                                  ? "bg-muted"
                                  : "bg-primary text-primary-foreground"
                              }`}
                            >
                              <p className="text-sm mb-1">{message.message}</p>
                              <p className={`text-xs ${message.is_admin ? "text-muted-foreground" : "text-primary-foreground/70"}`}>
                                {message.is_admin ? "Support" : "You"} •{" "}
                                {new Date(message.created_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                      <div className="border-t p-4">
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Type your message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            disabled={selectedChat.status !== "open"}
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={!messageText.trim() || isSending || selectedChat.status !== "open"}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                        {selectedChat.status !== "open" && (
                          <p className="text-xs text-muted-foreground mt-2">
                            This ticket is {selectedChat.status}. You cannot send new messages.
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">Select a ticket</h3>
                        <p className="text-muted-foreground">Choose a support ticket to view the conversation</p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>

        <Footer />

        {/* New Chat Dialog */}
        <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Tell us how we can help you
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your issue"
                  value={newChatForm.subject}
                  onChange={(e) => setNewChatForm((prev) => ({ ...prev, subject: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue in detail..."
                  rows={5}
                  value={newChatForm.message}
                  onChange={(e) => setNewChatForm((prev) => ({ ...prev, message: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order_id">Related Order (Optional)</Label>
                <Input
                  id="order_id"
                  placeholder="Order ID (if applicable)"
                  value={newChatForm.order_id}
                  onChange={(e) => setNewChatForm((prev) => ({ ...prev, order_id: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewChatOpen(false)} disabled={isSending}>
                Cancel
              </Button>
              <Button onClick={handleCreateChat} disabled={isSending}>
                {isSending ? "Creating..." : "Create Ticket"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
