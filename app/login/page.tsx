"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Chrome, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { BrandMark } from "@/components/brand-mark"
import { MaintenanceOverlay } from "@/components/maintenance-overlay"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    otp: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const { login, loginWithPhone, verifyOTP, isLoading, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const redirect = searchParams.get('redirect') || '/'

  // Redirect if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      if (user) {
        console.log('User already logged in:', user.email)
        
        let redirectPath = '/'
        if (redirect && redirect !== '/') {
          redirectPath = redirect
        } else if (user.role === 'admin') {
          redirectPath = '/admin'
        }
        
        console.log('Redirecting to:', redirectPath)
        router.push(redirectPath)
        router.refresh()
      }
    }
    
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, redirect])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    console.log('Attempting login...')
    const result = await login(formData.email, formData.password)

    if (result) {
      console.log('Login successful!')
      // The useEffect hook will handle the redirect once user is updated
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      })
    } else {
      console.error('Login failed')
      setError("Invalid email or password. Please try again.")
    }
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!otpSent) {
      // Send OTP
      const success = await loginWithPhone(formData.phone)
      if (success) {
        setOtpSent(true)
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the verification code.",
        })
      } else {
        setError("Failed to send OTP. Please try again.")
      }
    } else {
      // Verify OTP
      const success = await verifyOTP(formData.phone, formData.otp)
      if (success) {
        console.log('OTP verified!')
        // The useEffect hook will handle the redirect once user is updated
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
        })
      } else {
        setError("Invalid OTP. Please try again.")
      }
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: redirect })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="flex min-h-dvh flex-col items-center bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 px-3 py-2 sm:justify-center sm:px-6 sm:py-8">
      <div className="my-auto w-full max-w-md">
        <Card className="gap-0 overflow-hidden border-white/80 bg-white/95 py-0 shadow-xl shadow-orange-950/10">
          <div className="space-y-2 border-b bg-white/80 px-4 py-2 sm:space-y-3 sm:px-6 sm:py-3">
            <Link href="/" className="inline-flex min-h-7 items-center text-sm text-muted-foreground transition-colors hover:text-primary">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Home
            </Link>
            <div className="rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 px-3 py-1.5 shadow-sm sm:py-3">
              <Link href="/" className="flex items-center justify-center gap-3">
                <BrandMark size={36} />
                <span className="flex flex-col text-left">
                  <span className="font-bold leading-tight">Godavari Delights</span>
                  <span className="text-xs text-muted-foreground">Traditional Putharekulu</span>
                </span>
              </Link>
            </div>
          </div>
          <CardHeader className="gap-1 px-5 pb-2 pt-3 text-center sm:px-8 sm:pb-3 sm:pt-5">
            <CardTitle className="text-xl sm:text-2xl">Welcome Back</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Sign in to continue shopping</CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-3 sm:px-8 sm:pb-4">
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid h-10 w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="mt-2 space-y-2 sm:mt-3 sm:space-y-3">
                <form onSubmit={handleEmailSubmit} className="space-y-2.5 sm:space-y-3">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="h-9 pl-10"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="h-9 pl-10 pr-10"
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button type="submit" className="h-10 w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone" className="space-y-4">
                <div className="relative overflow-hidden rounded-xl">
                  <fieldset
                    disabled
                    aria-hidden="true"
                    className="m-0 min-w-0 border-0 p-0 blur-sm"
                  >
                    <form onSubmit={handlePhoneSubmit} className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                          Phone Number
                        </label>
                        <div className="flex gap-2">
                          <span className="flex items-center rounded-l-md bg-muted px-3 text-sm font-medium text-muted-foreground">
                            +91
                          </span>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                              setFormData({ ...formData, phone: value })
                            }}
                            placeholder="Enter 10-digit mobile number"
                            className="rounded-r-md"
                            maxLength={10}
                            required
                            disabled={otpSent}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {!otpSent ? "We'll send you an OTP to verify" : "OTP sent to your number"}
                        </p>
                      </div>

                      {otpSent && (
                        <div className="space-y-4">
                          <div>
                            <label className="mb-4 block text-sm font-medium">
                              Enter 6-Digit OTP
                            </label>
                            <InputOTP
                              maxLength={6}
                              value={formData.otp}
                              onChange={(otp) => setFormData({ ...formData, otp })}
                            >
                              <InputOTPGroup className="flex w-full justify-between gap-2">
                                <InputOTPSlot index={0} className="h-12 flex-1 text-lg" />
                                <InputOTPSlot index={1} className="h-12 flex-1 text-lg" />
                                <InputOTPSlot index={2} className="h-12 flex-1 text-lg" />
                                <InputOTPSlot index={3} className="h-12 flex-1 text-lg" />
                                <InputOTPSlot index={4} className="h-12 flex-1 text-lg" />
                                <InputOTPSlot index={5} className="h-12 flex-1 text-lg" />
                              </InputOTPGroup>
                            </InputOTP>
                          </div>

                          <Button
                            type="button"
                            variant="link"
                            size="sm"
                            onClick={() => setOtpSent(false)}
                            className="text-xs"
                          >
                            Change phone number
                          </Button>
                        </div>
                      )}

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Processing..." : otpSent ? "Verify OTP" : "Send OTP"}
                      </Button>
                    </form>
                  </fieldset>
                  <MaintenanceOverlay />
                </div>
              </TabsContent>
            </Tabs>

            <div className="relative my-3 sm:my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-10 w-full"
              onClick={handleGoogleLogin}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>
          </CardContent>
          <CardFooter className="justify-center border-t px-5 py-2.5 text-center sm:px-8 sm:py-3">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Sign up here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
