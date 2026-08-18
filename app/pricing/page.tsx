import type { Metadata } from "next";
import Nav from "@/components/Nav";
import EnvLayer from "@/components/EnvLayer";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";
import Estimator from "@/components/Estimator";

export const metadata: Metadata = {
  title: "Pricing | Growblic",
  description:
    "Shape your project and get a real number: pick what you need and a fixed quote comes back the same business day. Never a surprise invoice.",
};

const css = (v: number) => ({ "--i": v } as React.CSSProperties);

export default function PricingPage() {
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
            Pricing
          </p>
          <h1 className="r" style={css(1)}>
            Shape your project. Get a real number.
          </h1>
          <p className="lede r" style={css(2)}>
            Pick what you need. Your choices open a ready-made email to us,
            and a fixed quote comes back the same business day.
          </p>
          <div className="r" style={css(3)}>
            <Estimator />
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
