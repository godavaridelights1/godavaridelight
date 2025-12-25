"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function AuthCallbackPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (status === "loading") return
        
        if (status === "authenticated" && session) {
          // Redirect to home or intended page
          const redirectTo = localStorage.getItem("auth_redirect") || "/"
          localStorage.removeItem("auth_redirect")
          router.push(redirectTo)
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Auth callback error:", error)
        router.push("/login?error=auth_callback_failed")
      }
    }

    handleCallback()
  }, [router, session, status])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner />
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}
