import { Metadata } from "next"
import { PackageCheck, RefreshCcw, CreditCard, Truck } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Return & Refund Policy | Godavari Delights",
  description: "Return, refund, and delivery policy for Godavari Delights orders.",
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-orange-600 mb-3">Return &amp; Refund Policy</h1>
          <p className="text-muted-foreground text-sm">Effective Date: February 2026</p>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 flex flex-col items-center text-center gap-2">
            <RefreshCcw className="h-8 w-8 text-orange-500" />
            <h3 className="font-bold text-orange-700">Returns Accepted</h3>
            <p className="text-xs text-gray-600">Within 7 working days of delivery</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex flex-col items-center text-center gap-2">
            <CreditCard className="h-8 w-8 text-amber-500" />
            <h3 className="font-bold text-amber-700">Refunds Processed</h3>
            <p className="text-xs text-gray-600">Within 7 working days of approval</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex flex-col items-center text-center gap-2">
            <Truck className="h-8 w-8 text-green-500" />
            <h3 className="font-bold text-green-700">Delivery</h3>
            <p className="text-xs text-gray-600">5–6 working days after order</p>
          </div>
        </div>

        <div className="space-y-6 text-gray-700">

          {/* Return Policy */}
          <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
              <RefreshCcw className="h-5 w-5" />
              Return, Exchange &amp; Replacement Policy
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                We accept <strong>returns, exchanges, replacements, and damaged product claims</strong> within{" "}
                <strong className="text-orange-600">7 working days</strong> from the date of delivery.
              </p>
              <div className="bg-orange-50 rounded-lg p-4 space-y-2">
                <p className="font-semibold text-orange-700">Eligible reasons for return:</p>
                <ul className="list-disc ml-5 space-y-1 text-gray-600">
                  <li>Product received in damaged condition</li>
                  <li>Wrong item delivered</li>
                  <li>Product quality issue</li>
                  <li>Exchange for a different product</li>
                </ul>
              </div>
              <p>
                Once the returned product is received and inspected, we will <strong>replace the item within
                5–6 working days</strong>.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                <strong>Note:</strong> Items must be unused and in original packaging where possible. Please
                contact us within the return window with your order number and reason for return.
              </div>
            </div>
          </div>

          {/* Refund Policy */}
          <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Refund Policy
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Once your refund is approved by our team, we will credit the refund amount to your original payment
                method within <strong className="text-orange-600">7 working days</strong>.
              </p>
              <div className="bg-orange-50 rounded-lg p-4 space-y-2">
                <p className="font-semibold text-orange-700">Refund process:</p>
                <ol className="list-decimal ml-5 space-y-1 text-gray-600">
                  <li>Contact us with your order number and refund reason</li>
                  <li>Our team reviews and approves the refund request</li>
                  <li>Refund is credited within 7 working days of approval</li>
                </ol>
              </div>
              <p className="text-xs text-gray-500">
                Refunds are processed back to the original payment method. Bank processing time may vary.
              </p>
            </div>
          </div>

          {/* Delivery Policy */}
          <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Delivery Policy
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Orders will be delivered within <strong className="text-orange-600">5–6 working days</strong> from
                the date of order placement.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-1 text-xs text-green-800">
                <p><strong>Working days:</strong> Monday to Saturday (excluding public holidays)</p>
                <p><strong>Delivery area:</strong> Pan India</p>
                <p><strong>Tracking:</strong> You will receive a tracking number once your order is shipped</p>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
              <PackageCheck className="h-5 w-5" />
              Seller Information
            </h2>
            <div className="space-y-1 text-sm">
              <p><span className="font-semibold">Name:</span> ELIASUR RAHMAN BABOR</p>
              <p><span className="font-semibold">Business:</span> SmartPlaza</p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-orange-700 mb-3">Need Help?</h2>
            <p className="text-sm text-gray-700 mb-3">
              For any return, refund, or delivery queries, please contact us:
            </p>
            <div className="space-y-1 text-sm">
              <p>📧 <a href="mailto:Janaenterprise42@gmail.com" className="text-orange-600 hover:underline">Janaenterprise42@gmail.com</a></p>
              <p>📞 <a href="tel:9475099971" className="text-orange-600 hover:underline">9475099971</a></p>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  )
}
