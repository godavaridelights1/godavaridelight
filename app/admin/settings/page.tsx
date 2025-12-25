"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageUpload } from "@/components/image-upload"
import { toast } from "sonner"
import Image from "next/image"
import { 
  CreditCard, 
  Loader2, 
  Check, 
  AlertCircle, 
  ExternalLink,
  Eye,
  EyeOff,
  Copy,
  CheckCircle
} from "lucide-react"

interface SiteSettings {
  id: string
  headerLogoUrl: string
  heroSectionImageUrl: string
  whyGodavariImageUrl: string
  updatedAt: string
}

export default function AdminSettingsPage() {
  const [razorpayKeyId, setRazorpayKeyId] = useState("")
  const [razorpayKeySecret, setRazorpayKeySecret] = useState("")
  const [originalKeySecret, setOriginalKeySecret] = useState("") // Store if secret exists
  const [isTestMode, setIsTestMode] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [configStatus, setConfigStatus] = useState<'unconfigured' | 'test' | 'live'>('unconfigured')
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
  const [headerLogo, setHeaderLogo] = useState<string>("")
  const [heroImage, setHeroImage] = useState<string>("")
  const [whyGodavariImage, setWhyGodavariImage] = useState<string>("")
  const [savingSettings, setSavingSettings] = useState(false)

  useEffect(() => {
    loadPaymentConfig()
    loadSiteSettings()
  }, [])

  const loadPaymentConfig = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/payment/config")
      
      if (!response.ok) {
        throw new Error("Failed to load payment config")
      }
      
      const data = await response.json()
      const keyId = data.razorpayKeyId || ""
      const keySecret = data.razorpayKeySecret || ""
      const testMode = data.isTestMode ?? true
      const hasKeys = data.hasKeys || false
      
      console.log('📖 Loaded config:', { keyId: keyId.substring(0, 12), hasSecret: !!keySecret, hasKeys, testMode })
      
      setRazorpayKeyId(keyId)
      
      // If secret is masked, keep a placeholder but remember it exists
      if (keySecret === '••••••••••••••••') {
        setRazorpayKeySecret('') // Clear input field
        setOriginalKeySecret('EXISTS') // Remember that secret exists
      } else {
        setRazorpayKeySecret(keySecret)
        setOriginalKeySecret(keySecret ? 'EXISTS' : '')
      }
      
      setIsTestMode(testMode)
      
      // Determine config status
      if (!hasKeys && (!keyId || keyId === '')) {
        setConfigStatus('unconfigured')
      } else if (keyId.startsWith('rzp_test_')) {
        setConfigStatus('test')
      } else if (keyId.startsWith('rzp_live_')) {
        setConfigStatus('live')
      } else {
        setConfigStatus('unconfigured')
      }
    } catch (error) {
      console.error('❌ Load error:', error)
      toast.error("Failed to load payment config")
      setConfigStatus('unconfigured')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!razorpayKeyId.trim()) {
      toast.error("Please enter Razorpay Key ID")
      return
    }

    // If no secret entered and no existing secret, require it
    if (!razorpayKeySecret.trim() && originalKeySecret !== 'EXISTS') {
      toast.error("Please enter both Razorpay Key ID and Secret")
      return
    }

    // Validate key format
    if (isTestMode && !razorpayKeyId.startsWith('rzp_test_')) {
      toast.error("Test mode requires test keys starting with 'rzp_test_'")
      return
    }

    if (!isTestMode && !razorpayKeyId.startsWith('rzp_live_')) {
      toast.error("Live mode requires live keys starting with 'rzp_live_'")
      return
    }

    try {
      setSaving(true)
      
      const hasNewSecret = !!razorpayKeySecret.trim()
      
      console.log('💾 Saving config:', {
        keyIdPrefix: razorpayKeyId.substring(0, 12),
        hasNewSecret,
        hasExistingSecret: originalKeySecret === 'EXISTS',
        isTestMode
      })
      
      // Prepare the update payload
      const updateData: any = {
        razorpayKeyId: razorpayKeyId.trim(),
        isTestMode
      }
      
      // Only include secret if a new one is provided
      if (hasNewSecret) {
        updateData.razorpayKeySecret = razorpayKeySecret.trim()
      } else if (originalKeySecret === 'EXISTS') {
        // If no new secret but one exists, we need to fetch and keep the old one
        // This is handled by the API - we'll add a flag
        updateData.keepExistingSecret = true
      }
      
      const response = await fetch("/api/payment/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save')
      }
      
      const result = await response.json()
      console.log('✅ Save successful:', result)
      
      toast.success(hasNewSecret 
        ? "Payment configuration updated successfully!" 
        : "Payment configuration saved successfully!"
      )
      
      // Clear the secret input field
      setRazorpayKeySecret('')
      
      // Mark that we now have a secret saved
      setOriginalKeySecret('EXISTS')
      
      // Reload to get fresh data
      await loadPaymentConfig()
    } catch (error: any) {
      console.error('❌ Save error:', error)
      toast.error(error.message || "Failed to save payment config")
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const loadSiteSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        cache: 'no-store'
      })
      if (!response.ok) throw new Error('Failed to fetch settings')
      const data = await response.json()
      setSiteSettings(data.data.settings)
      setHeaderLogo(data.data.settings.headerLogoUrl)
      setHeroImage(data.data.settings.heroSectionImageUrl)
      setWhyGodavariImage(data.data.settings.whyGodavariImageUrl)
    } catch (error: any) {
      console.error('Fetch error:', error)
      toast.error('Failed to load site settings')
    }
  }

  const handleSaveSiteSettings = async () => {
    try {
      setSavingSettings(true)
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headerLogoUrl: headerLogo,
          heroSectionImageUrl: heroImage,
          whyGodavariImageUrl: whyGodavariImage,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save settings')
      }

      const result = await response.json()
      setSiteSettings(result.data.settings)
      toast.success('Site settings saved successfully!')
    } catch (error: any) {
      console.error('Save error:', error)
      toast.error(error.message || 'Failed to save settings')
    } finally {
      setSavingSettings(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Settings" description="Configure payment gateway and system settings" />
      
      <div className="flex-1 p-6 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Status Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payment Gateway Status</CardTitle>
                  <CardDescription>Current Razorpay configuration</CardDescription>
                </div>
                {configStatus === 'unconfigured' && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Not Configured
                  </Badge>
                )}
                {configStatus === 'test' && (
                  <Badge variant="secondary" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Test Mode
                  </Badge>
                )}
                {configStatus === 'live' && (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Live Mode
                  </Badge>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Razorpay Configuration */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <CardTitle>Razorpay Configuration</CardTitle>
              </div>
              <CardDescription>
                Configure your Razorpay payment gateway credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  {/* Info Alert */}
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Get your Razorpay API keys from the{" "}
                      <a
                        href="https://dashboard.razorpay.com/app/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline inline-flex items-center gap-1"
                      >
                        Razorpay Dashboard
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      . Use test keys for development and live keys for production.
                    </AlertDescription>
                  </Alert>

                  {/* Mode Selection */}
                  <div className="space-y-3">
                    <Label>Environment Mode</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={isTestMode}
                          onChange={() => setIsTestMode(true)}
                          disabled={loading || saving}
                          className="w-4 h-4"
                        />
                        <span className="font-medium">Test Mode</span>
                        <Badge variant="secondary">Development</Badge>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={!isTestMode}
                          onChange={() => setIsTestMode(false)}
                          disabled={loading || saving}
                          className="w-4 h-4"
                        />
                        <span className="font-medium">Live Mode</span>
                        <Badge variant="default">Production</Badge>
                      </label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isTestMode 
                        ? "Test mode uses test keys (rzp_test_*) and won't charge real money"
                        : "Live mode uses live keys (rzp_live_*) and processes real payments"}
                    </p>
                  </div>

                  <Separator />

                  {/* Key ID */}
                  <div className="space-y-2">
                    <Label htmlFor="keyId">
                      Razorpay Key ID
                      <span className="text-destructive ml-1">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="keyId"
                        value={razorpayKeyId}
                        onChange={e => setRazorpayKeyId(e.target.value)}
                        placeholder={isTestMode ? "rzp_test_xxxxxxxxxxxxx" : "rzp_live_xxxxxxxxxxxxx"}
                        disabled={loading || saving}
                        className="font-mono"
                      />
                      {razorpayKeyId && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(razorpayKeyId)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your public API key {isTestMode ? '(starts with rzp_test_)' : '(starts with rzp_live_)'}
                    </p>
                  </div>

                  {/* Key Secret */}
                  <div className="space-y-2">
                    <Label htmlFor="keySecret">
                      Razorpay Key Secret
                      <span className="text-destructive ml-1">*</span>
                    </Label>
                    {originalKeySecret === 'EXISTS' ? (
                      <div className="space-y-2">
                        <div className="flex gap-2 items-center p-3 border rounded-lg bg-muted/50">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-mono text-sm">••••••••••••••••••••••••••••</span>
                          <Badge variant="secondary" className="ml-auto">Configured</Badge>
                        </div>
                        <details className="text-sm">
                          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                            Update secret key
                          </summary>
                          <div className="mt-2 space-y-2">
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Input
                                  id="keySecret"
                                  type={showSecret ? "text" : "password"}
                                  value={razorpayKeySecret}
                                  onChange={e => setRazorpayKeySecret(e.target.value)}
                                  placeholder="Enter new secret to update"
                                  disabled={loading || saving}
                                  className="font-mono pr-10"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full"
                                  onClick={() => setShowSecret(!showSecret)}
                                >
                                  {showSecret ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Leave empty to keep existing secret, or enter new value to update
                            </p>
                          </div>
                        </details>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            id="keySecret"
                            type={showSecret ? "text" : "password"}
                            value={razorpayKeySecret}
                            onChange={e => setRazorpayKeySecret(e.target.value)}
                            placeholder="Enter your Razorpay Key Secret"
                            disabled={loading || saving}
                            className="font-mono pr-10"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full"
                            onClick={() => setShowSecret(!showSecret)}
                          >
                            {showSecret ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {razorpayKeySecret && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(razorpayKeySecret)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {originalKeySecret === 'EXISTS' 
                        ? "Secret key is securely stored and hidden. Expand above to update it."
                        : "Your secret API key (keep this confidential)"}
                    </p>
                  </div>

                  <Separator />

                  {/* Test Cards Info */}
                  {isTestMode && (
                    <Alert>
                      <Check className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Test Mode:</strong> Use test card 4111 1111 1111 1111 with any CVV and future expiry for testing
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Live Mode Warning */}
                  {!isTestMode && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Live Mode:</strong> Real transactions will be processed. Ensure you have completed KYC verification on Razorpay.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Save Button */}
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleSave} 
                      disabled={loading || saving}
                      className="flex-1"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Save Configuration
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={loadPaymentConfig}
                      disabled={loading || saving}
                    >
                      Refresh
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Site Images Settings */}
          <Separator className="my-8" />
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Site Images</h2>
              <p className="text-muted-foreground mt-2">Manage dynamic images across the website</p>
            </div>

            {/* Header Logo */}
            <Card>
              <CardHeader>
                <CardTitle>Header Logo</CardTitle>
                <CardDescription>
                  Upload your company logo that appears in the header. Recommended size: 200x200px
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Upload Section */}
                  <div>
                    <p className="text-sm font-medium mb-4">Upload New Logo</p>
                    <ImageUpload
                      onChange={setHeaderLogo}
                      value={headerLogo}
                    />
                  </div>

                  {/* Preview Section */}
                  <div>
                    <p className="text-sm font-medium mb-4">Preview</p>
                    <div className="border rounded-lg p-6 bg-gray-50 flex items-center justify-center min-h-[250px]">
                      {headerLogo ? (
                        <div className="relative w-24 h-24">
                          <Image
                            src={headerLogo}
                            alt="Header Logo Preview"
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No logo selected</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hero Section Image */}
            <Card>
              <CardHeader>
                <CardTitle>Hero Section Image</CardTitle>
                <CardDescription>
                  Upload the image that appears on the right side of the hero section. Recommended size: 600x400px
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Upload Section */}
                  <div>
                    <p className="text-sm font-medium mb-4">Upload New Image</p>
                    <ImageUpload
                      onChange={setHeroImage}
                      value={heroImage}
                    />
                  </div>

                  {/* Preview Section */}
                  <div>
                    <p className="text-sm font-medium mb-4">Preview</p>
                    <div className="border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center min-h-[250px]">
                      {heroImage ? (
                        <div className="relative w-full h-64">
                          <Image
                            src={heroImage}
                            alt="Hero Section Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No image selected</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Godavari Delights Section Image */}
            <Card>
              <CardHeader>
                <CardTitle>Why Godavari Delights Image</CardTitle>
                <CardDescription>
                  Upload the image that appears in the "Why Godavari Delights?" section. Recommended size: 600x600px
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Upload Section */}
                  <div>
                    <p className="text-sm font-medium mb-4">Upload New Image</p>
                    <ImageUpload
                      onChange={setWhyGodavariImage}
                      value={whyGodavariImage}
                    />
                  </div>

                  {/* Preview Section */}
                  <div>
                    <p className="text-sm font-medium mb-4">Preview</p>
                    <div className="border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center min-h-[250px]">
                      {whyGodavariImage ? (
                        <div className="relative w-full h-64">
                          <Image
                            src={whyGodavariImage}
                            alt="Why Godavari Delights Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No image selected</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={loadSiteSettings}
                disabled={savingSettings}
              >
                Reset
              </Button>
              <Button
                onClick={handleSaveSiteSettings}
                disabled={savingSettings}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {savingSettings ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Site Images'
                )}
              </Button>
            </div>
          </div>

          {/* Additional Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
              <CardDescription>Helpful links for Razorpay setup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href="https://dashboard.razorpay.com/app/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <span className="font-medium">Get API Keys</span>
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="https://razorpay.com/docs/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <span className="font-medium">Razorpay Documentation</span>
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="https://razorpay.com/docs/payments/payment-gateway/test-card-details/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <span className="font-medium">Test Card Details</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
