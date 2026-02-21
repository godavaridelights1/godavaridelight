import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Terms & Conditions | Godavari Delights",
  description: "Terms and Conditions for using Godavari Delights website and services.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-orange-600 mb-3">Terms &amp; Conditions</h1>
          <p className="text-muted-foreground text-sm">Effective Date: February 2026</p>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mx-auto" />
        </div>

        <div className="space-y-6 text-gray-700">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 text-sm leading-relaxed">
            Welcome to <strong>Godavari Delights</strong> ("we", "us", or "our"). Please read these Terms and Conditions
            ("Terms") carefully before using our website or any of our services (collectively, the "Service").
            <br /><br />
            By accessing or using our Service, you agree to be bound by these Terms. If you do not agree with any
            part of the Terms, then you may not access the Service.
          </div>

          <Section number="1" title="Use of the Service">
            <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You must not:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Attempt to interfere with the operation of the Service</li>
            </ul>
          </Section>

          <Section number="2" title="Intellectual Property">
            <p>
              All content included in the Service, such as text, graphics, logos, images, and software, is the property
              of Godavari Delights or its licensors and is protected by intellectual property laws. You may not
              reproduce, modify, or distribute any content without our prior written permission.
            </p>
          </Section>

          <Section number="3" title="User Accounts">
            <p>
              To access certain features, you may be required to create an account. You are responsible for maintaining
              the confidentiality of your account credentials and for all activities under your account.
            </p>
          </Section>

          <Section number="4" title="Termination">
            <p>
              We reserve the right to suspend or terminate your access to the Service at our sole discretion, without
              notice or liability, for conduct that we believe violates these Terms or is harmful to other users or us.
            </p>
          </Section>

          <Section number="5" title="Limitation of Liability">
            <p>
              To the fullest extent permitted by law, Godavari Delights shall not be liable for any indirect,
              incidental, or consequential damages arising out of or related to your use of the Service.
            </p>
          </Section>

          <Section number="6" title="Disclaimer">
            <p>
              The Service is provided on an "as is" and "as available" basis. We do not warrant that the Service will
              be uninterrupted, error-free, or secure.
            </p>
          </Section>

          <Section number="7" title="Changes to These Terms">
            <p>
              We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes
              by posting the new Terms on this page with an updated effective date. Your continued use of the Service
              after changes are posted constitutes your acceptance of the new Terms.
            </p>
          </Section>

          <Section number="8" title="Governing Law">
            <p>
              These Terms shall be governed and construed in accordance with the laws of <strong>India</strong>.
            </p>
          </Section>

          <Section number="9" title="Contact Us">
            <p>If you have any questions about these Terms, please contact us at:</p>
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
