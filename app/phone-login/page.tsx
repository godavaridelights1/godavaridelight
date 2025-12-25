"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

type Step = 'phone' | 'otp' | 'details'

interface FormData {
  phone: string
  otp: string
  email: string
  name: string
}

export default function PhoneLoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('phone')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    otp: '',
    email: '',
    name: ''
  })
  const [otpSentAt, setOtpSentAt] = useState<Date | null>(null)

  const handleSendOTP = async () => {
    if (!formData.phone) {
      toast.error('Please enter phone number')
      return
    }

    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit mobile number')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send OTP')
      }

      setOtpSentAt(new Date())
      setStep('otp')
      toast.success('OTP sent to your phone')
    } catch (error: any) {
      console.error('Error sending OTP:', error)
      toast.error(error.message || 'Failed to send OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setIsLoading(true)
    try {
      // First verify the OTP
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          otp: formData.otp,
          email: formData.email,
          name: formData.name
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to verify OTP')
      }

      toast.success(result.data?.message || 'Phone verified successfully!')

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/profile')
      }, 1000)
    } catch (error: any) {
      console.error('Error verifying OTP:', error)
      toast.error(error.message || 'Failed to verify OTP')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        {/* Header */}
        {step !== 'phone' && (
          <div className="flex items-center gap-2 p-6 border-b">
            <button
              onClick={() => setStep('phone')}
              className="p-1 hover:bg-muted rounded"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <p className="text-sm text-muted-foreground">
              {step === 'otp' ? 'Verify OTP' : 'Enter Details'}
            </p>
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-2xl">
            {step === 'phone' ? 'Login with Phone' : 'Verify OTP'}
          </CardTitle>
          <CardDescription>
            {step === 'phone'
              ? 'Enter your mobile number to receive OTP'
              : step === 'otp'
              ? `We've sent OTP to ${formData.phone.slice(0, 2)}*****${formData.phone.slice(-2)}`
              : 'Complete your profile'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Phone */}
          {step === 'phone' && (
            <>
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  OTP is valid for 10 minutes
                </AlertDescription>
              </Alert>

              <div>
                <label className="text-sm font-medium block mb-2">Mobile Number</label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-muted rounded-l-md text-sm font-medium text-muted-foreground">
                    +91
                  </span>
                  <Input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setFormData({ ...formData, phone: value })
                    }}
                    className="rounded-r-md"
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  You'll receive an OTP on this number
                </p>
              </div>

              <Button
                onClick={handleSendOTP}
                disabled={isLoading || formData.phone.length !== 10}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">Or</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" asChild>
                <Link href="/login">Login with Email</Link>
              </Button>
            </>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-4">Enter OTP</label>
                  <InputOTP
                    maxLength={6}
                    value={formData.otp}
                    onChange={(otp) => setFormData({ ...formData, otp })}
                  >
                    <InputOTPGroup className="flex justify-between w-full gap-2">
                      <InputOTPSlot index={0} className="flex-1 h-12 text-lg" />
                      <InputOTPSlot index={1} className="flex-1 h-12 text-lg" />
                      <InputOTPSlot index={2} className="flex-1 h-12 text-lg" />
                      <InputOTPSlot index={3} className="flex-1 h-12 text-lg" />
                      <InputOTPSlot index={4} className="flex-1 h-12 text-lg" />
                      <InputOTPSlot index={5} className="flex-1 h-12 text-lg" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    {otpSentAt && (
                      <>
                        Expires in:{' '}
                        <OTPTimer expiresAt={new Date(otpSentAt.getTime() + 10 * 60000)} />
                      </>
                    )}
                  </span>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleSendOTP}
                    disabled={isLoading}
                  >
                    Resend OTP
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleVerifyOTP}
                disabled={isLoading || formData.otp.length !== 6}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>
            </>
          )}
        </CardContent>

        {/* Footer */}
        <div className="px-6 py-4 border-t text-center text-sm text-muted-foreground">
          <p>
            Don't have an account?{' '}
            <Link href="/register" className="text-orange-600 hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

/**
 * OTP Timer Component
 */
function OTPTimer({ expiresAt }: { expiresAt: Date }) {
  const [timeLeft, setTimeLeft] = useState(0)

  useState(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const diff = Math.floor((expiresAt.getTime() - now.getTime()) / 1000)
      setTimeLeft(Math.max(0, diff))
    }, 1000)

    return () => clearInterval(interval)
  }, [expiresAt])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <span className={timeLeft < 60 ? 'text-red-600 font-medium' : ''}>
      {minutes}:{seconds.toString().padStart(2, '0')}
    </span>
  )
}
