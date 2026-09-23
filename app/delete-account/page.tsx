import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import EnvLayer from "@/components/EnvLayer";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Delete your account | Growblic",
  description:
    "How to delete your Growblic account from inside the app, what is deleted, what is kept and why, and who to contact if you cannot get in.",
};

const css = (v: number) => ({ "--i": v } as React.CSSProperties);

const SECTIONS: { id: string; title: string }[] = [
  { id: "how", title: "1. How to delete your account" },
  { id: "deleted", title: "2. What is deleted" },
  { id: "kept", title: "3. What is kept, and why" },
  { id: "help", title: "4. If you cannot get in" },
];

export default function DeleteAccountPage() {
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
            Your account
          </p>
          <h1 className="r" style={css(1)}>
            Delete your account
          </h1>
          <p className="lede r" style={css(2)}>
            You can delete your <strong>Growblic: Chat, Call, Meet</strong> account and its
            data yourself, from inside the app, at any time. You do not need to ask us, and
            you do not need to wait. This page explains how, and exactly what happens to
            your data.
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
            {/* HOW comes first: someone on this page came to do it, not to read about it. */}
            <section id="how">
              <h2>1. How to delete your account</h2>
              <ol>
                <li>
                  Open Growblic and go to <strong>Settings</strong>.
                </li>
                <li>
                  Tap <strong>Account</strong>, then <strong>Delete account</strong>.
                </li>
                <li>
                  Enter your own phone number to confirm it is you, and confirm the deletion.
                </li>
              </ol>
              <p>
                Deletion takes effect <strong>immediately</strong>. You are signed out on
                every device straight away, and your phone number is free to register a new
                account with right away.
              </p>
              <p>
                <strong>This cannot be undone.</strong> There is no recovery period, and we
                cannot restore a deleted account for you.
              </p>
            </section>

            <section id="deleted">
              <h2>2. What is deleted</h2>
              <p>All of this is removed when you delete your account:</p>
              <ul>
                <li>
                  <strong>Your phone number, email address and sign-in credentials.</strong>
                </li>
                <li>
                  <strong>Your profile</strong> — display name, username, photo, about text,
                  business details and privacy settings.
                </li>
                <li>
                  <strong>Your contacts and connections</strong> — favourites, blocked list,
                  and Nearby People connections.
                </li>
                <li>
                  <strong>Your chat list</strong> — group memberships, starred messages,
                  drafts and per-chat settings.
                </li>
                <li>
                  <strong>Media you uploaded</strong> — photos, videos, voice notes and files.
                </li>
                <li>
                  <strong>Your call history, status posts, and your Dating profile</strong> if
                  you used those features.
                </li>
                <li>
                  <strong>Your notification tokens</strong>, so the app stops reaching your
                  devices.
                </li>
              </ul>
              <p>
                Encrypted message content is unreadable to us whether it is stored or deleted
                — we never held the keys to it in the first place.
              </p>
            </section>

            {/* The reason sits next to each item. A bare list of retained data reads like a catch. */}
            <section id="kept">
              <h2>3. What is kept, and why</h2>
              <p>
                A few things survive, and each has a reason we think you would agree with if
                you were on the other side of it:
              </p>
              <ul>
                <li>
                  <strong>Messages you already sent to other people.</strong> They are sitting
                  in the other person&rsquo;s chat, and those are their messages — we do not
                  reach into someone else&rsquo;s history and remove things. They stay, shown
                  as being from a deleted account.
                </li>
                <li>
                  <strong>Groups you created.</strong> The group keeps working for everyone
                  still in it. You are removed from it and your name no longer appears.
                </li>
                <li>
                  <strong>Your username, for 30 days.</strong> Held so that nobody can take
                  your handle straight away and be mistaken for you. After 30 days it is
                  released.
                </li>
                <li>
                  <strong>Records we are required to keep.</strong> A small number of records
                  may be retained where the law requires it, or to deal with abuse reports and
                  payment disputes. They are not used to contact you.
                </li>
              </ul>
              <p>
                For the fuller picture, see our{" "}
                <Link href="/privacy">Privacy Policy</Link>.
              </p>
            </section>

            <section id="help">
              <h2>4. If you cannot get in</h2>
              <p>
                If you have lost access to your phone number, or the app will not let you
                delete the account, write to{" "}
                <a href="mailto:privacy@growblic.com?subject=Delete%20my%20Growblic%20account">
                  privacy@growblic.com
                </a>{" "}
                from the email address or phone number linked to the account, and we will
                delete it for you.
              </p>
              <p>
                Please include the phone number on the account. We process these requests{" "}
                <strong>within 30 days</strong>, and usually much sooner.
              </p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
