"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Mail, Send, Plus, Eye } from "lucide-react"
import { toast } from "sonner"

interface Campaign {
  id: string
  title: string
  subject: string
  type: string
  status: string
  sentCount: number
  recipientCount: number
  openCount: number
  createdAt: string
  sentAt: string | null
}

interface Template {
  id: string
  name: string
  subject: string
  category: string
  isActive: boolean
}

export default function NewsletterCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showNewCampaign, setShowNewCampaign] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    templateId: '',
    type: 'newsletter',
    customContent: ''
  })

  useEffect(() => {
    fetchCampaigns()
    fetchTemplates()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/admin/newsletter-campaigns')
      if (response.ok) {
        const data = await response.json()
        setCampaigns(data)
      }
    } catch (error) {
      toast.error('Failed to fetch campaigns')
    }
  }

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/newsletter-templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      }
    } catch (error) {
      toast.error('Failed to fetch templates')
    }
  }

  const handleCreateCampaign = async (sendNow: boolean = false) => {
    if (!formData.title || !formData.templateId) {
      toast.error('Please fill in required fields')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/newsletter-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          content: formData.customContent || undefined,
          sendNow
        })
      })

      if (!response.ok) throw new Error('Failed to create campaign')

      const campaign = await response.json()
      toast.success(sendNow ? 'Campaign sent successfully!' : 'Campaign created as draft')
      
      setCampaigns([campaign, ...campaigns])
      setFormData({ title: '', templateId: '', type: 'newsletter', customContent: '' })
      setShowNewCampaign(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create campaign')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'newsletter':
        return 'bg-purple-100 text-purple-800'
      case 'promotion':
        return 'bg-orange-100 text-orange-800'
      case 'announcement':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Newsletter Campaigns</h1>
          <p className="text-muted-foreground mt-2">Create and manage email campaigns</p>
        </div>
        <Button onClick={() => setShowNewCampaign(!showNewCampaign)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {showNewCampaign && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Create New Campaign
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Campaign Title *</label>
              <Input
                placeholder="e.g., Summer Sale Newsletter"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Template *</label>
              <Select value={formData.templateId} onValueChange={(value) => setFormData({ ...formData, templateId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} ({template.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Campaign Type</label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="promotion">Promotion</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Custom Content (Optional)</label>
              <Textarea
                placeholder="Override template content with custom message..."
                value={formData.customContent}
                onChange={(e) => setFormData({ ...formData, customContent: e.target.value })}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Use shortcodes like {"{NAME} {EMAIL} {DISCOUNT}"} to personalize
              </p>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowNewCampaign(false)}>
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => handleCreateCampaign(false)}
                disabled={isLoading}
              >
                Save as Draft
              </Button>
              <Button
                onClick={() => handleCreateCampaign(true)}
                disabled={isLoading}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Send Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
          <CardDescription>{campaigns.length} campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No campaigns yet. Create your first one!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map(campaign => (
                <div key={campaign.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{campaign.title}</h3>
                      <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getTypeColor(campaign.type)}>
                        {campaign.type}
                      </Badge>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm mb-2">
                    <div>
                      <p className="text-muted-foreground">Recipients</p>
                      <p className="font-semibold">{campaign.recipientCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sent</p>
                      <p className="font-semibold">{campaign.sentCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Opened</p>
                      <p className="font-semibold">{campaign.openCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sent Date</p>
                      <p className="font-semibold text-xs">
                        {campaign.sentAt ? new Date(campaign.sentAt).toLocaleDateString() : '-'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-3 w-3" />
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
