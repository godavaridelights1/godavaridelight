import type { ChatMessage } from "./types"

export class ChatbotService {
  private static messages: ChatMessage[] = []

  // Mock AI responses for the Putharekulu website
  private static responses: Record<string, string[]> = {
    greeting: [
      "Hello! Welcome to Atreyapuram Putharekulu! How can I help you today?",
      "Hi there! I'm here to help you with any questions about our traditional sweets.",
      "Welcome! I'm your virtual assistant. What would you like to know about our Putharekulu?",
    ],
    products: [
      "We offer a variety of traditional Putharekulu including Classic, Premium, Sugar-free, and Festival Special varieties. Each is made with authentic ingredients and traditional methods.",
      "Our product range includes different flavors and packaging options. Would you like to know about any specific variety?",
      "We have Classic Putharekulu (₹250/kg), Premium Gift Box (₹450), Sugar-free variety (₹320/kg), and Festival Special (₹380/kg). Which one interests you?",
    ],
    ingredients: [
      "Our Putharekulu is made with pure rice flour, jaggery, ghee, and traditional spices. We use only natural ingredients without any artificial preservatives.",
      "All our sweets are made with premium quality rice flour, organic jaggery, pure cow ghee, and aromatic spices sourced from local farmers.",
      "We use traditional ingredients: fine rice flour, unrefined jaggery, pure ghee, cardamom, and other natural spices. No artificial colors or preservatives are added.",
    ],
    shipping: [
      "We offer free shipping on orders above ₹500. Standard delivery takes 2-3 business days, and express delivery is available for same-day or next-day delivery.",
      "Shipping is free for orders over ₹500. We deliver across India with standard (2-3 days) and express (1-2 days) options available.",
      "We provide nationwide shipping. Orders above ₹500 get free delivery. Express shipping available for urgent orders.",
    ],
    orders: [
      "You can place orders through our website, and we accept all major payment methods including UPI, cards, and net banking. Orders are processed within 24 hours.",
      "To place an order, simply browse our products, add items to cart, and proceed to checkout. We'll prepare your order fresh and ship it within 24 hours.",
      "Orders can be placed online with secure payment options. We prepare everything fresh and ship within 1 business day.",
    ],
    festivals: [
      "We have special festival collections for Diwali, Dussehra, and other occasions. Our festival gift boxes are perfect for gifting and come with premium packaging.",
      "Our festival specials include beautifully packaged gift boxes, bulk order discounts, and custom packaging options for corporate gifting.",
      "Festival collections feature premium packaging, special varieties, and gift options. Perfect for Diwali, weddings, and other celebrations.",
    ],
    about: [
      "Atreyapuram Putharekulu has been serving authentic traditional sweets since 1950. We're a family business with three generations of sweet-making expertise.",
      "We're a traditional sweet shop from Atreyapuram with over 70 years of experience. Our recipes have been passed down through generations.",
      "Founded in 1950, we specialize in authentic Putharekulu made using traditional methods and family recipes passed down through generations.",
    ],
    contact: [
      "You can reach us at contact@atpu.in or call us at +91-9876543210. We're available Monday to Saturday, 9 AM to 7 PM.",
      "Contact us via email at contact@atpu.in or phone +91-9876543210. Our customer service team is ready to help you.",
      "For any queries, email us at contact@atpu.in or call +91-9876543210. We respond to all inquiries within 24 hours.",
    ],
    default: [
      "I'm here to help you with information about our Putharekulu products, ingredients, shipping, orders, and more. What would you like to know?",
      "I can assist you with product information, pricing, ingredients, shipping details, and order placement. How can I help?",
      "Feel free to ask me about our products, ingredients, delivery options, festival specials, or anything else about Atreyapuram Putharekulu!",
    ],
  }

  static generateResponse(userMessage: string): string {
    const message = userMessage.toLowerCase()

    // Simple keyword matching for demo purposes
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return this.getRandomResponse("greeting")
    } else if (message.includes("product") || message.includes("variety") || message.includes("type")) {
      return this.getRandomResponse("products")
    } else if (message.includes("ingredient") || message.includes("made") || message.includes("contain")) {
      return this.getRandomResponse("ingredients")
    } else if (message.includes("shipping") || message.includes("delivery") || message.includes("ship")) {
      return this.getRandomResponse("shipping")
    } else if (message.includes("order") || message.includes("buy") || message.includes("purchase")) {
      return this.getRandomResponse("orders")
    } else if (message.includes("festival") || message.includes("gift") || message.includes("diwali")) {
      return this.getRandomResponse("festivals")
    } else if (message.includes("about") || message.includes("history") || message.includes("story")) {
      return this.getRandomResponse("about")
    } else if (message.includes("contact") || message.includes("phone") || message.includes("email")) {
      return this.getRandomResponse("contact")
    } else {
      return this.getRandomResponse("default")
    }
  }

  private static getRandomResponse(category: string): string {
    const responses = this.responses[category] || this.responses.default
    return responses[Math.floor(Math.random() * responses.length)]
  }

  static addMessage(message: string, sender: "user" | "bot", sessionId: string): ChatMessage {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message,
      sender,
      timestamp: new Date(),
      sessionId,
    }
    this.messages.push(newMessage)
    return newMessage
  }

  static getMessages(sessionId: string): ChatMessage[] {
    return this.messages.filter((msg) => msg.sessionId === sessionId)
  }

  static clearMessages(sessionId: string): void {
    this.messages = this.messages.filter((msg) => msg.sessionId !== sessionId)
  }
}
