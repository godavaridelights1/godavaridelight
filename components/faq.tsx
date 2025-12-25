"use client"

import { useState } from "react"
import { FadeInSection } from "@/components/fade-in-section"
import { ChevronDown } from "lucide-react"

interface FAQItem {
  id: string
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    id: "faq-1",
    question: "What is Pootharekulu or Putharekulu?",
    answer:
      "Pootharekulu, also known as Putharekulu or Paper Sweet, is an authentic Indian sweet delicacy from Atreyapuram village in Andhra Pradesh. It's made by rolling rice starch batter into thin sheets and layering them with a delicious filling of powdered sugar, ghee (clarified butter), and sometimes dry fruits. These delicate rolls are sun-dried to create a crispy, flaky treat with a sweet, buttery taste that melts in your mouth. It's a true symbol of Andhra Pradesh's culinary heritage and has become famous across India.",
  },
  {
    id: "faq-2",
    question: "How is Godavari Delights Pootharekulu made?",
    answer:
      "At Godavari Delights, our Pootharekulu is crafted through a meticulous traditional process. First, we grind rice into a fine powder and prepare a smooth batter. This batter is spread thinly on heated surfaces to create delicate sheets. Each sheet is carefully filled with our special blend of premium ingredients - powdered sugar or jaggery, pure ghee, and handpicked dry fruits. The layers are then rolled together and left to sun-dry naturally, resulting in the perfect balance of crispness and flavor that makes our Pootharekulu truly exceptional.",
  },
  {
    id: "faq-3",
    question: "What varieties of Pootharekulu does Godavari Delights offer?",
    answer:
      "Godavari Delights offers a wide range of Pootharekulu varieties to suit every palate. Our collection includes Traditional Pootharekulu with pure ghee and jaggery, Cashew Pootharekulu with crunchy cashews, Almond and Pistachio Pootharekulu for dry fruit lovers, and special combinations like our Premium Mixed Dry Fruits Pootharekulu. We also offer Sugar-Free Pootharekulu for health-conscious customers. Each variety is crafted with the same dedication to quality and authenticity, ensuring a delightful experience with every bite.",
  },
  {
    id: "faq-4",
    question: "What makes Godavari Delights Pootharekulu special?",
    answer:
      "What sets Godavari Delights apart is our commitment to quality, tradition, and empowerment. Our Pootharekulu is 1.5x bigger and heavier than standard offerings, 3x more nutritious with premium ingredients, and 5x more delicious thanks to our secret family recipes passed down through generations. We use only pure ghee, natural jaggery, and the finest dry fruits. Most importantly, every purchase supports over 500 skilled women artisans from Atreyapuram, helping them achieve financial independence and self-reliance.",
  },
  {
    id: "faq-5",
    question: "How should I store Godavari Delights Pootharekulu?",
    answer:
      "For optimal freshness and taste, store your Godavari Delights Pootharekulu in an airtight container in a cool, dry place away from direct sunlight and humidity. When stored properly, our Pootharekulu maintains its crispness and delicious flavor for several weeks. We recommend consuming it within 30 days of delivery for the best experience. Keep it away from moisture and strong odors, and avoid storing near heating sources.",
  },
  {
    id: "faq-6",
    question: "Where can I buy Godavari Delights Pootharekulu?",
    answer:
      "You can conveniently purchase Godavari Delights Pootharekulu directly from our website at godavaridelights.in. We offer a wide selection of varieties and pack sizes delivered right to your doorstep anywhere in India. Our user-friendly platform makes ordering easy, with secure payment options and reliable, fast delivery. Simply browse our product collection, select your favorite varieties, and enjoy authentic, freshly prepared Pootharekulu from the comfort of your home.",
  },
  {
    id: "faq-7",
    question: "Do you deliver across India?",
    answer:
      "Yes, absolutely! Godavari Delights delivers authentic Pootharekulu across all of India, including major cities like Hyderabad, Bangalore, Chennai, Mumbai, Delhi, Pune, and many more. We ensure that our products are carefully packaged and delivered fresh to your doorstep, maintaining the highest quality standards. Whether you're in a metro city or a smaller town, we're committed to bringing the authentic taste of Atreyapuram to your home.",
  },
  {
    id: "faq-8",
    question: "What are the key ingredients in Pootharekulu?",
    answer:
      "At Godavari Delights, we use only the finest ingredients to craft our Pootharekulu. The main ingredients include premium rice (for the sheets), pure ghee (clarified butter), natural jaggery or pure sugar (depending on the variety), and carefully selected dry fruits like cashews, almonds, and pistachios. All our ingredients are sourced to ensure the highest quality and nutritional value. We never use artificial preservatives, colors, or flavors - just pure, natural goodness in every piece.",
  },
  {
    id: "faq-9",
    question: "Is Godavari Delights Pootharekulu suitable for diabetics?",
    answer:
      "We offer a special Sugar-Free Pootharekulu variety made with natural sugar substitutes, making it a suitable option for diabetics and health-conscious consumers. This variety maintains the same authentic taste and texture of our traditional Pootharekulu while being lower in glycemic impact. However, we recommend consulting with your healthcare provider before consumption. Each product is carefully prepared to ensure it meets dietary requirements while delivering the delicious Pootharekulu experience you love.",
  },
  {
    id: "faq-10",
    question: "What is the price range of Godavari Delights Pootharekulu?",
    answer:
      "Godavari Delights Pootharekulu is offered at affordable prices starting from ₹349 for a standard box (approximately 300 grams with 10 pieces). We believe in providing exceptional quality at reasonable prices, ensuring that authentic, artisan-made Pootharekulu is accessible to everyone. Our pricing varies based on the variety and pack size - from traditional to premium dry fruit combinations. Visit our website to explore all available options and find the perfect choice that fits your budget and preferences.",
  },
]

