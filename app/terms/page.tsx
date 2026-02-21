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
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-orange-600 mb-3">Terms &amp; Conditions</h1>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mx-auto" />
        </div>

        <div className="space-y-6 text-gray-700 text-sm leading-relaxed">

          {/* Preamble */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
            <p>
              This document is a computer-generated electronic record published in terms of Rule 3 of the Information
              Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 read with Information
              Technology Act, 2000 and does not require any physical or digital signatures.
            </p>
            <p className="mt-3">
              These Terms and Conditions (&ldquo;Terms&rdquo;) constitute a legal agreement between You and Razorpay Software
              Private Limited (&ldquo;Razorpay&rdquo;). The Terms govern Your access to and use of Razorpay services, including
              payments, technology, software, analytics or any other services, tools or products offered by Razorpay
              and/or its Affiliates (&ldquo;Services&rdquo;). Please read these Terms carefully before accessing the Platform or
              using the Services.
            </p>
          </div>

          {/* PART A */}
          <PartHeading>PART A: GENERAL TERMS AND CONDITIONS</PartHeading>

          <Section title="1. Proprietary Rights">
            <p>
              We (and our licensors) remain the sole owner of all right, title and interest in the Services, including
              the Platform and the website www.razorpay.com, including any intellectual property rights which subsist
              in the Services. Razorpay grants You a personal, non-exclusive, non-transferable, limited right to access
              the Platform and make personal use of the website and the Services.
            </p>
            <p>
              You shall not remove, obscure, or alter any proprietary rights notices. You shall not download, copy,
              create a derivative work, modify, reverse engineer, reverse assemble, transmit or otherwise attempt to
              discover any source code, sell, assign, sub-license, or transfer any right in the Services or marks.
            </p>
            <p>
              You grant a royalty-free, non-exclusive, irrevocable, transferable and sub-licensable license to
              Razorpay, its Affiliates and third party service providers, to use Your data, Your customer&rsquo;s data,
              information, content, trademarks, logos and any other materials You upload or make available on the
              Platform (&ldquo;Your materials&rdquo;) to operate and improve the Platform, provide the Services, and fulfil
              Razorpay&rsquo;s obligations under the Terms.
            </p>
          </Section>

          <Section title="2. Usage of the Website and Services">
            <p>
              You shall register only if You are 18 years or above and can enter into binding contracts as per
              Applicable Laws. You are responsible for maintaining the confidentiality of Your login information and
              secure access credentials. You are responsible for all activities that occur under Your account.
            </p>
            <p>
              You agree to provide true, accurate, current and complete information. If any information is untrue or
              inaccurate, Razorpay has the right to immediately suspend or terminate Your account.
            </p>
            <p>
              By using the Services and providing your contact information, you consent to receiving information about
              products and services from Razorpay, its Affiliates or third parties through telephone, SMS, email,
              WhatsApp, or other channels. You explicitly waive any registration under Do Not Disturb (DND) or
              National Customer Preference Register (NCPR) under TRAI regulations.
            </p>
            <p>
              You acknowledge and agree that for undertaking any payment/financial transaction through the Platform,
              Razorpay may undertake due diligence measures and seek KYC information. You are solely responsible for
              complying with all Applicable Laws, including RBI Guidelines on Regulation of Payment Aggregators,
              Payment and Settlement Systems Act 2007, Prevention of Money Laundering Act 2002.
            </p>
            <p>
              You agree that Razorpay shall not be responsible for any delivery, after-sales service, payment,
              invoicing, customer enquiries, technical support, or any other obligations relating to Your products or
              services. Such obligations shall be Your sole responsibility.
            </p>
            <p>
              You agree not to use the Platform and/or Services for any purpose that is unlawful, illegal or forbidden
              by these Terms or any local laws. You are prohibited from posting or transmitting: unlawful, threatening,
              obscene, or pornographic content; content that infringes intellectual property rights; software viruses;
              or content that threatens the unity or sovereignty of India.
            </p>
          </Section>

          <Section title="3. Payment">
            <p>
              Applicable fees for the provision of Services shall be levied by Razorpay from time to time. Fees are
              exclusive of applicable taxes. Razorpay reserves the right to update fees at its sole discretion.
              Razorpay fees include zero MDR for Rupay Debit Cards and UPI transactions.
            </p>
            <p>
              Razorpay will raise monthly invoices for fees charged. Any dispute in respect of an invoice must be
              communicated within ten (10) days from the date of the invoice. You shall be responsible to do
              reconciliation on a daily basis for all transactions processed; discrepancies must be reported within
              three (3) days upon receipt of funds.
            </p>
            <p>
              You shall be solely responsible for updating Your GST registration number on the Razorpay dashboard
              before invoice generation. Any liability raised on Razorpay by GST authorities due to incorrect
              information provided by You shall be recovered from You.
            </p>
          </Section>

          <Section title="4. Privacy Policy">
            <p>
              By using the website, You hereby consent to the use of Your information as outlined in our{" "}
              <a href="/privacy-policy" className="text-orange-600 hover:underline">Privacy Policy</a>.
            </p>
          </Section>

          <Section title="5. Third Party Links / Offers">
            <p>
              The Platform contains links to other websites over which we have no control. Razorpay is not responsible
              for the terms and conditions, privacy policies or practices of other websites. Your interaction with any
              third party accessed through the website is at Your own risk.
            </p>
          </Section>

          <Section title="6. Our Partners">
            <p>
              This Platform also offers You access to information about certain financial products/services including
              loan facility, credit cards facility, investment services such as current accounts offered by our lending
              partners.
            </p>
          </Section>

          <Section title="7. Disclaimer of Warranty">
            <p>
              To the maximum extent permitted by Applicable Laws, the Platform and the Services are provided on an
              &ldquo;as is&rdquo; basis. You acknowledge that Razorpay does not warrant that the Service(s) will be uninterrupted
              or error free or fit for Your specific business purposes.
            </p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>
              Razorpay (including its officers, directors, employees, representatives, affiliates, and providers) will
              not be responsible or liable for any injury, death, loss, claim, accident, delay, or any direct, special,
              exemplary, punitive, indirect, incidental or consequential damages of any kind (including lost profits or
              lost savings), whether based in contract, tort, strict liability or otherwise, arising out of or connected
              with use of or inability to use the Platform.
            </p>
            <p>
              Notwithstanding anything under these Terms, Razorpay&rsquo;s aggregate liability relating to the Service(s)
              will not exceed an amount equal to one (1) month fees paid by You for the specific Service(s) giving
              rise to the liability.
            </p>
          </Section>

          <Section title="9. Indemnity">
            <p>
              You agree to indemnify and hold Razorpay (and its officers, affiliates, group company, directors, agents
              and employees) harmless from any and against all claims, causes of action, demands, recoveries, losses,
              damages, fines, penalties or other costs or expenses of any kind or nature, including reasonable
              attorneys&rsquo; fees, arising out of or related to Your breach of these Terms, Your violation of any
              Applicable Laws or the rights of a third party, or Your use of the Platform.
            </p>
          </Section>

          <Section title="10. Card Association Rules">
            <p>
              &ldquo;Card Payment Network Rules&rdquo; refer to the written rules, regulations, releases, guidelines and other
              requirements imposed and adopted by card payment networks. These networks require You to comply with all
              applicable guidelines, rules, and regulations formulated by them. The card payment networks reserve the
              right to amend their guidelines from time to time.
            </p>
            <p>
              In the event Your non-compliance results in any fines or penalties being levied on Razorpay by a card
              payment network, You shall forthwith reimburse Razorpay in an amount equal to such fines, penalties or
              other amounts. Failure to comply may result in suspension or termination of Services.
            </p>
          </Section>

          <Section title="11. Waiver">
            <p>
              Razorpay shall not be deemed to have waived any right or provision of this Agreement unless such waiver
              is made in writing. A waiver of any term or condition shall not be deemed a waiver of any other term or
              condition, nor shall it be a continuing waiver.
            </p>
          </Section>

          <Section title="12. Force Majeure">
            <p>
              If performance by Razorpay is prevented, restricted, delayed or interfered with by reason of labour
              disputes, strikes, acts of God, epidemic, pandemic, floods, lightning, severe weather, shortages of
              materials, utility or communication failures, earthquakes, war, revolution, acts of terrorism, civil
              commotion, acts of public enemies, blockade, embargo, or any law, order, proclamation, regulation, or
              ordinance having legal effect of any government or regulatory or judicial authority, or any other act
              beyond the reasonable control of Razorpay, then Razorpay shall be excused and discharged from such
              performance to the extent of and during the period of such force majeure event.
            </p>
          </Section>

          <Section title="13. Anti Bribery and Sanctions Laws">
            <p>
              You agree to comply with all applicable anti-bribery and anti-corruption laws which prohibit officials,
              representatives, agents or any other person associated with or acting on behalf of You from giving,
              offering, promising to offer, receiving or accepting anything of value (either directly or indirectly) to
              government officials, public servants, regulatory bodies, judicial authorities, or any other third party
              in order to obtain an improper commercial advantage of any kind.
            </p>
          </Section>

          <Section title="14. Additional Terms">
            <p>
              You shall not assign or otherwise transfer Your rights or obligations under these Terms. Razorpay may
              assign its rights and duties without any such assignment being considered a change to the Terms.
            </p>
            <p>
              The laws of India, without regard to its conflict of laws rules, will govern these Terms. Any legal
              action must be filed only in the courts located in Bangalore, India.
            </p>
            <p>
              Razorpay reserves the right to set-off by whatever means the whole or any part of Your liability to
              Razorpay against any funds, sums or other amounts credited to, or owing to, You under these Terms.
              Razorpay may exercise the right of set-off at any time, without any prior notice to You.
            </p>
            <p>
              An end user may avail dynamic currency conversion (&ldquo;DCC&rdquo;) services made available by Razorpay. The
              transaction amount payable by the end user shall be inclusive of charges for such DCC services. An end
              user may reach out to{" "}
              <a href="mailto:dcc_invoice@razorpay.com" className="text-orange-600 hover:underline">dcc_invoice@razorpay.com</a>{" "}
              for DCC transaction invoices.
            </p>
          </Section>

          <Section title="15. Advertising">
            <p>
              Some of the Services may be supported by advertising revenue and may display advertisements and
              promotional material. These advertisements may be targeted to the content of information stored on the
              Services. The manner, mode and extent of advertising by Razorpay are subject to change without specific
              notice to You.
            </p>
          </Section>

          <Section title="16. Suspension and Termination">
            <p>Razorpay shall have the right to immediately suspend Services and settlement of any monies to You without any liability in the event of:</p>
            <ul>
              <li>You breach any clause of these Terms</li>
              <li>You facilitate any unlawful transaction or transaction involving Prohibited Products and Services</li>
              <li>Razorpay receives instructions from Facility Providers, governmental authorities, or law enforcement agencies</li>
              <li>Transactions have a high-risk score per Razorpay&rsquo;s internal fraud assessment tools</li>
              <li>Suspicious circumstances surrounding Your activities</li>
              <li>Pending, anticipated, or excessive disputes, refunds, or reversals</li>
              <li>Your products/services infringe, or are suspected of infringing, intellectual property rights</li>
              <li>You materially change the type of products/services without Razorpay&rsquo;s prior written permission</li>
              <li>Razorpay determines Your activities expose it to unacceptable risks</li>
              <li>Regulatory changes impacting the Services</li>
            </ul>
            <p className="mt-2">
              These Terms are effective upon the date You first access or use the Platform and continue until terminated
              by You or Razorpay. We may terminate these Terms or close Your Razorpay account at any time for any reason.
              Termination does not immediately relieve You of obligations incurred under these Terms.
            </p>
          </Section>

          <Section title="17. Prohibited Products and Services">
            <p>The following products/services are prohibited on this Platform:</p>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Adult goods and services including pornography and escort/prostitution services</li>
              <li>Alcohol and alcoholic beverages</li>
              <li>Body parts including organs</li>
              <li>Bulk marketing tools enabling unsolicited emails (spam)</li>
              <li>Cable descramblers and black boxes</li>
              <li>Child pornography</li>
              <li>Copyright unlocking devices including mod chips</li>
              <li>Copyrighted media without authorization</li>
              <li>Copyrighted software without authorization (including OEM/bundled software)</li>
              <li>Counterfeit and unauthorized goods including replicas, fake autographs, counterfeit stamps</li>
              <li>Drugs and drug paraphernalia including herbal drugs like salvia and magic mushrooms</li>
              <li>Drug test circumvention aids</li>
              <li>Endangered species and their derivatives</li>
              <li>Gaming/gambling including lottery tickets, sports bets, and online gambling memberships</li>
              <li>Government IDs or documents including fake IDs and passports</li>
              <li>Hacking and cracking materials</li>
              <li>Illegal goods and materials promoting illegal activities</li>
              <li>Miracle cures and unsubstantiated health remedies</li>
              <li>Offensive goods that defame, slander, incite violence, or promote hatred</li>
              <li>Crime scene photos or items associated with criminals</li>
              <li>Pyrotechnic devices, explosives, toxic, flammable, and radioactive materials</li>
              <li>Regulated goods including airbags, mercury batteries, Freon, surveillance equipment, slot machines</li>
              <li>Securities including government bonds or related financial products</li>
              <li>Tobacco and cigarettes including cigars and chewing tobacco</li>
              <li>Traffic devices including radar detectors/jammers and license plate covers</li>
              <li>Weapons including firearms, ammunition, knives, and other armaments</li>
              <li>Wholesale currency and discounted currency exchanges</li>
              <li>Live animals or hides/skins/teeth/nails and other animal parts</li>
              <li>Multi-level marketing collection fees</li>
              <li>Matrix sites using a matrix scheme approach</li>
              <li>Work-at-home information with intent to deceive</li>
              <li>Drop-shipped merchandise</li>
              <li>Any product or service not in compliance with applicable laws and regulations</li>
              <li>Services prone to &ldquo;buy and deny&rdquo; attitudes from cardholders (e.g., adult content, escort services)</li>
              <li>Businesses operating within the scope of ambiguous laws (e.g., web-based telephony, online medicines)</li>
              <li>Businesses banned by law (e.g., betting, gambling, lotteries, games of chance)</li>
              <li>Intangible goods/services businesses involved in pyramid marketing or get-rich-quick schemes</li>
              <li>Mailing lists</li>
              <li>Virtual currency, cryptocurrency and crypto products (NFTs), prohibited investments for commercial gain</li>
              <li>Money laundering services</li>
              <li>Database providers for tele-callers</li>
              <li>Bidding/auction houses</li>
              <li>Activities prohibited by the Telecom Regulatory Authority of India</li>
              <li>Any other activities prohibited by Applicable Laws</li>
              <li>Entities operating as chit funds/nidhi companies (except government or PSU entities)</li>
              <li>Unregulated/unlicensed money service businesses or money and value transfer services</li>
            </ol>
            <p className="mt-2 text-xs text-gray-500">The above list is subject to updates/changes by Razorpay based on instructions received from Facility Providers.</p>
          </Section>

          <Section title="18. Definitions">
            <ul className="space-y-2">
              <li><strong>AD-1 Bank:</strong> A scheduled commercial bank in India authorized to undertake all current and capital account transactions per RBI directions.</li>
              <li><strong>Affiliate:</strong> Any entity that directly or indirectly controls, is controlled by, or is under common control with Razorpay.</li>
              <li><strong>Applicable Laws:</strong> Any law, statute, rule, regulation, order, circular, decree, directive, judgment or other similar mandate of any applicable governmental/regulatory authority having competent jurisdiction.</li>
              <li><strong>Chargeback:</strong> The reversal of a Transaction Amount debit requested by a Facility Provider pursuant to a request from the Facility Provider&rsquo;s customer.</li>
              <li><strong>Customer:</strong> The Merchant&rsquo;s customer making payments to the Merchant in consideration for goods/services availed.</li>
              <li><strong>Escrow Account:</strong> An account held by Razorpay with an Escrow Bank for the purpose of receiving Transaction Amounts and effecting settlements.</li>
              <li><strong>Facility Providers:</strong> Banks, financial institutions, NPCI, technology service providers, or other third parties facilitating provisions of Services.</li>
              <li><strong>KYC Guidelines:</strong> KYC norms as set out in the Master Direction &ndash; Know Your Customer, 2016 notified by the Reserve Bank of India.</li>
              <li><strong>NPCI:</strong> The National Payments Corporation of India constituted pursuant to the Payment and Settlement Systems Act, 2007.</li>
              <li><strong>Payment Aggregator Guidelines:</strong> The RBI circular DPSS.CO.PD.No.1810/02.14.008/2019-20 dated March 17, 2020, including any amendments.</li>
              <li><strong>Payment Instrument:</strong> Credit card, debit card, bank account, prepaid payment instrument or any other instrument used by a customer to pay.</li>
              <li><strong>Refund:</strong> Processing of Your request to Razorpay for returning the Transaction Amount to the Payment Instrument used for the original payment.</li>
              <li><strong>RBI:</strong> The Reserve Bank of India.</li>
              <li><strong>Transaction:</strong> An order or request placed by the customer with You for purchasing goods/services, resulting in a debit to the customer&rsquo;s Payment Instrument.</li>
              <li><strong>Transaction Amount:</strong> The amount paid by the Customer in connection with a Transaction.</li>
            </ul>
          </Section>

          {/* PART B */}
          <PartHeading>PART B: SPECIFIC TERMS AND CONDITIONS</PartHeading>
          <PartHeading sub>PART I: SPECIFIC TERMS FOR ONLINE PAYMENT AGGREGATION SERVICES</PartHeading>

          <Section title="1. Payment Processing">
            <p>
              Razorpay shall facilitate collection of online payments for products/services sold by You. Razorpay shall
              settle the Transaction Amount (net of Permissible Deductions) into Your account as per agreed timelines
              in compliance with PA/PG guidelines. The Merchant acknowledges that the foregoing is subject to credit
              to/receipt of funds by Razorpay in the Escrow Account from acquiring banks or gateways.
            </p>
            <p>
              Razorpay shall have an absolute right to recover the Transaction Amount if the same is not received in
              the Escrow Account within three (3) Escrow Bank Working Days following the date of the Transaction.
              Razorpay shall also have an absolute right to place limits on the Transaction value.
            </p>
          </Section>

          <Section title="2. Chargebacks">
            <p>
              If a Facility Provider communicates to Razorpay the receipt of a Chargeback Request, You will be
              notified. Liability for Chargeback under the Terms solely rests with You. Subject to availability of
              funds, Razorpay shall deduct the Chargeback Amount from the Transaction Amounts forthwith.
            </p>
            <p>
              You shall furnish Chargeback Documents within three (3) calendar days of receiving notification of the
              Chargeback Request. If You are unable to furnish satisfactory Chargeback Documents, the Facility Provider
              shall be entitled to order reversal of the Chargeback Amount to the customer&rsquo;s Payment Instrument.
            </p>
            <p>
              On issuance of notice of termination, Razorpay reserves the right to withhold from each settlement, a
              sum computed based on a Stipulated Percentage for a period of one hundred and twenty (120) days
              (&ldquo;Withholding Term&rdquo;) from the date of termination.
            </p>
          </Section>

          <Section title="3. Refunds">
            <p>
              Subject to availability of funds received in the Escrow Account, You are entitled to effect Refunds at
              Your sole discretion. Initiation of Refunds is at Your discretion and Razorpay shall process a Refund
              only upon initiation on the Platform. All Refunds shall be routed to the same payment method through
              which the Transaction was processed.
            </p>
            <p>
              Razorpay fees shall always be applicable and payable by You on each Transaction irrespective of whether
              You have refunded the same to Your customer. For payments that are late authorized but not captured by
              You, Razorpay may initiate auto-refund to the customer within five (5) days.
            </p>
          </Section>

          <Section title="4. Fraudulent Transactions">
            <p>
              If Razorpay is intimated by a Facility Provider that a customer has reported an unauthorised debit of the
              customer&rsquo;s Payment Instrument (&ldquo;Fraudulent Transaction&rdquo;), Razorpay shall be entitled to suspend
              settlements to You during the pendency of inquiries, investigations and resolution thereof.
            </p>
            <p>
              Razorpay shall not be responsible for any liability arising in respect of Fraudulent Transactions whether
              international or domestic. You shall be liable in the event of breach of fraud amount thresholds as
              provided under the NPCI guideline on &ldquo;Fraud liability guidelines on UPI transactions&rdquo; (NPCI/2022-23/RMD/001).
            </p>
          </Section>

          <Section title="5. Compliance with Payment Aggregator Guidelines">
            <p>You represent and warrant that:</p>
            <ul>
              <li>You shall implement, observe and comply with applicable requirements under Payment Aggregator Guidelines during the entire term of Services.</li>
              <li>You shall on Your website clearly indicate Your return and refund policy, and the general terms of use and conditions.</li>
              <li>You shall at no time hold, store, copy or keep any customer data relating to a customer&rsquo;s Payment Instrument.</li>
              <li>You shall not store any data pertaining to the Payment Instrument/customer Payment Instrument credentials.</li>
              <li>You shall set up a comprehensive customer grievance redressal mechanism and respond to grievances within five (5) business days.</li>
              <li>You shall comply with the Payment Card Industry Data Security Standard (&ldquo;PCI DSS&rdquo;) and submit an annual compliance report.</li>
            </ul>
          </Section>

          {/* Cross Border Part */}
          <PartHeading sub>PART IB: SPECIFIC TERMS FOR ONLINE PAYMENT AGGREGATION (CROSS BORDER) SERVICES</PartHeading>
          <Section title="Cross Border Payment Processing">
            <p>
              If You are a Merchant incorporated or operating from outside India and intend to receive payments from
              Customers located in India, Razorpay shall settle the Transaction Amount, net of applicable fees, charges,
              taxes, and other Permissible Deductions, into Your designated account within five (5) Escrow Bank Working
              Days from the date of the Transaction.
            </p>
            <p>
              A currency conversion fee shall apply at the time of converting INR to Your chosen settlement currency.
              The value of each underlying import Transaction shall not exceed INR 25,00,000 (Rupees Twenty-Five Lakhs)
              per Transaction or any revised amount as prescribed by RBI from time to time.
            </p>
            <p>
              You represent and warrant that all Transactions will fully comply with the Foreign Exchange Management Act,
              1999 (FEMA), the LRS Guidelines, and all applicable RBI regulations.
            </p>
          </Section>

          {/* Part II */}
          <PartHeading sub>PART II: SPECIFIC TERMS FOR E-MANDATE SERVICES</PartHeading>
          <Section title="E-Mandate Services">
            <p>
              Razorpay shall on a periodic basis (as per the E-Mandate Registration) initiate E-Mandate Payment
              requests with the Sponsor Bank and, based on authentication by NPCI and the Destination Bank, receive
              the funds in the Escrow Account. Razorpay shall not be liable for the failure of a payment on account of
              the decline of approval by the Destination Bank or NPCI or cancellation of the E-Mandate Registration.
            </p>
            <p>
              Razorpay shall be entitled to recover from You any amounts charged by Sponsor Bank to Razorpay on
              account of refund and disputed claims from Your customers, and representing penalties, fines or other
              charges levied by the Sponsor Bank, NPCI or any governmental authority on Razorpay on account of
              fraudulent transactions on Your website.
            </p>
          </Section>

          {/* Part III */}
          <PartHeading sub>PART III: SPECIFIC TERMS FOR TOKENHQ SERVICES</PartHeading>
          <Section title="TokenHQ Services">
            <p>
              The TokenHQ is an end-to-end solution for You to allow Your customers to continue using the saved cards
              feature in compliance with RBI&rsquo;s guidelines on tokenisation. You shall be solely responsible for
              obtaining explicit consent of the customer to tokenize (and save) the customer&rsquo;s card. Such consent shall
              be explicit and not by way of a forced/default/automatic selection of checkbox, radio button, etc.
            </p>
            <p>
              You shall keep Razorpay fully indemnified at all times from and against all losses, damages, penalties
              incurred by or imposed on Razorpay arising from any breach by You of Part III: Specific Terms for
              TokenHQ Services.
            </p>
          </Section>

          {/* Part IV */}
          <PartHeading sub>PART IV: SPECIFIC TERMS FOR SUBSCRIPTION SERVICES</PartHeading>
          <Section title="Subscription Services">
            <p>
              Subscription services provide You the platform to create and manage subscription plans for Your customers
              with automated recurring transactions. The customer desirous of opting for e-mandate facility on Card is
              required to undertake a one-time registration process, with an Additional Factor Authentication (AFA)
              validation by the issuer bank.
            </p>
            <p>
              In order to process recurring transactions, customer Card details will need to be
              saved/secured/tokenized in accordance with Applicable Laws. You shall be solely responsible for obtaining
              informed consent from customers for the purpose of processing e-mandates. Such consent shall be explicit
              and not by way of a forced/default/automatic selection of checkbox, radio button, etc.
            </p>
          </Section>

          {/* Part V */}
          <PartHeading sub>PART V: RAZORPAY PARTNER PROGRAM</PartHeading>
          <Section title="Partner Program">
            <p>
              The Razorpay partner program is a referral program through which You can refer the Razorpay services to
              Your clients or customers and get rewarded. You may become a partner by agreeing to the detailed Partner
              Terms and Conditions and signing up as a partner.
            </p>
          </Section>

          {/* Part VI */}
          <PartHeading sub>PART VI: MAGIC CHECKOUT</PartHeading>
          <Section title="Magic Checkout Services">
            <p>
              Magic Checkout is the checkout technology platform developed by Razorpay for Your customers registered
              with Razorpay which enables the customer to seamlessly save and use their information for placing orders
              with You.
            </p>
            <p>
              In the process of providing Magic Checkout Services, You acknowledge and agree that Razorpay may collect,
              store and use certain information, including personal data, from Your customers. You represent and warrant
              that You shall obtain all consents required under Applicable Law from Your customers before sharing their
              Personally Identifiable Information (PII) with Razorpay.
            </p>
            <p>
              In case You are availing the RTO Protection service from Razorpay, You shall be entitled to claim
              reimbursement for return shipping fees incurred on orders returned to You, provided You have switched on
              the Magic Intelligence feature on Your dashboard and all specified conditions are met.
            </p>
          </Section>

          {/* Part VII */}
          <PartHeading sub>PART VII: SPECIFIC TERMS FOR OFFLINE AGGREGATION SERVICES AND DEVICES</PartHeading>
          <Section title="Offline Aggregation Services">
            <p>
              Razorpay POS will provide offline payment collection and aggregation Services and the Devices to the
              Merchant for its legitimate, bonafide and legal business activities only. Razorpay POS shall settle the
              regular card/UPI Transaction Amount (net of Permissible Deductions) into Your account within two (2)
              Bank working days following the date of the Transaction.
            </p>
            <p>
              Each Device ordered by Merchant shall have a minimum period of usage of 12 (twelve) months (Lock-in
              period). In the event the Merchant deactivates or returns a Device before expiry of the Lock-in period,
              Merchant shall make a one-time payment equivalent to the remaining rental for the unexpired duration.
            </p>
            <p>
              Merchant shall retain in its possession and for its exclusive use the Device and keep the same in good
              condition. Merchant shall not use the Device for any fraudulent transactions, business malpractices or
              illegal activities. Merchant shall not lease or resell the Device without the prior written permission
              of Razorpay POS.
            </p>
            <p>
              Settlement timelines for affordability transactions (where Razorpay is the payment aggregator):
              DC EMI: T+2 days | CC EMI: T+1 day | NBFC EMI: T+2 days | Brand EMI: T+1 day | BNPL: T+1 day.
              (&lsquo;T&rsquo; means the day of transaction)
            </p>
          </Section>

          {/* Privacy Notice */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-5">
            <h2 className="text-lg font-bold text-amber-800 mb-3 uppercase">Privacy</h2>
            <p className="text-sm font-semibold">
              YOUR PRIVACY IS EXTREMELY IMPORTANT TO US. UPON ACCEPTANCE OF THESE TERMS YOU CONFIRM THAT YOU HAVE
              READ, UNDERSTOOD AND UNEQUIVOCALLY ACCEPTED OUR POLICIES, INCLUDING THE PROVISIONS OF OUR{" "}
              <a href="/privacy-policy" className="text-orange-600 hover:underline">PRIVACY POLICY</a>.
            </p>
            <div className="mt-4 text-sm space-y-1">
              <p className="font-semibold">DPO</p>
              <p><strong>MR. SHASHANK KARINCHETI</strong></p>
              <p>RAZORPAY SOFTWARE PRIVATE LIMITED</p>
              <p>ADDRESS: NO. 22, 1ST FLOOR, SJR CYBER, LASKAR-HOSUR ROAD, ADUGODI, BANGALORE- 560030</p>
              <p>E-MAIL: <a href="mailto:dpo@razorpay.com" className="text-orange-600 hover:underline">dpo@razorpay.com</a></p>
              <p>GRIEVANCES PORTAL: <a href="https://razorpay.com/grievances/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">https://razorpay.com/grievances/</a></p>
            </div>
          </div>

          {/* Complaints */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
            <h2 className="text-lg font-bold text-orange-700 mb-3 uppercase">Complaints and Grievance Redressal</h2>
            <p className="text-sm mb-3">
              Any complaints or concerns with regards to content of this website or comment or breach of these Terms or
              any intellectual property, instances of customer grievances, regulatory queries and clarifications shall
              be informed/communicated to the Nodal Officer at the coordinates mentioned below:
            </p>
            <div className="text-sm space-y-1">
              <p className="font-semibold">NODAL OFFICER</p>
              <p><strong>MR. VIJAY THAKRAL</strong></p>
              <p>RAZORPAY SOFTWARE PRIVATE LIMITED</p>
              <p>ADDRESS: NO. 22, 1ST FLOOR, SJR CYBER, LASKAR-HOSUR ROAD, ADUGODI, BANGALORE- 560030</p>
              <p>E-MAIL: <a href="mailto:nodal-officer@razorpay.com" className="text-orange-600 hover:underline">nodal-officer@razorpay.com</a></p>
              <p>GRIEVANCES PORTAL: <a href="https://razorpay.com/grievances/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">https://razorpay.com/grievances/</a></p>
            </div>
          </div>

          {/* Acceptance Details */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Acceptance Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
              <div><span className="font-semibold">Owner Id:</span> SBmKsVX1wnwwjW</div>
              <div><span className="font-semibold">Owner Name:</span> godavaridelights</div>
              <div><span className="font-semibold">IP Address:</span> 10.26.97.219</div>
              <div><span className="font-semibold">Date Of Acceptance:</span> 2026-02-04 20:53:11 IST</div>
              <div><span className="font-semibold">Signatory Name:</span> VIGNESWARA SWAMY NADIPALLI</div>
              <div><span className="font-semibold">Contact Number:</span> +919885469456</div>
              <div className="sm:col-span-2"><span className="font-semibold">Email:</span> godavaridelights1@gmail.com</div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  )
}

function PartHeading({ children, sub }: { children: React.ReactNode; sub?: boolean }) {
  return (
    <div className={`rounded-xl p-4 ${sub ? "bg-orange-100 border border-orange-200" : "bg-orange-600 text-white"}`}>
      <h2 className={`font-bold text-center ${sub ? "text-orange-800 text-base" : "text-white text-lg"}`}>
        {children}
      </h2>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-6">
      <h2 className="text-base font-bold text-orange-700 mb-3">{title}</h2>
      <div className="text-gray-700 space-y-3 text-sm leading-relaxed [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:space-y-1 [&_ol]:ml-5 [&_ol]:space-y-1">
        {children}
      </div>
    </div>
  )
}
