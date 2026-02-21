"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Mail, CheckCircle, Settings } from "lucide-react"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SMTPConfig {
  id?: string
  provider: string
  host: string
  port: number
  secure: boolean
  username: string
  fromEmail: string
  fromName: string
  isActive: boolean
}

const PROVIDER_PRESETS = {
  gmail: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: true
  },
  outlook: {
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: true
  },
  sendgrid: {
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: true
  },
  custom: {
    host: '',
    port: 587,
    secure: true
  }
}

export default function SMTPConfigPage() {
  const [config, setConfig] = useState<SMTPConfig>({
    provider: 'custom',
    host: '',
    port: 587,
    secure: true,
    username: '',
    fromEmail: '',
    fromName: 'Atreyapuram',
    isActive: false
  })

  const [password, setPassword] = useState('')
  const [testEmail, setTestEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [savedConfig, setSavedConfig] = useState<SMTPConfig | null>(null)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/smtp-config')
      if (response.ok) {
        const data = await response.json()
        if (data.id) {
          setSavedConfig(data)
          setConfig(data)
        }
      }
    } catch (error) {
      console.error('Failed to fetch config:', error)
    }
  }

  const handleProviderChange = (provider: string) => {
    const preset = PROVIDER_PRESETS[provider as keyof typeof PROVIDER_PRESETS]
    if (preset) {
      setConfig({
        ...config,
        provider,
        ...preset
      })
    }
  }

  const handleSaveConfig = async () => {
    if (!config.host || !config.username || !config.fromEmail || !password) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/smtp-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          password,
          port: parseInt(config.port.toString())
        })
      })

      if (!response.ok) throw new Error('Failed to save configuration')

      const saved = await response.json()
      setSavedConfig(saved)
      setConfig(saved)
      toast.success('SMTP configuration saved successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save configuration')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestConnection = async () => {
    if (!testEmail) {
      toast.error('Please enter a test email address')
      return
    }

    setIsTesting(true)
    try {
      const response = await fetch('/api/admin/smtp-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testEmail })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Test failed')
      }

      toast.success('Test email sent successfully! Check your inbox.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send test email')
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SMTP Configuration</h1>
        <p className="text-muted-foreground mt-2">Configure email server settings for sending newsletters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-2xl font-bold">{config.isActive ? 'Active' : 'Inactive'}</p>
              </div>
              {config.isActive && (
                <CheckCircle className="h-8 w-8 text-green-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Provider</p>
              <p className="text-2xl font-bold capitalize">{config.provider}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">From Email</p>
              <p className="text-sm font-mono truncate">{config.fromEmail || '-'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <CardTitle className="text-blue-900">Email Configuration Required</CardTitle>
              <CardDescription className="text-blue-800">
                Configure your SMTP server to send newsletters and emails to subscribers
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            SMTP Server Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Email Provider</label>
            <Select value={config.provider} onValueChange={handleProviderChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gmail">Gmail</SelectItem>
                <SelectItem value="outlook">Outlook</SelectItem>
                <SelectItem value="sendgrid">SendGrid</SelectItem>
                <SelectItem value="custom">Custom SMTP</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {config.provider === 'gmail' && 'Use an App Password for Gmail (not your account password)'}
              {config.provider === 'sendgrid' && 'Username is always "apikey", password is your SendGrid API key'}
              {config.provider === 'custom' && 'Configure your custom SMTP server details'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">SMTP Host *</label>
              <Input
                value={config.host}
                onChange={(e) => setConfig({ ...config, host: e.target.value })}
                placeholder="smtp.example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Port *</label>
              <Input
                type="number"
                value={config.port}
                onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) })}
                placeholder="587"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.secure}
                onChange={(e) => setConfig({ ...config, secure: e.target.checked })}
                className="rounded border border-gray-300"
              />
              <span className="text-sm font-medium">Use TLS/SSL encryption</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Username/Email *</label>
            <Input
              value={config.username}
              onChange={(e) => setConfig({ ...config, username: e.target.value })}
              placeholder="your-email@gmail.com"
              type="email"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Password *</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <p className="text-xs text-muted-foreground">
              Your password is encrypted and never shared
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">From Email Address *</label>
              <Input
                type="email"
                value={config.fromEmail}
                onChange={(e) => setConfig({ ...config, fromEmail: e.target.value })}
                placeholder="noreply@Atreyapuram.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">From Name</label>
              <Input
                value={config.fromName}
                onChange={(e) => setConfig({ ...config, fromName: e.target.value })}
                placeholder="Atreyapuram"
              />
            </div>
          </div>

          <Button
            onClick={handleSaveConfig}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Saving...' : 'Save SMTP Configuration'}
          </Button>
        </CardContent>
      </Card>

      {savedConfig && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Test Email Connection
            </CardTitle>
            <CardDescription>
              Send a test email to verify your SMTP configuration works
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Test Email Address</label>
              <Input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="your-email@example.com"
              />
            </div>

            <Button
              onClick={handleTestConnection}
              disabled={isTesting || !testEmail}
              variant="outline"
              className="w-full"
            >
              {isTesting ? 'Sending...' : 'Send Test Email'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
