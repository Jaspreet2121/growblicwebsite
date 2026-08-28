import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import EnvLayer from "@/components/EnvLayer";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Growblic",
  description:
    "The terms that apply when you use Growblic: Chat, Call, Meet and the Growblic platform — eligibility, acceptable use, your content, payments, Dating, and liability.",
};

const css = (v: number) => ({ "--i": v } as React.CSSProperties);

const LAST_UPDATED = "27 August 2026";

const SECTIONS: { id: string; title: string }[] = [
  { id: "acceptance", title: "1. Accepting these terms" },
  { id: "eligibility", title: "2. Who can use the service" },
  { id: "account", title: "3. Your account" },
  { id: "acceptable-use", title: "4. Acceptable use" },
  { id: "your-content", title: "5. Your content" },
  { id: "payments", title: "6. Payments and UPI" },
  { id: "dating", title: "7. Dating" },
  { id: "availability", title: "8. Service availability" },
  { id: "termination", title: "9. Suspension and termination" },
  { id: "liability", title: "10. Limitation of liability" },
  { id: "governing-law", title: "11. Governing law" },
  { id: "changes", title: "12. Changes to these terms" },
  { id: "contact", title: "13. Contact us" },
];

export default function TermsPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <EnvLayer />
      <Nav />
      <main id="main" tabIndex={-1} className="subpage">
        <Reveal className="apps-head">
          <p className="kicker r" style={css(0)}>
            Legal
          </p>
          <h1 className="r" style={css(1)}>
            Terms of Service
          </h1>
          <p className="lede r" style={css(2)}>
            These terms apply when you use <strong>Growblic: Chat, Call, Meet</strong> or
            any service built
            on the <strong>Growblic platform</strong>. They are written to be read, not
            to be skimmed past.
          </p>
          <p className="legal-updated r" style={css(3)}>
            Last updated: {LAST_UPDATED}
          </p>
        </Reveal>

        <div className="legal">
          <nav className="legal-toc" aria-label="On this page">
            <h2>On this page</h2>
            <ol>
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="legal-body">
            <section id="acceptance">
              <h2>1. Accepting these terms</h2>
              <p>
                By creating an account or using the Growblic app or the Growblic platform, you
                agree to these terms and to our{" "}
                <Link href="/privacy">Privacy Policy</Link>. If you do not agree, please
                do not use the service.
              </p>
              <p>
                If you use a third party&rsquo;s app built on the Growblic platform,
                that company&rsquo;s own terms apply to their app as well as these.
              </p>
            </section>

            <section id="eligibility">
              <h2>2. Who can use the service</h2>
              <ul>
                <li>
                  You must be at least <strong>13 years old</strong> to use the Growblic
                  app.
                </li>
                <li>
                  <strong>Dating is 18+ only.</strong> Enabling it requires your date of
                  birth, and the app will not switch it on for anyone under 18.
                </li>
                <li>
                  If you are using the service on behalf of an organisation, you confirm
                  you are authorised to accept these terms for it.
                </li>
              </ul>
            </section>

            <section id="account">
              <h2>3. Your account</h2>
              <p>
                Your account is tied to your <strong>phone number</strong>, and you sign
                in with a one-time password (OTP) sent to it.
              </p>
              <ul>
                <li>
                  Keep your phone number and your OTP codes secure.{" "}
                  <strong>Never share an OTP with anyone</strong> — we will never ask you
                  for one.
                </li>
                <li>
                  You are responsible for activity on your account. If you lose access to
                  your number or think someone else is using your account, contact us at
                  once.
                </li>
                <li>
                  You can review the devices signed in to your account in the app and
                  revoke any you do not recognise.
                </li>
                <li>One person, one account. Do not sell or transfer your account.</li>
              </ul>
            </section>

            <section id="acceptable-use">
              <h2>4. Acceptable use</h2>
              <p>You agree not to use the service to:</p>
              <ul>
                <li>break the law, or share content that is illegal;</li>
                <li>send spam, bulk unsolicited messages, or run scams;</li>
                <li>harass, threaten, bully or abuse anyone;</li>
                <li>impersonate another person, business, or Growblic itself;</li>
                <li>share sexual content involving minors, or content that promotes violence, terrorism or self-harm — this is never tolerated;</li>
                <li>distribute malware, or try to break, overload, reverse-engineer or gain unauthorised access to the service;</li>
                <li>collect other users&rsquo; data without their consent, or use the service to build a competing dataset.</li>
              </ul>
              <p>
                <strong>
                  We may suspend or remove accounts that abuse the service.
                </strong>{" "}
                Where the abuse is serious or repeated, that may be immediate and
                permanent. Note that because message content in encrypted chats is
                unreadable to us, our enforcement generally relies on reports from
                people who receive the content.
              </p>
            </section>

            <section id="your-content">
              <h2>5. Your content</h2>
              <p>
                <strong>Your content stays yours.</strong> We do not claim ownership of
                your messages, photos, videos, files or profile.
              </p>
              <p>
                You grant us the limited licence we need to actually run a messaging
                service: to store, transmit, and display your content to the people you
                send it to, and to sync it across your own devices. That licence exists
                only to operate the service and ends when the content is deleted.
              </p>
              <p>
                For end-to-end encrypted content this is narrower still: we hold
                encrypted data we cannot read, and we transmit it without ever being able
                to access it.
              </p>
              <p>
                You are responsible for the content you send, and you confirm you have
                the right to send it.
              </p>
            </section>

            <section id="payments">
              <h2>6. Payments and UPI</h2>
              <p className="legal-callout">
                <strong>
                  Growblic is not a payment processor and is not a party to any payment
                  you make.
                </strong>
              </p>
              <p>
                If you add a UPI ID, Growblic stores it and generates a QR code so people
                can pay you. When someone taps to pay, the app simply{" "}
                <strong>hands off to their own UPI application</strong>, where the
                payment happens between them, their bank, and yours.
              </p>
              <ul>
                <li>We never hold, transfer or process funds.</li>
                <li>We do not verify that a UPI ID belongs to the person displaying it — check before you pay.</li>
                <li>Disputes, refunds and chargebacks are between the payer, the payee, and their banks or payment providers. We cannot reverse a payment.</li>
              </ul>
            </section>

            <section id="dating">
              <h2>7. Dating</h2>
              <ul>
                <li>
                  Dating is <strong>18+ only</strong> and is off unless you switch it on.
                </li>
                <li>
                  <strong>Be honest.</strong> Your age, photos and profile must be your
                  own and accurate. Fake or misleading profiles will be removed.
                </li>
                <li>
                  <strong>We do not verify identities.</strong> Matching someone in the
                  app is not a background check, an endorsement, or any assurance about
                  who they are.
                </li>
                <li>
                  <strong>Meet people carefully.</strong> Meet in public the first few
                  times, tell someone where you are going, and arrange your own transport.
                  You are meeting strangers at your own risk.
                </li>
                <li>
                  Report anyone who makes you uncomfortable. You can unmatch and block at
                  any time.
                </li>
              </ul>
            </section>

            <section id="availability">
              <h2>8. Service availability</h2>
              <p>
                The service is provided <strong>&ldquo;as is&rdquo;</strong> and{" "}
                <strong>&ldquo;as available&rdquo;</strong>. We work to keep it running,
                but we do not promise it will be uninterrupted or error-free.
              </p>
              <p>
                We may add, change or remove features, and we may need to take the
                service down for maintenance. Where a change materially affects you, we
                will give notice in the app.
              </p>
            </section>

            <section id="termination">
              <h2>9. Suspension and termination</h2>
              <p>
                You can stop using the service at any time and ask us to delete your
                account by emailing{" "}
                <a href="mailto:privacy@growblic.com">privacy@growblic.com</a> (see the{" "}
                <Link href="/privacy#retention">Privacy Policy</Link> for how deletion
                works).
              </p>
              <p>
                We may suspend or terminate an account that breaches these terms, that
                creates a risk to other users, or where we are legally required to. Where
                it is reasonable to do so, we will tell you why.
              </p>
            </section>

            <section id="liability">
              <h2>10. Limitation of liability</h2>
              <p>
                To the maximum extent permitted by law, Growblic is not liable for
                indirect, incidental, special or consequential losses, or for lost
                profits, lost data, or loss of goodwill arising from your use of the
                service.
              </p>
              <p>
                We are not responsible for the conduct of other users, for content they
                send you, for anything that happens when you meet someone in person, or
                for payments made between you and someone else.
              </p>
              <p>
                Nothing in these terms limits liability that cannot be limited by law,
                including liability for death or personal injury caused by negligence, or
                for fraud.
              </p>
            </section>

            <section id="governing-law">
              <h2>11. Governing law</h2>
              <p>
                These terms are governed by the laws of <strong>India</strong>, and the
                courts of India have jurisdiction over any dispute arising from them.
              </p>
            </section>

            <section id="changes">
              <h2>12. Changes to these terms</h2>
              <p>
                We may update these terms as the product develops. The date at the top
                reflects the current version, and we will give notice in the app for
                changes that materially affect you. Continuing to use the service after a
                change means you accept the updated terms.
              </p>
              <p>
                <strong>Effective date:</strong> {LAST_UPDATED}.
              </p>
            </section>

            <section id="contact">
              <h2>13. Contact us</h2>
              <p className="legal-contact">
                <strong>Growblic</strong>
                <br />
                General: <a href="mailto:hello@growblic.com">hello@growblic.com</a>
                <br />
                Privacy: <a href="mailto:privacy@growblic.com">privacy@growblic.com</a>
              </p>
              <p>
                See also our <Link href="/privacy">Privacy Policy</Link>.
              </p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