export function FAQ() {
  const [expandedId, setExpandedId] = useState<string | null>("faq-1")

  const toggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white via-orange-50/10 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-200 to-transparent opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-200 to-transparent opacity-10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <FadeInSection>
          <div className="text-center space-y-4 mb-16">
            <div className="inline-block">
              <span className="text-sm font-semibold text-orange-600 bg-orange-100/50 px-4 py-2 rounded-full border border-orange-200">
                ❓ FREQUENTLY ASKED QUESTIONS
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
              Everything You Need to Know
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions about our authentic Godavari Delights Pootharekulu? Find answers to common questions below.
            </p>
          </div>
        </FadeInSection>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <FadeInSection key={item.id} delay={index * 50}>
                <div className="group">
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full"
                  >
                    <div
                      className={`w-full transition-all duration-500 rounded-xl border-2 p-6 text-left ${
                        expandedId === item.id
                          ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-400 shadow-lg"
                          : "bg-white border-gray-200 hover:border-orange-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3
                          className={`text-lg font-bold transition-colors duration-300 ${
                            expandedId === item.id
                              ? "text-orange-700"
                              : "text-gray-900 group-hover:text-orange-600"
                          }`}
                        >
                          {item.question}
                        </h3>
                        <div
                          className={`flex-shrink-0 transition-all duration-500 ${
                            expandedId === item.id ? "rotate-180" : ""
                          }`}
                        >
                          <ChevronDown
                            className={`h-6 w-6 transition-colors duration-300 ${
                              expandedId === item.id
                                ? "text-orange-600"
                                : "text-gray-600 group-hover:text-orange-600"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Answer */}
                      <div
                        className={`transition-all duration-500 overflow-hidden ${
                          expandedId === item.id
                            ? "max-h-96 opacity-100 mt-4"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="border-t border-orange-200 pt-4">
                          <p className="text-gray-700 leading-relaxed text-base">
                            {item.answer}
                          </p>
                        </div>
                      </div>

                      {/* Animated accent line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                    </div>
                  </button>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <FadeInSection delay={600}>
          <div className="mt-16 text-center">
            <div className="p-8 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 rounded-3xl border-2 border-orange-200/50 backdrop-blur-sm">
              <p className="text-lg text-gray-800 font-medium mb-4">
                Still have questions? We're here to help!
              </p>
              <p className="text-gray-600">
                Contact us at <span className="font-semibold text-orange-700">info@godavaridelights.in</span> or visit our website for more information.
              </p>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}
