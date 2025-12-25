"use client"

import { useState, useEffect } from "react"
import { Send, Users, Mail, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { NewsletterService } from "@/lib/newsletter-service"
import { EmailService } from "@/lib/email-service"
import type { Newsletter } from "@/lib/types"
import { toast } from "sonner"

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Newsletter[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/newsletter')
      if (!response.ok) throw new Error('Failed to fetch subscribers')
      const data = await response.json()
      setSubscribers(data.data || [])
    } catch (error: any) {
      console.error('Fetch error:', error)
      toast.error(error.message || 'Failed to load subscribers')
    } finally {
      setLoading(false)
    }
  }

  const handleSendNewsletter = async (formData: FormData) => {
    const subject = formData.get("subject") as string
    const content = formData.get("content") as string
    const targetPreference = formData.get("targetPreference") as string

    setIsLoading(true)

    let recipients: Newsletter[] = []
    if (targetPreference === "all") {
      recipients = subscribers
    } else {
      recipients = NewsletterService.getSubscribersByPreference(targetPreference)
    }

    let successCount = 0
    for (const subscriber of recipients) {
      const success = await EmailService.sendNewsletterEmail(subscriber.email, subject, content)
      if (success) successCount++
    }

    setIsLoading(false)
    toast.success(`Newsletter sent to ${successCount} subscribers!`)
  }

  const getPreferenceColor = (preference: string) => {
    const colors: Record<string, string> = {
      "new-products": "bg-blue-100 text-blue-800",
      offers: "bg-green-100 text-green-800",
      festivals: "bg-purple-100 text-purple-800",
      recipes: "bg-orange-100 text-orange-800",
      events: "bg-pink-100 text-pink-800",
    }
    return colors[preference] || "bg-gray-100 text-gray-800"
  }

  const stats = {
    totalSubscribers: subscribers.length,
    newThisMonth: subscribers.filter((sub) => new Date(sub.subscribedAt).getMonth() === new Date().getMonth()).length,
    mostPopularPreference: subscribers.reduce(
      (acc, sub) => {
        sub.preferences.forEach((pref) => {
          acc[pref] = (acc[pref] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>,
    ),
  }

  const topPreference = Object.entries(stats.mostPopularPreference).sort(([, a], [, b]) => b - a)[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Newsletter Management</h1>
        <p className="text-gray-600">Manage subscribers and send newsletters</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
            <p className="text-xs text-muted-foreground">+{stats.newThisMonth} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newThisMonth}</div>
            <p className="text-xs text-muted-foreground">Active subscribers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Interest</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {topPreference ? topPreference[0].replace("-", " ") : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">{topPreference ? topPreference[1] : 0} subscribers</p>
          </CardContent>
        </Card>
      </div>

      {/* Send Newsletter Form */}
      <Card>
        <CardHeader>
          <CardTitle>Send Newsletter</CardTitle>
          <CardDescription>Create and send newsletters to your subscribers</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSendNewsletter} className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject Line</Label>
              <Input id="subject" name="subject" placeholder="Enter newsletter subject" required />
            </div>

            <div>
              <Label htmlFor="targetPreference">Send To</Label>
              <Select name="targetPreference" defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subscribers ({subscribers.length})</SelectItem>
                  <SelectItem value="offers">
                    Offer Subscribers ({NewsletterService.getSubscribersByPreference("offers").length})
                  </SelectItem>
                  <SelectItem value="new-products">
                    New Product Subscribers ({NewsletterService.getSubscribersByPreference("new-products").length})
                  </SelectItem>
                  <SelectItem value="festivals">
                    Festival Subscribers ({NewsletterService.getSubscribersByPreference("festivals").length})
                  </SelectItem>
                  <SelectItem value="recipes">
                    Recipe Subscribers ({NewsletterService.getSubscribersByPreference("recipes").length})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content">Newsletter Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your newsletter content here..."
                className="min-h-[200px]"
                required
              />
              <p className="text-sm text-gray-500 mt-1">You can use HTML tags for formatting</p>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? "Sending..." : "Send Newsletter"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Subscribers List */}
      <Card>
        <CardHeader>
          <CardTitle>Subscribers</CardTitle>
          <CardDescription>Manage your newsletter subscribers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscribers.map((subscriber) => (
              <div key={subscriber.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{subscriber.name || "Anonymous"}</div>
                  <div className="text-sm text-gray-500">{subscriber.email}</div>
                  <div className="text-xs text-gray-400">
                    Subscribed: {subscriber.subscribedAt.toLocaleDateString()}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {subscriber.preferences.map((preference) => (
                    <Badge key={preference} variant="secondary" className={getPreferenceColor(preference)}>
                      {preference.replace("-", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
