import type { Metadata } from "next";
import Nav from "@/components/Nav";
import EnvLayer from "@/components/EnvLayer";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";
import { SKIFI_URL, PLAY_DEV_URL } from "@/components/links";

export const metadata: Metadata = {
  title: "About Growblic | The team behind the apps",
  description:
    "Growblic is a software studio that builds premium digital products and then grows them: 35+ apps live on the stores, 50+ projects delivered, one in-house team.",
};

const css = (v: number) => ({ "--i": v } as React.CSSProperties);

const CATEGORIES: { name: string; apps: string }[] = [
  { name: "Education", apps: "Classta, Classta Mentor" },
  { name: "Retail and billing", apps: "GST Billing, Myniq" },
  { name: "Grooming and salons", apps: "Fresh Fade" },
  { name: "Laundry services", apps: "Fresh Fold" },
  { name: "Agriculture", apps: "Kheti Hub, Jeev Setu" },
  { name: "Real estate", apps: "Property Dost" },
  { name: "Events", apps: "EventSync" },
  { name: "Productivity", apps: "Project Pipeline, Bill Vault, Docura" },
  { name: "Social and community", apps: "Sociva, SocioConnect" },
  { name: "Communication", apps: "Skifi, Qmail" },
];

export default function AboutPage() {
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
            About Growblic
          </p>
          <h1 className="r" style={css(1)}>
            Software, grown by hand.
          </h1>
          <p className="lede r" style={css(2)}>
            We are a software studio that builds premium digital products and
            then grows them. One team, end to end: from the first sketch to
            the store listing to the marketing that follows.
          </p>
          <dl className="stats r" style={css(3)}>
            <div>
              <dt>Apps live on the stores</dt>
              <dd>35+</dd>
            </div>
            <div>
              <dt>Projects delivered</dt>
              <dd>50+</dd>
            </div>
            <div>
              <dt>Business categories</dt>
              <dd>10+</dd>
            </div>
            <div>
              <dt>Services under one roof</dt>
              <dd>9</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal className="about-story-sec">
          <p className="kicker r" style={css(0)}>
            The story
          </p>
          <h2 className="r" style={css(1)}>
            Where this comes from.
          </h2>
          <div className="about-story">
            <p className="r" style={css(2)}>
              Growblic started with a simple idea: build software the way you
              would want it built for yourself. Real products, plain words,
              honest numbers, and no disappearing after launch.
            </p>
            <p className="r" style={css(3)}>
              Instead of pitching decks, we shipped. 35+ of our own apps went
              live on the Play Store and App Store: school platforms, salon
              bookings, billing systems, laundry services, farming tools,
              games, and our own chatting apps. Building for ourselves taught
              us what clients actually need: speed, ownership, and someone
              who answers.
            </p>
            <p className="r" style={css(4)}>
              Today we design, build, and grow software for businesses across
              10+ categories, with 50+ projects delivered. The name says the
              plan: grow, publicly. We build it, then we put it in front of
              people with search, ads, and reviews, run by the same hands
              that wrote the code.
            </p>
          </div>
        </Reveal>

        <Reveal className="about-values">
          <p className="kicker r" style={css(0)}>
            What we believe
          </p>
          <h2 className="r" style={css(1)}>
            Four things we refuse to compromise.
          </h2>
          <div className="role-grid">
            <div className="role-card r" style={css(2)}>
              <h3>You own everything</h3>
              <p>
                Code, designs, accounts, and domains sit in your name from day
                one. If we ever part ways, you lose nothing.
              </p>
            </div>
            <div className="role-card r" style={css(3)}>
              <h3>Plain words</h3>
              <p>
                You will never need a translator to talk to us, and you will
                never chase us. Same-day replies, always.
              </p>
            </div>
            <div className="role-card r" style={css(4)}>
              <h3>The team you meet builds</h3>
              <p>
                In-house engineers, designers, and growth marketers. No
                subcontractors, no strangers after the contract.
              </p>
            </div>
            <div className="role-card r" style={css(5)}>
              <h3>Launch is the start</h3>
              <p>
                Fixes and updates come first, then growth. Launch day is the
                beginning of the relationship, not the goodbye.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal className="about-founder">
          <p className="kicker r" style={css(0)}>
            The people
          </p>
          <h2 className="r" style={css(1)}>
            Who you will work with.
          </h2>
          <div className="about-split">
            <div className="about-story">
              <p className="r" style={css(2)}>
                Bintu Malik started Growblic as a builder first: the studio
                shipped its own apps before it took its first client. That
                order still shapes everything. We know what it costs to
                design, launch, and grow a product, because we do it for
                ourselves every month.
              </p>
              <p className="r" style={css(3)}>
                Around the founder is an in-house team of engineers,
                designers, and growth marketers who ship together every week.
                The people you talk to are the people who build.
              </p>
            </div>
            <div className="about-team r" style={css(4)}>
              <a
                className="founder-card"
                href="https://www.linkedin.com/in/bintu-malik-6b7917387"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="monogram" aria-hidden="true">
                  BM
                </span>
                <span>
                  <strong>Bintu Malik</strong>
                  <em>Founder</em>
                </span>
              </a>
              <p>
                Engineers, designers, and growth marketers, all in-house.
              </p>
              <a className="about-join" href="/careers">
                We are hiring. See careers
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal className="about-cats">
          <p className="kicker r" style={css(0)}>
            Where we have shipped
          </p>
          <h2 className="r" style={css(1)}>
            Ten categories and counting.
          </h2>
          <p className="lede r" style={css(2)}>
            Every category below has real Growblic software running in it
            today, most of it live on the stores for anyone to try.
          </p>
          <div className="cat-grid r" style={css(3)}>
            {CATEGORIES.map((c) => (
              <div key={c.name} className="cat-card">
                <h3>{c.name}</h3>
                <p>{c.apps}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="about-contact">
          <p className="kicker r" style={css(0)}>
            Find us
          </p>
          <h2 className="r" style={css(1)}>
            Say hello.
          </h2>
          <div className="about-split">
            <div className="about-story">
              <p className="r" style={css(2)}>
                The fastest way to reach us is email, and you will hear back
                the same business day. Our apps are on the stores, our
                chatting app Skifi is on its way, and the rest of us is on
                the usual places.
              </p>
              <div className="contact-ctas r" style={css(3)}>
                <a
                  className="btn btn-solid"
                  href="mailto:hello@growblic.com?subject=Hello"
                >
                  hello@growblic.com
                </a>
                <a className="btn btn-ghost" href="/apps">
                  See our apps
                </a>
              </div>
            </div>
            <div className="about-team r" style={css(4)}>
              <ul className="contact-list">
                <li>
                  <a href={SKIFI_URL} target="_blank" rel="noopener noreferrer">
                    Skifi chatting app
                  </a>
                </li>
                <li>
                  <a href={PLAY_DEV_URL} target="_blank" rel="noopener noreferrer">
                    Growblic on Google Play
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@growblic"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YouTube
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/bintumalik545"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    X
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/growblic"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/bintu-malik-6b7917387"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
