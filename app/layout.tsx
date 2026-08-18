import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CursorGlow from "@/components/CursorGlow";
import SmoothAnchors from "@/components/SmoothAnchors";

const display = localFont({
  src: [
    { path: "./fonts/clash-display-500.woff2", weight: "500" },
    { path: "./fonts/clash-display-600.woff2", weight: "600" },
  ],
  variable: "--font-display",
  display: "swap",
});

const body = localFont({
  src: [
    { path: "./fonts/switzer-400.woff2", weight: "400" },
    { path: "./fonts/switzer-500.woff2", weight: "500" },
  ],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono",
  display: "swap",
});

/* DEPLOY STEP: confirm the live origin below before shipping. og:image resolves against it. */
export const metadata: Metadata = {
  metadataBase: new URL("https://www.growblic.com"),
  title: "Growblic | Growth, engineered",
  description:
    "Growblic designs, builds, and grows websites, mobile apps, SaaS, and AI products. 35+ apps live on the stores. You own everything, same-day replies, fixed quotes.",
  openGraph: {
    title: "Growblic | Growth, engineered",
    description:
      "One team that designs it, builds it, ships it, and grows it. 35+ apps live on the stores.",
    url: "/",
    siteName: "Growblic",
    images: ["/assets/hero-ending.jpg"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0b0d",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <noscript>
          <style>{`.sec .r{opacity:1 !important;transform:none !important}.step{opacity:1 !important}.vine{display:none}.hero{height:auto}.stage{position:relative;height:100svh}.bands,.ring,.cue{display:none !important}.static-hero{display:flex !important}`}</style>
        </noscript>
        {children}
        <CursorGlow />
        <SmoothAnchors />
      </body>
    </html>
  );
}
