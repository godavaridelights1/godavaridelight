import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Privacy Policy | Godavari Delights",
  description: "Privacy Policy for Godavari Delights - How we collect, use, and protect your information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-orange-600 mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm">Effective Date: February 2026</p>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mx-auto" />
        </div>

        <div className="prose prose-orange max-w-none space-y-8 text-gray-700">
          <p className="text-base leading-relaxed">
            At <strong>Godavari Delights</strong> ("we", "our", or "us"), we are committed to protecting your privacy.
            This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit
            our website ("Site"). By using our Site, you agree to the terms outlined below.
          </p>

          <Section number="1" title="Information We Collect">
            <p>We may collect the following types of personal and non-personal information:</p>
            <ul>
              <li>Name, email address, phone number</li>
              <li>Billing and shipping address (for orders)</li>
              <li>IP address, browser type, operating system</li>
              <li>Device identifiers and location data</li>
              <li>Pages viewed and interaction data</li>
            </ul>
          </Section>

          <Section number="2" title="How We Collect Information">
            <p>We collect information:</p>
            <ul>
              <li>When you register on our site</li>
              <li>When you place an order or fill out a form</li>
              <li>Through cookies and other tracking technologies</li>
              <li>From third-party services integrated into our Site</li>
            </ul>
          </Section>

          <Section number="3" title="How We Use Your Information">
            <p>We use the collected data to:</p>
            <ul>
              <li>Process transactions and provide services</li>
              <li>Send updates, promotions, and newsletters (if opted in)</li>
              <li>Improve website functionality and user experience</li>
              <li>Prevent fraud and secure our systems</li>
              <li>Comply with legal obligations</li>
            </ul>
          </Section>

          <Section number="4" title="Sharing of Information">
            <p>
              We do not sell or trade your personal data. We may share it with:
            </p>
            <ul>
              <li>Trusted third-party service providers (e.g., payment processors, hosting partners)</li>
              <li>Government or regulatory authorities if required by law</li>
              <li>Legal representatives in case of disputes or investigations</li>
            </ul>
          </Section>

          <Section number="5" title="Cookies and Tracking Technologies">
            <p>We use cookies to:</p>
            <ul>
              <li>Enhance user experience</li>
              <li>Understand visitor behavior</li>
              <li>Store session and login preferences</li>
            </ul>
            <p>
              You may disable cookies through your browser settings, but this may affect website functionality.
            </p>
          </Section>

          <Section number="6" title="Data Security">
            <p>We implement reasonable security measures including:</p>
            <ul>
              <li>SSL encryption</li>
              <li>Regular malware scanning</li>
              <li>Restricted data access</li>
            </ul>
            <p>However, no online method is 100% secure.</p>
          </Section>

          <Section number="7" title="Third-Party Links">
            <p>
              Our Site may contain links to external websites. We are not responsible for their content or privacy
              practices. We recommend reviewing their policies before interacting.
            </p>
          </Section>

          <Section number="8" title="Your Rights">
            <p>
              Depending on your location (e.g., under GDPR or CCPA), you may have rights to:
            </p>
            <ul>
              <li>Access or correct your personal information</li>
              <li>Request data deletion</li>
              <li>Withdraw consent</li>
              <li>Lodge complaints with data protection authorities</li>
            </ul>
            <p>To exercise these rights, please contact us.</p>
          </Section>

          <Section number="9" title="Children's Privacy">
            <p>
              Our website is not intended for individuals under the age of 13. We do not knowingly collect
              information from minors.
            </p>
          </Section>

          <Section number="10" title="Changes to This Policy">
            <p>
              We may update this Privacy Policy at any time. Updates will be posted on this page with a revised
              effective date. Continued use of the Site implies acceptance of the new terms.
            </p>
          </Section>

          <Section number="11" title="Contact Us">
            <p>
              If you have questions about this Privacy Policy or how we handle your data, please contact us at:
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-3 space-y-1">
              <p className="font-semibold text-orange-700">Godavari Delights</p>
              <p>📧 <a href="mailto:Janaenterprise42@gmail.com" className="text-orange-600 hover:underline">Janaenterprise42@gmail.com</a></p>
              <p>📞 <a href="tel:9475099971" className="text-orange-600 hover:underline">9475099971</a></p>
            </div>
          </Section>
        </div>
      </div>
      <Footer />
    </div>
  )
}

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-6">
      <h2 className="text-xl font-bold text-orange-600 mb-3 flex items-center gap-2">
        <span className="bg-orange-100 text-orange-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">
          {number}
        </span>
        {title}
      </h2>
      <div className="text-gray-700 space-y-2 text-sm leading-relaxed [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:space-y-1">
        {children}
      </div>
    </div>
  )
}
