"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Mail, Send, Eye, AlertCircle, TrendingUp } from "lucide-react"
import { toast } from "sonner"

interface Analytics {
  totalCampaigns: number
  totalSubscribers: number
  totalEmails: number
  sentEmails: number
  openedEmails: number
  bouncedEmails: number
  openRate: number
  bounceRate: number
  topCampaigns: any[]
}

export default function NewsletterAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/newsletter-analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      toast.error('Failed to fetch analytics')
    } finally {
      setIsLoading(false)
    }
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    )
  }

  const emailStatusData = [
    { name: 'Sent', value: analytics.sentEmails, color: '#3b82f6' },
    { name: 'Opened', value: analytics.openedEmails, color: '#10b981' },
    { name: 'Bounced', value: analytics.bouncedEmails, color: '#ef4444' },
  ]

  const campaignTrendData = analytics.topCampaigns.slice(0, 5).reverse().map((campaign: any) => ({
    name: campaign.title.substring(0, 15),
    sent: campaign.sentCount,
    opened: campaign.openCount
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Newsletter Analytics</h1>
        <p className="text-muted-foreground mt-2">Track your email campaign performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total Campaigns</p>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{analytics.totalCampaigns}</p>
              <p className="text-xs text-muted-foreground">email campaigns sent</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{analytics.totalSubscribers}</p>
              <p className="text-xs text-muted-foreground">active subscribers</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Open Rate</p>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{analytics.openRate}%</p>
              <p className="text-xs text-muted-foreground">of emails opened</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Bounce Rate</p>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{analytics.bounceRate}%</p>
              <p className="text-xs text-muted-foreground">of emails bounced</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Status Distribution</CardTitle>
            <CardDescription>Breakdown of email status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={emailStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {emailStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Summary</CardTitle>
            <CardDescription>Total emails sent and performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Emails</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.totalEmails}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Sent Successfully</p>
                <p className="text-2xl font-bold text-green-600">{analytics.sentEmails}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Opened</p>
                <p className="text-2xl font-bold text-amber-600">{analytics.openedEmails}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Bounced</p>
                <p className="text-2xl font-bold text-red-600">{analytics.bouncedEmails}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {campaignTrendData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Campaigns Performance
            </CardTitle>
            <CardDescription>Recent campaigns and their engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sent" fill="#3b82f6" />
                <Bar dataKey="opened" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
