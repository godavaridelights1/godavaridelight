import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "No Returns & No Refunds | Godavari Delights",
  description: "Godavari Delights order returns, refunds, and delivery policy.",
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-4xl px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-bold text-orange-600 sm:text-4xl">
            No Returns &amp; No Refunds
          </h1>
          <p className="text-sm text-muted-foreground">Order Policy</p>
        </header>

        <div className="space-y-6 text-gray-700">
          <section className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold text-orange-600">All Sales Are Final</h2>
            <p className="text-sm leading-relaxed">
              We do not accept returns, exchanges, or refunds for orders. Please review your items and order
              details carefully before completing your purchase.
            </p>
          </section>

          <section className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold text-orange-600">Delivery</h2>
            <p className="text-sm leading-relaxed">
              Orders are delivered across India. Delivery usually takes 5–6 working days after the order is
              placed. A tracking number is provided once your order has shipped.
            </p>
          </section>

          <section className="rounded-xl border border-orange-200 bg-orange-50 p-6">
            <h2 className="mb-3 text-lg font-bold text-orange-700">Need Help?</h2>
            <p className="text-sm text-gray-700">
              For questions about an order, please{" "}
              <Link href="/contact" className="font-medium text-orange-600 hover:underline">
                contact us
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
