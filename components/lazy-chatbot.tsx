"use client"

import { lazy, Suspense, useState } from "react"
import { Loader2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const ChatbotPanel = lazy(() =>
  import("@/components/chatbot").then((module) => ({ default: module.Chatbot })),
)

function ChatLauncher({ onClick, loading = false }: { onClick?: () => void; loading?: boolean }) {
  return (
    <div className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-4 z-50 sm:right-6">
      <Button
        onClick={onClick}
        disabled={loading}
        aria-label={loading ? "Loading chat" : "Open chat"}
        className="h-14 w-14 rounded-full bg-amber-600 shadow-lg transition-all duration-300 hover:bg-amber-700 hover:shadow-xl"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  )
}

export function LazyChatbot() {
  const [isLoaded, setIsLoaded] = useState(false)

  if (!isLoaded) {
    return <ChatLauncher onClick={() => setIsLoaded(true)} />
  }

  return (
    <Suspense fallback={<ChatLauncher loading />}>
      <ChatbotPanel initialOpen />
    </Suspense>
  )
}
