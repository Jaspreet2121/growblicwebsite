import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import EnvLayer from "@/components/EnvLayer";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Support | Growblic",
  description:
    "Get help with Growblic: Chat, Call, Meet — contact details and hours, answers to the questions we hear most, and how to report abuse.",
};

const css = (v: number) => ({ "--i": v } as React.CSSProperties);

const SECTIONS: { id: string; title: string }[] = [
  { id: "contact", title: "1. Contact us" },
  { id: "faq", title: "2. Common questions" },
  { id: "report-abuse", title: "3. Report abuse" },
  { id: "policies", title: "4. Policies" },
];

// Answers are written to be ACTED ON from a phone, in the order someone stuck would try them.
const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "I can’t receive the OTP code",
    a: (
      <>
        <p>
          Check the number you typed, including the country code — the code goes to exactly that
          number. Wait a minute: delivery can lag on a weak signal. Then tap{" "}
          <strong>Resend code</strong>.
        </p>
        <p>
          If it still does not arrive, check that your phone is not blocking messages from
          unknown senders and that you have not opted out of promotional SMS with your carrier
          (some carriers apply that to one-time codes too). If none of that works, email{" "}
          <a href="mailto:hello@growblic.com?subject=OTP%20not%20received">hello@growblic.com</a>{" "}
          with the number you are signing in with.
        </p>
      </>
    ),
  },
  {
    q: "How do I delete my account?",
    a: (
      <p>
        From inside the app: <strong>Settings → Account → Delete account</strong>. It takes effect
        immediately and cannot be undone. What is removed, what is kept and why, and what to do if
        you cannot get into the app are on <Link href="/delete-account">Delete your account</Link>.
      </p>
    ),
  },
  {
    q: "How do I report or block someone?",
    a: (
      <>
        <p>
          Open the chat, tap the person&rsquo;s name at the top, and choose{" "}
          <strong>Block</strong> or <strong>Report</strong>. Blocking stops their messages and
          calls reaching you at once; they are not told. Reporting sends the conversation to our
          moderation team for review.
        </p>
        <p>
          In Dating and Nearby People, the same options are on the person&rsquo;s card. Blocking
          also removes any match or Nearby connection between you.
        </p>
      </>
    ),
  },
  {
    q: "Who can see my Matches or Nearby activity?",
    a: (
      <>
        <p>
          Nobody else in the app sees your Nearby location — other people see a coarse distance
          band, never your coordinates, and only while you have the Nearby screen open or have
          switched on background publishing. Your matches are visible to you and the person you
          matched with.
        </p>
        <p>
          A small number of authorised Growblic staff can view match history (who you matched
          with, and when) for safety, abuse and legal reasons — never your location. Every such
          access needs a written reason and is logged. The full rule is in the Privacy Policy under{" "}
          <Link href="/privacy#staff-access">Access by Growblic staff</Link>.
        </p>
      </>
    ),
  },
  {
    q: "How do I request a copy of my data?",
    a: (
      <p>
        Email{" "}
        <a href="mailto:privacy@growblic.com?subject=Data%20access%20request">
          privacy@growblic.com
        </a>{" "}
        from the email address or phone number linked to your account and ask for a copy of your
        data. We respond within 30 days. Your rights — access, correction, erasure and withdrawing
        consent — are set out in the <Link href="/privacy#your-rights">Privacy Policy</Link>.
      </p>
    ),
  },
  {
    q: "I’m not receiving messages or calls until I open the app",
    a: (
      <>
        <p>
          That is almost always the phone holding notifications back to save battery. Check two
          settings for Growblic: <strong>Notifications</strong> must be allowed (on Android, with
          the &ldquo;Messages&rdquo; and &ldquo;Calls&rdquo; categories on), and{" "}
          <strong>Battery</strong> must be set to <em>Unrestricted</em> or <em>Not optimised</em>
          — &ldquo;Optimised&rdquo; and &ldquo;Restricted&rdquo; both delay or drop notifications
          on many phones.
        </p>
        <p>
          On some phones (Xiaomi, Oppo, Vivo, OnePlus, Huawei) there is a separate{" "}
          <strong>Autostart</strong> or <strong>Background activity</strong> switch that must also
          be on. If it still does not work, email us with your phone model.
        </p>
      </>
    ),
  },
];

export default function SupportPage() {
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
            Help
          </p>
          <h1 className="r" style={css(1)}>
            Support
          </h1>
          <p className="lede r" style={css(2)}>
            Help with <strong>Growblic: Chat, Call, Meet</strong>. Most questions are answered
            below; for anything else, a real person reads the inbox six days a week.
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
            <section id="contact">
              <h2>1. Contact us</h2>
              <p className="legal-contact">
                <strong>Growblic support</strong>
                <br />
                Email: <a href="mailto:hello@growblic.com">hello@growblic.com</a>
                <br />
                Phone: <a href="tel:+918377001500">+91 83770 01500</a>
                <br />
                Monday to Saturday, 10:00&ndash;18:00 IST
              </p>
              <p>
                Email is the surest way to reach us: include the phone number on your account and
                what you were doing when the problem happened. We reply within one working day.
              </p>
            </section>

            <section id="faq">
              <h2>2. Common questions</h2>
              <div className="faq faq-inline">
                {FAQS.map((item) => (
                  <details key={item.q}>
                    <summary>{item.q}</summary>
                    <div className="faq-answer">{item.a}</div>
                  </details>
                ))}
              </div>
            </section>

            <section id="report-abuse">
              <h2>3. Report abuse</h2>
              <p>
                If someone is harassing you, impersonating you, or sharing something they should
                not, block and report them in the app first — that stops it immediately. Then, if
                you want a person to look at it, email{" "}
                <a href="mailto:hello@growblic.com?subject=Abuse%20report">hello@growblic.com</a>{" "}
                with the subject <strong>&ldquo;Abuse report&rdquo;</strong>, the person&rsquo;s
                username or number, and what happened. Abuse reports are read first.
              </p>
            </section>

            <section id="policies">
              <h2>4. Policies</h2>
              <p>
                What we collect and who can see it: the <Link href="/privacy">Privacy Policy</Link>.
                The rules for using the app: the <Link href="/terms">Terms of Service</Link>. How to
                delete your account and what happens to your data:{" "}
                <Link href="/delete-account">Delete your account</Link>.
              </p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
