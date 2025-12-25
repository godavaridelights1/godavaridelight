"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [preferences, setPreferences] = useState<string[]>(["offers"])
  const [isLoading, setIsLoading] = useState(false)

  const preferenceOptions = [
    { id: "new-products", label: "New Products" },
    { id: "offers", label: "Special Offers" },
    { id: "festivals", label: "Festival Specials" },
    { id: "recipes", label: "Recipes & Tips" },
    { id: "events", label: "Events & News" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter your email")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          name: name || undefined,
          preferences: preferences.length > 0 ? preferences : ['offers']
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to subscribe')
      }

      toast.success("Successfully subscribed to our newsletter!")
      setEmail("")
      setName("")
      setPreferences(["offers"])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to subscribe. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreferenceChange = (preferenceId: string, checked: boolean) => {
    if (checked) {
      setPreferences([...preferences, preferenceId])
    } else {
      setPreferences(preferences.filter((p) => p !== preferenceId))
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold text-amber-800">Stay Updated</CardTitle>
        <CardDescription>
          Get the latest offers, new products, and festival specials delivered to your inbox
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">What interests you?</p>
            <div className="grid grid-cols-1 gap-2">
              {preferenceOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={preferences.includes(option.id)}
                    onCheckedChange={(checked) => handlePreferenceChange(option.id, checked as boolean)}
                  />
                  <label htmlFor={option.id} className="text-sm text-gray-600 cursor-pointer">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
