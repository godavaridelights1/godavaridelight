import type { Newsletter } from "./types"

export class NewsletterService {
  private static subscribers: Newsletter[] = [
    {
      id: "1",
      email: "customer1@example.com",
      name: "Rajesh Kumar",
      isActive: true,
      subscribedAt: new Date("2024-01-15"),
      preferences: ["new-products", "offers", "festivals"],
    },
    {
      id: "2",
      email: "customer2@example.com",
      name: "Priya Sharma",
      isActive: true,
      subscribedAt: new Date("2024-02-10"),
      preferences: ["offers", "recipes"],
    },
  ]

  static getAllSubscribers(): Newsletter[] {
    return this.subscribers.filter((sub) => sub.isActive)
  }

  static subscribe(email: string, name?: string, preferences: string[] = []): Newsletter {
    const existing = this.subscribers.find((sub) => sub.email === email)

    if (existing) {
      existing.isActive = true
      existing.preferences = preferences.length > 0 ? preferences : existing.preferences
      existing.name = name || existing.name
      return existing
    }

    const newSubscriber: Newsletter = {
      id: Date.now().toString(),
      email,
      name,
      isActive: true,
      subscribedAt: new Date(),
      preferences: preferences.length > 0 ? preferences : ["offers"],
    }

    this.subscribers.push(newSubscriber)
    return newSubscriber
  }

  static unsubscribe(email: string): boolean {
    const subscriber = this.subscribers.find((sub) => sub.email === email)
    if (subscriber) {
      subscriber.isActive = false
      return true
    }
    return false
  }

  static updatePreferences(email: string, preferences: string[]): Newsletter | null {
    const subscriber = this.subscribers.find((sub) => sub.email === email)
    if (subscriber) {
      subscriber.preferences = preferences
      return subscriber
    }
    return null
  }

  static getSubscribersByPreference(preference: string): Newsletter[] {
    return this.subscribers.filter((sub) => sub.isActive && sub.preferences.includes(preference))
  }
}
