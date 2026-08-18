import type { Metadata } from "next";
import Nav from "@/components/Nav";
import EnvLayer from "@/components/EnvLayer";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";
import { SKIFI_URL, GROWBLIC_APP_URL, PLAY_DEV_URL } from "@/components/links";

export const metadata: Metadata = {
  title: "Growblic Apps | Every app we have shipped",
  description:
    "35+ Growblic apps live on the Play Store and App Store: Skifi, Growblic, Classta, Fresh Fade, Bill Vault, and more.",
};

const NAMES: Record<string, string> = {
  "growblic-earn-money-online": "Growblic",
  "gst-billing-management": "GST Billing",
  "payroll-hr": "PayRoll+HR",
  "pivotos-minimalist-launcher": "PivotOS",
  "colorcraft-asmr": "ColorCraft ASMR",
  "eventsync-organizer": "EventSync Organizer",
  "event-sync": "EventSync",
  "fresh-fade-in": "Fresh Fade In",
  "fresh-fade-business": "Fresh Fade Business",
  "fresh-fold-vendor": "Fresh Fold Vendor",
  "classta-admin": "Classta Admin",
  "classta-mentor": "Classta Mentor",
  "myniq-admin": "Myniq Admin",
  "pairup-meet": "Pairup Meet",
  "jeev-setu": "Jeev Setu",
  "kheti-hub": "Kheti Hub",
  "growblic-captain": "Growblic Captain",
  "socioconnect": "SocioConnect",
  "tapmystic": "TapMystic",
  "true-auth": "True Auth",
  nil: "NIL",
  qmail: "Qmail",
};

const APPS = [
  "growblic-earn-money-online", "classta", "fresh-fade", "bill-vault",
  "project-pipeline", "gst-billing-management", "payroll-hr", "fresh-fold",
  "pivotos-minimalist-launcher", "qmail", "lockvault", "docura", "presenta",
  "myniq", "myniq-admin", "sociva", "socioconnect", "pairup-meet",
  "chess-offline", "colorcraft-asmr", "dexa-sheet", "event-sync",
  "eventsync-organizer", "fresh-fade-business", "fresh-fade-in",
  "fresh-fold-vendor", "growblic-captain", "ins-petro", "jeev-setu",
  "kheti-hub", "kumbha", "nil", "classta-admin", "classta-mentor",
  "property-dost", "tapmystic", "true-auth",
];

const titleCase = (slug: string) =>
  NAMES[slug] ||
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export default function AppsPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <EnvLayer />
      <Nav />
      <main id="main" tabIndex={-1} className="subpage">
        <Reveal className="apps-head">
          <p className="kicker r" style={{ "--i": 0 } as React.CSSProperties}>
            Our apps
          </p>
          <h1 className="r" style={{ "--i": 1 } as React.CSSProperties}>
            Every app we have shipped.
          </h1>
          <p className="lede r" style={{ "--i": 2 } as React.CSSProperties}>
            35+ live products on the Play Store and App Store. Every one
            designed, built, and grown by this team. Tap any of them to find
            it on Google Play.
          </p>
          <a
            className="skifi-feat r"
            style={{ "--i": 3 } as React.CSSProperties}
            href={SKIFI_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="skifi-art" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/still-skifi.jpg" alt="" loading="lazy" />
            </span>
            <span className="skifi-body">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="skifi-icon"
                src="/assets/apps/skifi-icon.png"
                alt=""
                width={512}
                height={512}
              />
              <span className="skifi-kicker">New / Chatting app</span>
              <span className="skifi-name">Skifi</span>
              <span className="skifi-copy">
                Real-time chat and calls, built the Growblic way. Fast, clean,
                and yours.
              </span>
              <span className="btn btn-solid">Get it on Google Play</span>
            </span>
          </a>
          <div className="app-all r" style={{ "--i": 4 } as React.CSSProperties}>
            <a
              className="app-tile"
              href={SKIFI_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/apps/skifi-icon.png"
                alt=""
                loading="lazy"
                width={120}
                height={120}
              />
              <span>Skifi</span>
            </a>
            {APPS.map((slug) => (
              <a
                key={slug}
                className="app-tile"
                href={
                  slug === "growblic-earn-money-online"
                    ? GROWBLIC_APP_URL
                    : PLAY_DEV_URL
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/assets/apps/${slug}.webp`}
                  alt=""
                  loading="lazy"
                  width={120}
                  height={120}
                />
                <span>{titleCase(slug)}</span>
              </a>
            ))}
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
