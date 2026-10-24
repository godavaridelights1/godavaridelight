"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChatbotService } from "@/lib/chatbot-service"
import type { ChatMessage } from "@/lib/types"

export function Chatbot({ initialOpen = false }: { initialOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId] = useState(() => Date.now().toString())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chat opens for the first time
      const welcomeMessage = ChatbotService.addMessage(
        "Hello! I'm your Godavari Delights virtual assistant. I can help you with product information, ingredients, shipping, orders, and more. How can I assist you today?",
        "bot",
        sessionId,
      )
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length, sessionId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (message = inputMessage) => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage || isTyping) return

    const userMessage = ChatbotService.addMessage(trimmedMessage, "user", sessionId)
    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    setTimeout(
      () => {
        const botResponse = ChatbotService.generateResponse(trimmedMessage)
        const botMessage = ChatbotService.addMessage(botResponse, "bot", sessionId)
        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const quickQuestions = [
    "What products do you offer?",
    "What are the ingredients?",
    "How much does shipping cost?",
    "Do you have festival specials?",
  ]

  const handleQuickQuestion = (question: string) => {
    void handleSendMessage(question)
  }

  if (!isOpen || isMinimized) {
    return (
      <div className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-4 z-50 sm:right-6">
        <Button
          onClick={() => {
            setIsOpen(true)
            setIsMinimized(false)
          }}
          aria-label={isMinimized ? "Expand chat" : "Open chat"}
          className="rounded-full w-14 h-14 bg-amber-600 hover:bg-amber-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 sm:inset-x-auto sm:bottom-6 sm:right-6">
      <Card className="ml-auto flex h-[min(500px,calc(100dvh_-_1.5rem_-_env(safe-area-inset-bottom)))] w-full max-w-[360px] flex-col gap-0 overflow-hidden rounded-2xl border border-gray-200 bg-white py-0 shadow-2xl sm:h-[min(460px,calc(100dvh_-_3rem))]">
        <CardHeader className="flex shrink-0 flex-row items-center justify-between gap-3 rounded-t-2xl bg-amber-600 px-4 py-3 text-white sm:px-5">
          <CardTitle className="flex min-w-0 items-center gap-3 text-base font-semibold">
            <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="min-w-0 leading-tight">Godavari Delights Assistant</span>
          </CardTitle>
          <div className="flex shrink-0 items-center gap-2">
            <Badge variant="secondary" className="border-0 bg-amber-500 text-xs text-white">
              Online
            </Badge>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Minimize chat"
              onClick={() => setIsMinimized(true)}
              className="h-9 w-9 text-white hover:bg-amber-700 hover:text-white"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
              className="h-9 w-9 text-white hover:bg-amber-700 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white p-0">
            <div
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
              className="flex min-h-0 flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto overscroll-contain bg-white px-4 py-4 sm:px-5"
            >
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] break-words whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed sm:text-[15px] ${
                      message.sender === "user"
                        ? "rounded-br-md bg-amber-600 text-white"
                        : "rounded-bl-md bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.message}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start" aria-label="Assistant is typing">
                  <div className="flex gap-1 rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:100ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:200ms]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length <= 1 && (
              <div className="max-h-28 shrink-0 overflow-y-auto border-t border-gray-100 bg-gray-50/80 px-4 py-2.5 sm:px-4">
                <p className="mb-2 text-xs font-medium text-gray-500">Quick questions</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question) => (
                    <Button
                      key={question}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickQuestion(question)}
                      disabled={isTyping}
                      className="h-auto max-w-full whitespace-normal rounded-full border-gray-200 bg-white px-3 py-2 text-left text-xs leading-snug text-gray-700 shadow-sm hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <form
              onSubmit={(event) => {
                event.preventDefault()
                void handleSendMessage()
              }}
              className="flex shrink-0 items-center gap-2 border-t border-gray-200 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4"
            >
              <Input
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}
                placeholder="Type your message..."
                aria-label="Type your message"
                autoComplete="off"
                className="h-11 min-w-0 flex-1 rounded-xl border-gray-300 bg-white text-base text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/30"
                disabled={isTyping}
              />
              <Button
                type="submit"
                size="icon"
                aria-label="Send message"
                disabled={!inputMessage.trim() || isTyping}
                className="h-11 w-11 shrink-0 rounded-xl bg-amber-600 text-white hover:bg-amber-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
        </CardContent>
      </Card>
    </div>
  )
}
