"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"

interface ProductFAQItem {
  id: string
  question: string
  answer: string
}

interface ProductFAQProps {
  productName: string
  faqs?: ProductFAQItem[]
}

export function ProductFAQ({ productName, faqs }: ProductFAQProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Default FAQs if none provided
  const defaultFAQs: ProductFAQItem[] = [
    {
      id: "faq-1",
      question: `What makes this ${productName} special?`,
      answer: `Our ${productName} is handmade using traditional methods passed down through generations. Each piece is carefully crafted by skilled artisans in Atreyapuram village, ensuring authentic taste and texture. Made with the finest ingredients including pure ghee and natural jaggery, with no artificial preservatives or colors.`,
    },
    {
      id: "faq-2",
      question: "What is the shelf life of this product?",
      answer:
        "When stored in an airtight container in a cool, dry place away from direct sunlight and humidity, our product maintains its freshness and delicious flavor for 30-45 days. For best taste experience, we recommend consuming within 30 days of purchase.",
    },
    {
      id: "faq-3",
      question: "Are there any artificial preservatives used?",
      answer:
        "No, absolutely not. We use only natural ingredients - pure ghee, natural jaggery or sugar, rice flour, and carefully selected dry fruits. Our products are free from artificial preservatives, colors, and flavors.",
    },
    {
      id: "faq-4",
      question: "Is this product suitable for vegetarians?",
      answer:
        "Yes, our products are 100% vegetarian and FSSAI approved. We use only pure ingredients with no animal products other than ghee, which is derived from milk butter.",
    },
    {
      id: "faq-5",
      question: "Can I gift this to someone?",
      answer:
        "Absolutely! Our products come beautifully packaged and are perfect for gifting during festivals, celebrations, or special occasions. We also offer special gift hampers and customized packaging options.",
    },
    {
      id: "faq-6",
      question: "How should I store this product?",
      answer:
        "Store in an airtight container in a cool, dry place away from direct sunlight, heat, and humidity. Keep it away from strong odors. Do not refrigerate. Room temperature storage is ideal for maintaining the authentic texture and taste.",
    },
    {
      id: "faq-7",
      question: "Is this product suitable for people with dietary restrictions?",
      answer:
        "While our products are vegetarian and contain no artificial additives, they do contain nuts and may contain traces of other tree nuts. If you have specific allergies or dietary restrictions, please check the ingredients list or contact our support team.",
    },
    {
      id: "faq-8",
      question: "What is your return and exchange policy?",
      answer:
        "We offer a hassle-free 7-day return policy. If you receive a defective product or if it doesn't meet your expectations, you can return it for a full refund or replacement. Please ensure the product is in its original packaging.",
    },
  ]

  const displayFAQs = faqs || defaultFAQs

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="h-6 w-6 text-orange-600" />
        <h3 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h3>
      </div>

      <div className="space-y-3">
        {displayFAQs.map((item) => (
          <div key={item.id} className="group">
            <button
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="w-full"
            >
              <div
                className={`w-full transition-all duration-300 rounded-lg border-2 p-4 text-left ${
                  expandedId === item.id
                    ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-400"
                    : "bg-white border-gray-200 hover:border-orange-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4
                    className={`font-semibold transition-colors duration-300 ${
                      expandedId === item.id ? "text-orange-700" : "text-gray-900 group-hover:text-orange-600"
                    }`}
                  >
                    {item.question}
                  </h4>
                  <div
                    className={`flex-shrink-0 transition-all duration-300 ${
                      expandedId === item.id ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown
                      className={`h-5 w-5 transition-colors duration-300 ${
                        expandedId === item.id
                          ? "text-orange-600"
                          : "text-gray-600 group-hover:text-orange-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Answer */}
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    expandedId === item.id ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="border-t border-orange-200 pt-3">
                    <p className="text-gray-700 leading-relaxed text-sm">{item.answer}</p>
                  </div>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Contact Info */}
      <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
        <p className="text-sm text-gray-800">
          <span className="font-semibold text-orange-700">Didn't find your answer?</span>
Contact us through contact page.
        </p>
      </div>
    </div>
  )
}
