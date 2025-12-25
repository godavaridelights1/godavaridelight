"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
  const { login, loginWithGoogle, loginWithPhone, verifyOTP, isLoading, user } = useAuth()
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
      await loginWithGoogle()
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">GD</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl leading-none">Godavari Delights</span>
              <span className="text-sm text-muted-foreground">Traditional Putharekulu</span>
            </div>
          </Link>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue shopping</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4">
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
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
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
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
                        className="pl-10 pr-10"
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

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone" className="space-y-4">
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
                      <span className="flex items-center px-3 bg-muted rounded-l-md text-sm font-medium text-muted-foreground">
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
                        <label className="text-sm font-medium block mb-4">
                          Enter 6-Digit OTP
                        </label>
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
              </TabsContent>
            </Tabs>

            <div className="relative my-6">
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
              className="w-full"
              onClick={handleGoogleLogin}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>
          </CardContent>
          <CardFooter className="text-center">
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
