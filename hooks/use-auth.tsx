"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/types"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        console.error("Login error:", result.error)
        return false
      }

      if (result?.ok) {
        router.refresh()
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (
    email: string,
    password: string,
    name: string,
    phone?: string
  ): Promise<boolean> => {
    try {
      // Call signup API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, phone })
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("Registration error:", error)
        return false
      }

      // After successful registration, sign in
      return await login(email, password)
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const loginWithGoogle = async () => {
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      console.error("Google login error:", error)
    }
  }

  const loginWithPhone = async (phone: string): Promise<boolean> => {
    try {
      // Validate phone number
      const phoneRegex = /^[6-9]\d{9}$/
      if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
        console.error("Invalid phone number format")
        return false
      }

      // Send OTP
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.replace(/\D/g, '') })
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("Send OTP error:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Phone login error:", error)
      return false
    }
  }

  const verifyOTP = async (phone: string, otp: string): Promise<boolean> => {
    try {
      const cleanPhone = phone.replace(/\D/g, '')
      
      // Verify OTP and get/create user
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          otp,
          email: `${cleanPhone}@phone.local`, // Temporary email
          name: ''
        })
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("Verify OTP error:", error)
        return false
      }

      // Sign in with phone OTP
      const result = await signIn('credentials', {
        phone: cleanPhone,
        redirect: false
      })

      if (result?.error) {
        console.error("Sign in after OTP error:", result.error)
        return false
      }

      if (result?.ok) {
        router.refresh()
        return true
      }

      return false
    } catch (error) {
      console.error("OTP verification error:", error)
      return false
    }
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      return response.ok
    } catch (error) {
      console.error("Password reset error:", error)
      return false
    }
  }

  const logout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  // Convert NextAuth session to app User type
  const user: User | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.name || '',
        role: session.user.role as 'admin' | 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    : null

  return {
    user,
    session: session || null,
    isLoading: status === "loading",
    login,
    register,
    loginWithGoogle,
    loginWithPhone,
    verifyOTP,
    logout,
    resetPassword
  }
}
