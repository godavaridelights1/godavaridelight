"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, FileText, Plus, Edit2, Trash2, Eye } from "lucide-react"
import { toast } from "sonner"

interface Template {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  category: string
  shortcodes: string[]
  isActive: boolean
  createdAt: string
}

const SHORTCODE_GUIDE = [
  { code: '{{NAME}}', description: 'Subscriber first name' },
  { code: '{{EMAIL}}', description: 'Subscriber email address' },
  { code: '{{DISCOUNT}}', description: 'Discount percentage or amount' },
  { code: '{{PRODUCT}}', description: 'Product name or link' },
  { code: '{{LINK}}', description: 'Custom call-to-action link' },
  { code: '{{COMPANY}}', description: 'Company/store name' },
  { code: '{{DATE}}', description: 'Current date' },
  { code: '{{YEAR}}', description: 'Current year' },
]

export default function NewsletterTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showNewTemplate, setShowNewTemplate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    htmlContent: '',
    textContent: '',
    category: 'general'
  })

  useEffect(() => {
    fetchTemplates()
  }, [])

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

  const handleSaveTemplate = async () => {
    if (!formData.name || !formData.subject || !formData.htmlContent) {
      toast.error('Please fill in required fields')
      return
    }

    setIsLoading(true)
    try {
      const url = editingId
        ? `/api/admin/newsletter-templates/${editingId}`
        : '/api/admin/newsletter-templates'
      
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          shortcodes: SHORTCODE_GUIDE.map(s => s.code)
        })
      })

      if (!response.ok) throw new Error('Failed to save template')

      const template = await response.json()
      
      if (editingId) {
        setTemplates(templates.map(t => t.id === editingId ? template : t))
        toast.success('Template updated')
      } else {
        setTemplates([template, ...templates])
        toast.success('Template created')
      }

      resetForm()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save template')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure? This cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/newsletter-templates/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete template')

      setTemplates(templates.filter(t => t.id !== id))
      toast.success('Template deleted')
    } catch (error) {
      toast.error('Failed to delete template')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      htmlContent: '',
      textContent: '',
      category: 'general'
    })
    setShowNewTemplate(false)
    setEditingId(null)
    setPreview(null)
  }

  const startEdit = (template: Template) => {
    setFormData({
      name: template.name,
      subject: template.subject,
      htmlContent: template.htmlContent,
      textContent: template.textContent,
      category: template.category
    })
    setEditingId(template.id)
    setShowNewTemplate(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Templates</h1>
          <p className="text-muted-foreground mt-2">Create and manage email templates with shortcodes</p>
        </div>
        <Button onClick={() => setShowNewTemplate(!showNewTemplate)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      </div>

      {showNewTemplate && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {editingId ? 'Edit Template' : 'Create New Template'}
            </CardTitle>
            <CardDescription>
              Use shortcodes to personalize emails dynamically
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="content" className="space-y-4">
              <TabsList>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="shortcodes">Shortcodes</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Template Name *</label>
                  <Input
                    placeholder="e.g., Weekly Newsletter"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Email Subject *</label>
                  <Input
                    placeholder="e.g., Your Weekly {{'{COMPANY}'}} Newsletter"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Category</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="promotion">Promotion</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="welcome">Welcome</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">HTML Content *</label>
                  <Textarea
                    placeholder="Enter HTML email template..."
                    value={formData.htmlContent}
                    onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                    rows={8}
                    className="font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground">Supports HTML, CSS, and shortcodes</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Plain Text Version (Optional)</label>
                  <Textarea
                    placeholder="Plain text version for email clients without HTML support..."
                    value={formData.textContent}
                    onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPreview(formData.htmlContent)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    onClick={handleSaveTemplate}
                    disabled={isLoading}
                  >
                    {editingId ? 'Update Template' : 'Create Template'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="shortcodes" className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex gap-2 items-start">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Shortcodes Reference</p>
                      <p>Use these codes in your template. They will be replaced with actual values when sending.</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3">
                  {SHORTCODE_GUIDE.map((item) => (
                    <div key={item.code} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <code className="text-sm font-mono font-semibold text-primary">{item.code}</code>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            htmlContent: formData.htmlContent + item.code
                          })
                        }}
                      >
                        Insert
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {preview && (
        <Card>
          <CardHeader>
            <CardTitle>Template Preview</CardTitle>
            <Button size="sm" variant="outline" onClick={() => setPreview(null)} className="ml-auto">
              Close
            </Button>
          </CardHeader>
          <CardContent>
            <iframe
              title="Email Preview"
              srcDoc={preview}
              className="w-full border rounded-lg"
              style={{ minHeight: '400px' }}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
          <CardDescription>{templates.length} templates</CardDescription>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No templates yet. Create your first one!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {templates.map(template => (
                <div key={template.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.subject}</p>
                    </div>
                    <Badge>{template.category}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(template)} className="gap-1">
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="h-3 w-3" />
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
