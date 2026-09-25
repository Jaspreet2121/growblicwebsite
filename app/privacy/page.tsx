import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import EnvLayer from "@/components/EnvLayer";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Growblic",
  description:
    "How Growblic and the Growblic: Chat, Call, Meet messaging app collect, use and protect your data — written plainly, and grounded in how the apps actually work.",
};

const css = (v: number) => ({ "--i": v } as React.CSSProperties);

const LAST_UPDATED = "25 September 2026";

const SECTIONS: { id: string; title: string }[] = [
  { id: "who-we-are", title: "1. Who we are" },
  { id: "data-we-collect", title: "2. Data we collect" },
  { id: "encryption", title: "3. End-to-end encryption" },
  { id: "how-we-use", title: "4. How we use your data" },
  { id: "sharing", title: "5. Who we share data with" },
  { id: "staff-access", title: "6. Access by Growblic staff" },
  { id: "retention", title: "7. Keeping and deleting data" },
  { id: "your-rights", title: "8. Your rights" },
  { id: "grievance", title: "9. Grievance Officer" },
  { id: "children", title: "10. Children" },
  { id: "permissions", title: "11. App permissions and why we ask" },
  { id: "changes", title: "12. Changes to this policy" },
  { id: "contact", title: "13. Contact us" },
];

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="lede r" style={css(2)}>
            This policy covers <strong>Growblic: Chat, Call, Meet</strong>, our messaging
            app, and the{" "}
            <strong>Growblic platform</strong> that powers chat and calling inside
            other companies&rsquo; apps. We have written it in plain English and
            described what the software genuinely does — no more, and no less.
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
            <section id="who-we-are">
              <h2>1. Who we are</h2>
              <p>
                Growblic is a software studio based in India. We build and operate{" "}
                <strong>Growblic: Chat, Call, Meet</strong>, a messaging app for everyday use,
                and the{" "}
                <strong>Growblic platform</strong>, which other businesses
                (&ldquo;integrators&rdquo;) use to add messaging and calling to their
                own apps.
              </p>
              <p>
                Your data is stored on Amazon Web Services in the{" "}
                <strong>Mumbai region (ap-south-1)</strong>.
              </p>
              <p>
                For anything in this policy, write to{" "}
                <a href="mailto:privacy@growblic.com">privacy@growblic.com</a>.
              </p>
              <p>
                When you use the Growblic app, Growblic is the data fiduciary. When you use a
                third party&rsquo;s app built on the Growblic platform,{" "}
                <strong>that company</strong> decides what happens to the data in
                their app, and we process it on their behalf — their own privacy
                policy applies alongside this one.
              </p>
            </section>

            <section id="data-we-collect">
              <h2>2. Data we collect</h2>
              <p>
                We collect what the app needs to work. Several categories below are
                collected <strong>only if you switch that feature on</strong>, and we
                have marked those clearly.
              </p>

              <h3>Always, because the account depends on it</h3>
              <ul>
                <li>
                  <strong>Your phone number.</strong> It is your account identity, and
                  we send a one-time password (OTP) to it when you sign in.
                </li>
                <li>
                  <strong>Profile details you enter</strong> — display name, photo,
                  about text, username, and business details if you add them (address,
                  website, business email, opening hours).
                </li>
                <li>
                  <strong>Device information and push tokens.</strong> Device type and
                  a Firebase Cloud Messaging (FCM) token so we can deliver
                  notifications, plus the list of devices signed in to your account so
                  you can review and revoke them.
                </li>
                <li>
                  <strong>Public encryption keys, one per device.</strong> These are
                  public halves only. The matching private keys never leave your
                  device and are never sent to us.
                </li>
              </ul>

              <h3>What you send and who you talk to</h3>
              <ul>
                <li>
                  <strong>Messages and media.</strong> See{" "}
                  <a href="#encryption">End-to-end encryption</a> — for encrypted
                  chats we hold ciphertext we cannot read.
                </li>
                <li>
                  <strong>People you look up or message.</strong> If you search for a
                  phone number to start a chat, we check whether that number has an
                  account. We do not upload or store your whole address book in the
                  background.
                </li>
                <li>
                  <strong>Call metadata</strong> — who called whom, when, and how long
                  it lasted, so your call history works. Not the audio or video
                  itself.
                </li>
              </ul>

              <h3>Only if you turn the feature on</h3>
              <ul>
                <li>
                  <strong>Live location.</strong> Shared only when you start sharing,
                  only with that chat, and it stops when you end it or the timer runs
                  out.
                </li>
                <li>
                  <strong>Nearby People.</strong> While the Nearby screen is open, your
                  approximate position is used to find other people who also have it
                  open. Others see a coarse distance band, never your coordinates. If
                  you enable Bluetooth precision, your device exchanges{" "}
                  <strong>anonymous tokens that rotate</strong> and are not tied to
                  your identity. Closing the screen turns discovery off.
                </li>
                <li>
                  <strong>Dating.</strong> Only if you enable Dating. It includes date
                  of birth, gender, who you are interested in, photos, the location you
                  choose, and your stated intentions and interests. We treat this as{" "}
                  <strong>sensitive personal data</strong>. Dating is{" "}
                  <strong>18+ only</strong>.
                </li>
                <li>
                  <strong>UPI payment identity.</strong> Only if you add it. We store
                  your UPI ID and generate a QR code from it so people can pay you.{" "}
                  <strong>
                    Growblic never processes payments and never touches money
                  </strong>{" "}
                  — the payment happens entirely in your own UPI app, and we see none
                  of it.
                </li>
              </ul>
            </section>

            <section id="encryption">
              <h2>3. End-to-end encryption</h2>
              <p className="legal-callout">
                <strong>
                  Messages, attachments and calls between up-to-date apps are
                  end-to-end encrypted. We cannot read your message content, open your
                  attachments, or listen to your calls.
                </strong>
              </p>
              <p>
                Encryption and decryption happen on the devices themselves, using keys
                only those devices hold. What reaches our servers is encrypted data
                plus the metadata needed to deliver it — who sent it, who receives it,
                and when. For calls, the audio and video are encrypted before they
                leave your device, so our servers pass through media they cannot
                decode.
              </p>
              <p>
                Two honest caveats, because a privacy policy that overstates protection
                is worse than useless:
              </p>
              <ul>
                <li>
                  <strong>Older app versions.</strong> A chat or call is encrypted only
                  when both sides are running a version that supports it. Until both
                  people have updated, that conversation may not be end-to-end
                  encrypted. The app shows you the current state rather than implying
                  protection it does not have.
                </li>
                <li>
                  <strong>Metadata is not content.</strong> We still know that a message
                  was sent, between which accounts, and when — that is what makes
                  delivery possible.
                </li>
              </ul>
              <p>
                <strong>Automated replies</strong> (away messages and greetings) in an
                encrypted chat are composed and sent <strong>by your own device</strong>,
                because our servers cannot read the message that triggered them.
              </p>
            </section>

            <section id="how-we-use">
              <h2>4. How we use your data</h2>
              <ul>
                <li>To run the service — delivering messages, connecting calls, syncing your account across your devices.</li>
                <li>To send notifications you have asked for.</li>
                <li>To keep people safe: preventing spam, abuse and fraud, and enforcing our <Link href="/terms">Terms of Service</Link>.</li>
                <li>To provide the specific features you enable, as described above.</li>
                <li>To fix problems and improve reliability.</li>
              </ul>
              <p className="legal-callout">
                <strong>We do not sell your personal data, and we do not show ads.</strong>{" "}
                We do not build advertising profiles, and we do not share your data with
                data brokers.
              </p>
            </section>

            <section id="sharing">
              <h2>5. Who we share data with</h2>
              <ul>
                <li>
                  <strong>Infrastructure providers</strong> who run parts of the service
                  for us: Amazon Web Services (hosting and storage, Mumbai region),
                  Google Firebase (push notifications), and an SMS provider that
                  delivers your login OTP.
                </li>
                <li>
                  <strong>Integrators, and only within their own app.</strong> If you use
                  a third party&rsquo;s app built on the Growblic platform, the
                  conversations you have <em>inside that app</em> belong to that
                  company&rsquo;s service. This never gives them access to your Growblic
                  chats or to any other integrator&rsquo;s data.
                </li>
                <li>
                  <strong>Legal requirements.</strong> If we are legally compelled to
                  disclose information, we will — but we can only ever hand over what we
                  actually hold, which for encrypted conversations does not include the
                  content.
                </li>
              </ul>
            </section>

            <section id="staff-access">
              <h2>6. Access by Growblic staff</h2>
              <p>
                A small number of authorised Growblic staff can view limited account
                information — including your <strong>match history in Dating</strong>:
                who you matched with, and when. They cannot see your location, your
                swipes, or the content of your encrypted messages.
              </p>
              <p>
                This access exists for three reasons only: investigating reports of abuse
                or harassment, protecting someone&rsquo;s safety, and meeting a legal
                obligation.
              </p>
              <p>
                Every such access is restricted to the most senior staff roles, requires a
                written reason recorded at the time, and is logged with who looked, what
                they looked at, why, and when. Those logs are retained and reviewable.
                There is no facility to export or bulk-download match history.
              </p>
              <p>
                Dating is opt-in — see <a href="#data-we-collect">Data we collect</a>.
                Switching it off, and deleting your account, are covered under{" "}
                <a href="#your-rights">Your rights</a> and{" "}
                <a href="#retention">Keeping and deleting data</a>.
              </p>
            </section>

            <section id="retention">
              <h2>7. Keeping and deleting data</h2>
              <p>
                We keep your data while your account is active, so the app works as you
                expect across your devices.
              </p>
              <p>
                <strong>You can delete your account yourself, from inside the app</strong> —
                Settings → Account → Delete account. It takes effect immediately, and you do
                not need to ask us. See{" "}
                <Link href="/delete-account">Delete your account</Link> for what is removed
                and what is kept.
              </p>
              <p>
                If you have lost access to the app or to your phone number, email{" "}
                <a href="mailto:privacy@growblic.com">privacy@growblic.com</a> from the
                address or phone number linked to your account instead. We process erasure
                requests <strong>within 30 days</strong>. Some records may be retained
                where the law requires it.
              </p>
              <p>
                Encrypted message content is unreadable to us whether it is stored or
                deleted — we never held the keys to it in the first place.
              </p>
            </section>

            <section id="your-rights">
              <h2>8. Your rights</h2>
              <p>
                Under India&rsquo;s Digital Personal Data Protection Act, 2023, and
                equivalent rights for users covered by the GDPR, you can:
              </p>
              <ul>
                <li><strong>Access</strong> the personal data we hold about you.</li>
                <li><strong>Correct</strong> anything inaccurate or incomplete.</li>
                <li><strong>Erase</strong> your data and close your account.</li>
                <li><strong>Withdraw consent</strong> for any feature you switched on — turning off Dating, Nearby People, location sharing or UPI removes that data from your profile.</li>
                <li><strong>Complain</strong> to us, and to the Data Protection Board of India if we do not resolve it.</li>
              </ul>
              <p>
                To exercise any of these, write to{" "}
                <a href="mailto:privacy@growblic.com">privacy@growblic.com</a>.
              </p>
            </section>

            <section id="grievance">
              <h2>9. Grievance Officer</h2>
              <p>
                In line with the Digital Personal Data Protection Act, 2023, you can
                reach our Grievance Officer about any privacy concern or complaint:
              </p>
              <p className="legal-contact">
                <strong>Grievance Officer, Growblic</strong>
                <br />
                Email: <a href="mailto:privacy@growblic.com">privacy@growblic.com</a>
                <br />
                We respond to grievances <strong>within 30 days</strong>.
              </p>
            </section>

            <section id="children">
              <h2>10. Children</h2>
              <p>
                The Growblic app is not intended for anyone under <strong>13</strong>, and you may
                not create an account if you are younger than that.
              </p>
              <p>
                <strong>Dating is strictly 18+.</strong> Enabling it requires a date of
                birth, and the app refuses to switch it on for anyone under 18.
              </p>
              <p>
                If you believe a child has given us personal data, email{" "}
                <a href="mailto:privacy@growblic.com">privacy@growblic.com</a> and we
                will remove it.
              </p>
            </section>

            <section id="permissions">
              <h2>11. App permissions and why we ask</h2>
              <p>
                Every permission below is requested at the moment the feature needs it,
                and the app keeps working if you decline — you simply lose that feature.
              </p>
              <dl className="legal-perms">
                <dt>Camera</dt>
                <dd>Taking photos and videos to send, and scanning QR codes (including UPI codes).</dd>

                <dt>Microphone</dt>
                <dd>Voice and video calls, and voice messages.</dd>

                <dt>Location</dt>
                <dd>Only for the features you start: sharing your live location in a chat, and Nearby People while that screen is open.</dd>

                <dt>Bluetooth / Nearby devices</dt>
                <dd>Improving Nearby People&rsquo;s precision using anonymous rotating tokens, and passing messages between nearby devices when the network is unavailable.</dd>

                <dt>Contacts</dt>
                <dd>Finding people you already know who are on Growblic. We look up numbers you choose to search rather than continuously uploading your address book.</dd>

                <dt>Notifications</dt>
                <dd>Telling you about new messages and incoming calls.</dd>

                <dt>Photos and files</dt>
                <dd>Choosing images, videos and documents to send.</dd>
              </dl>
            </section>

            <section id="changes">
              <h2>12. Changes to this policy</h2>
              <p>
                We will update this policy when the product changes. The date at the top
                always reflects the current version, and we will give notice in the app
                for changes that materially affect you. Continuing to use the service
                after a change means you accept the updated policy.
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
                Privacy: <a href="mailto:privacy@growblic.com">privacy@growblic.com</a>
                <br />
                General: <a href="mailto:hello@growblic.com">hello@growblic.com</a>
              </p>
              <p>
                See also our <Link href="/terms">Terms of Service</Link>.
              </p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
