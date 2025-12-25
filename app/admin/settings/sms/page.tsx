"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SMSConfig {
  id: string
  provider: string
  apiKey: string
  smsType: string
  dlcSenderId?: string
  dlcTemplateId?: string
  dlcEntityId?: string
  dlcMessageId?: string
  isActive: boolean
}

export default function SMSSettingsPage() {
  const [config, setConfig] = useState<SMSConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    apiKey: "",
    smsType: "quick",
    dlcSenderId: "",
    dlcTemplateId: "",
    dlcEntityId: "",
    dlcMessageId: "",
    isActive: false
  })

  useEffect(() => {
    fetchSMSConfig()
  }, [])

  const fetchSMSConfig = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/sms-config", {
        cache: "no-store"
      })

      if (!response.ok) {
        throw new Error("Failed to fetch SMS configuration")
      }

      const result = await response.json()
      const smsConfig = result.data?.config

      if (smsConfig) {
        setConfig(smsConfig)
        setFormData({
          apiKey: smsConfig.apiKey,
          smsType: smsConfig.smsType,
          dlcSenderId: smsConfig.dlcSenderId || "",
          dlcTemplateId: smsConfig.dlcTemplateId || "",
          dlcEntityId: smsConfig.dlcEntityId || "",
          dlcMessageId: smsConfig.dlcMessageId || "",
          isActive: smsConfig.isActive
        })
      } else {
        setFormData({
          apiKey: "",
          smsType: "quick",
          dlcSenderId: "",
          dlcTemplateId: "",
          dlcEntityId: "",
          dlcMessageId: "",
          isActive: false
        })
      }
    } catch (error: any) {
      console.error("Error fetching SMS config:", error)
      toast.error(error.message || "Failed to fetch SMS configuration")
    } finally {
      setIsLoading(false)
    }
  }

  const checkWalletBalance = async () => {
    if (!formData.apiKey) {
      toast.error("Please enter API key first")
      return
    }

    try {
      const response = await fetch("/api/admin/sms-config/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: formData.apiKey })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to check balance")
      }

      setWalletBalance(result.data?.balance)
      toast.success("Wallet balance fetched successfully")
    } catch (error: any) {
      console.error("Error checking balance:", error)
      toast.error(error.message || "Failed to check wallet balance")
    }
  }

  const handleSave = async () => {
    if (!formData.apiKey) {
      toast.error("API Key is required")
      return
    }

    if (formData.smsType === "dlt" && (!formData.dlcSenderId || (!formData.dlcMessageId && !formData.dlcTemplateId))) {
      toast.error("DLT Sender ID is required. Also provide either Message Template ID or (Template ID + Entity ID)")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/sms-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: formData.apiKey,
          smsType: formData.smsType,
          dlcSenderId: formData.dlcSenderId || null,
          dlcTemplateId: formData.dlcTemplateId || null,
          dlcEntityId: formData.dlcEntityId || null,
          dlcMessageId: formData.dlcMessageId || null,
          isActive: formData.isActive
        })
      })

      if (!response.ok) {
        throw new Error("Failed to save SMS configuration")
      }

      const result = await response.json()
      setConfig(result.data?.config)
      toast.success("SMS configuration saved successfully")
    } catch (error: any) {
      console.error("Error saving SMS config:", error)
      toast.error(error.message || "Failed to save SMS configuration")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <main>
        <AdminHeader title="SMS Settings" />
        <div className="p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </main>
    )
  }

  return (
    <main>
      <AdminHeader title="SMS Configuration" />

      <div className="p-6 max-w-2xl">
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Configure your Fast2SMS credentials here for OTP and phone authentication features.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Fast2SMS Configuration</CardTitle>
            <CardDescription>
              Set up your SMS gateway for OTP delivery and phone verification
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* API Key */}
            <div>
              <label className="text-sm font-medium block mb-2">API Key *</label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter your Fast2SMS API key"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={checkWalletBalance}
                  disabled={!formData.apiKey}
                >
                  Check Balance
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Get your API key from{" "}
                <a
                  href="https://fast2sms.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  fast2sms.com
                </a>
              </p>
            </div>

            {/* Wallet Balance */}
            {walletBalance !== null && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Wallet Balance: ₹{walletBalance.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* SMS Type */}
            <div>
              <label className="text-sm font-medium block mb-2">SMS Type *</label>
              <Select value={formData.smsType} onValueChange={(value) => setFormData({ ...formData, smsType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quick">
                    Quick SMS (₹5 per SMS)
                  </SelectItem>
                  <SelectItem value="dlt">
                    DLT SMS (Lower cost, requires approval)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                {formData.smsType === "quick"
                  ? "Quick SMS: Instant setup, higher cost per SMS"
                  : "DLT SMS: Requires company registration and approval, lower cost per SMS"}
              </p>
            </div>

            {/* DLT Configuration */}
            {formData.smsType === "dlt" && (
              <>
                <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">DLT Configuration</p>
                  <p className="text-xs text-blue-800">
                    Choose one of two DLT setup methods:
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">DLT Sender ID * (Required)</label>
                  <Input
                    placeholder="Your approved DLT Sender ID (3-6 letters, e.g., FSTSMS)"
                    value={formData.dlcSenderId}
                    onChange={(e) => setFormData({ ...formData, dlcSenderId: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Get from Fast2SMS DLT Manager → View Sender/Template → Copy your Sender ID
                  </p>
                </div>

                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-semibold mb-3">Method 1: Template-based DLT (Recommended)</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Use pre-registered message templates for efficient and compliant SMS delivery
                  </p>
                  
                  <div>
                    <label className="text-sm font-medium block mb-2">DLT Template ID</label>
                    <Input
                      placeholder="Your DLT Content Template ID (e.g., 1110000001111)"
                      value={formData.dlcTemplateId}
                      onChange={(e) => setFormData({ ...formData, dlcTemplateId: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      From DLT Manager → View Sender/Template → Copy the Template ID
                    </p>
                  </div>

                  <div className="mt-3">
                    <label className="text-sm font-medium block mb-2">DLT Entity ID</label>
                    <Input
                      placeholder="Your DLT Principal Entity ID"
                      value={formData.dlcEntityId}
                      onChange={(e) => setFormData({ ...formData, dlcEntityId: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      From DLT Manager → Entity details
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-semibold mb-3">Method 2: Message ID based</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Use Message_ID from DLT Manager for pre-registered message templates
                  </p>
                  
                  <div>
                    <label className="text-sm font-medium block mb-2">DLT Message ID</label>
                    <Input
                      placeholder="Your approved Message_ID (e.g., 111111)"
                      value={formData.dlcMessageId}
                      onChange={(e) => setFormData({ ...formData, dlcMessageId: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      From DLT Manager → View Sender/Template → Copy Message_ID
                    </p>
                  </div>
                </div>

                <Alert className="border-amber-200 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800 text-xs">
                    Provide either (Template ID + Entity ID) or Message ID. You can set up both for flexibility.
                  </AlertDescription>
                </Alert>
              </>
            )}

            {/* Status */}
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium">Enable SMS Service</p>
                <p className="text-xs text-muted-foreground">
                  Activate SMS authentication for your platform
                </p>
              </div>
              <Button
                variant={formData.isActive ? "default" : "outline"}
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
              >
                {formData.isActive ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Active
                  </>
                ) : (
                  "Inactive"
                )}
              </Button>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full"
              size="lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </>
              )}
            </Button>

            {config && config.isActive && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">SMS service is active and configured</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">SMS Configuration Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-semibold mb-1">Quick SMS (₹5/SMS)</p>
              <p className="text-muted-foreground">
                Best for rapid deployment. No approval needed. Higher cost per SMS. Useful for testing.
              </p>
            </div>
            
            <div className="border-t pt-4">
              <p className="font-semibold mb-1">DLT SMS (Lower Cost)</p>
              <p className="text-muted-foreground mb-2">
                More economical option requiring company registration with Telecom Authority (TRAI). Lower cost per SMS.
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>Two methods to send DLT SMS:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                <li><strong>Template-based (Recommended):</strong> Use pre-registered templates via Template ID + Entity ID for better compliance and efficiency</li>
                <li><strong>Message ID based:</strong> Use Message_ID directly from your DLT Manager dashboard</li>
              </ul>
            </div>

            <div className="border-t pt-4">
              <p className="font-semibold mb-1">Getting DLT Details</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
                <li>Log in to Fast2SMS DLT Manager</li>
                <li>Go to "View Sender/Template"</li>
                <li>Copy your Sender ID (3-6 letters)</li>
                <li>Copy Template ID and Entity ID, or Message_ID as per your setup</li>
                <li>Paste these values in the respective fields above</li>
              </ol>
            </div>

            <div className="border-t pt-4">
              <p className="font-semibold mb-1">Wallet Balance</p>
              <p className="text-muted-foreground">
                Click "Check Balance" to verify your Fast2SMS wallet has sufficient funds before enabling SMS service.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
