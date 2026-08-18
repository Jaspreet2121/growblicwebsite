import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import EnvLayer from "@/components/EnvLayer";
import Reveal from "@/components/Reveal";
import Vine from "@/components/Vine";
import PlantMoment from "@/components/PlantMoment";
import ContactForm from "@/components/ContactForm";
import Estimator from "@/components/Estimator";
import Footer from "@/components/Footer";
import Splash from "@/components/Splash";
import { SKIFI_URL, GROWBLIC_APP_URL, PLAY_DEV_URL } from "@/components/links";

const FEATURED = [
  { slug: "growblic-earn-money-online", name: "Growblic", desc: "Earn, play, and chat", rating: "4.6" },
  { slug: "classta", name: "Classta", desc: "School platform", rating: "4.8" },
  { slug: "fresh-fade", name: "Fresh Fade", desc: "Salon booking", rating: "5.0" },
  { slug: "bill-vault", name: "Bill Vault", desc: "Bills and warranties", rating: "4.9" },
  { slug: "project-pipeline", name: "Project Pipeline", desc: "Task management", rating: "5.0" },
  { slug: "gst-billing-management", name: "GST Billing", desc: "Retail billing", rating: "5.0" },
  { slug: "payroll-hr", name: "PayRoll+HR", desc: "HR and payroll", rating: "4.9" },
  { slug: "fresh-fold", name: "Fresh Fold", desc: "Laundry service", rating: "5.0" },
];

const css = (v: number) => ({ "--i": v } as React.CSSProperties);

export default function Home() {
  return (
    <>
      <Splash />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <EnvLayer />
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />

        <div className="main-wrap">
          <Vine />

          <Reveal className="intro">
            <p className="kicker r" style={css(0)}>
              Growblic / Software studio
            </p>
            <p className="r" style={css(1)}>
              One team that designs it, builds it, ships it, and grows it.
              Premium digital products for modern businesses.
            </p>
            <dl className="stats r" style={css(2)}>
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

          <Reveal id="services" className="svc-sec">
            <div data-vine-node />
            <p className="kicker r" style={css(0)}>
              Services
            </p>
            <h2 className="r" style={css(1)}>
              Everything software, under one roof.
            </h2>
            <div className="svc-grid">
              <div className="card card-lg r" style={css(2)}>
                <div className="still" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/still-web.jpg" alt="" loading="lazy" />
                </div>
                <div className="card-body">
                  <h3>Website development</h3>
                  <p>
                    Fast, modern sites that carry your brand and turn visitors
                    into enquiries.
                  </p>
                </div>
              </div>
              <div className="card card-lg r" style={css(3)}>
                <div className="still" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/still-custom.jpg" alt="" loading="lazy" />
                </div>
                <div className="card-body">
                  <h3>Software development</h3>
                  <p>
                    Custom business systems: operations, CRM, HR and payroll,
                    billing, reporting. Built around how you actually work.
                  </p>
                </div>
              </div>
              <div className="card card-sm r" style={css(4)}>
                <div className="still" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/still-mobile.jpg" alt="" loading="lazy" />
                </div>
                <div className="card-body">
                  <h3>Mobile apps</h3>
                  <p>
                    iOS and Android. Designed, built, and listed on the stores
                    under your name.
                  </p>
                </div>
              </div>
              <div className="card card-sm r" style={css(5)}>
                <div className="still" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/still-saas.jpg" alt="" loading="lazy" />
                </div>
                <div className="card-body">
                  <h3>SaaS products</h3>
                  <p>
                    From first sketch to paying subscribers. Accounts, billing,
                    analytics, the whole machine.
                  </p>
                </div>
              </div>
              <div className="card card-sm r" style={css(6)}>
                <div className="still" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/still-ai.jpg" alt="" loading="lazy" />
                </div>
                <div className="card-body">
                  <h3>AI automation</h3>
                  <p>
                    Assistants, pipelines, and automations that take real work
                    off your team&apos;s plate.
                  </p>
                </div>
              </div>
            </div>
            <div className="grow-strip r" style={css(7)}>
              <p className="grow-title">Then we grow it.</p>
              <ul className="grow-row">
                <li>
                  <h3>SEO</h3>
                  <p>Get found for the searches that matter, and stay there.</p>
                </li>
                <li>
                  <h3>Google Ads</h3>
                  <p>Campaigns managed to a number, not a feeling.</p>
                </li>
                <li>
                  <h3>Meta Ads</h3>
                  <p>Facebook and Instagram ads that find your buyers.</p>
                </li>
                <li>
                  <h3>Reviews and ratings</h3>
                  <p>Your Google profile and reputation, looked after.</p>
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal id="work" className="proof">
            <div data-vine-node />
            <p className="kicker r" style={css(0)}>
              Our apps
            </p>
            <h2 className="r" style={css(1)}>
              Built by us. Used every day.
            </h2>
            <p className="lede r" style={css(2)}>
              35+ of our own products are live on the stores. Real apps with
              real users, built end to end by this team.
            </p>
            <a
              className="skifi-feat r"
              style={css(3)}
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
                  Real-time chat and calls, built the Growblic way. Fast,
                  clean, and yours.
                </span>
                <span className="btn btn-solid">Get it on Google Play</span>
              </span>
            </a>
            <div className="app-feat r" style={css(4)}>
              {FEATURED.map((app) => (
                <a
                  key={app.slug}
                  className="app-card"
                  href={
                    app.slug === "growblic-earn-money-online"
                      ? GROWBLIC_APP_URL
                      : PLAY_DEV_URL
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/assets/apps/${app.slug}.webp`}
                    alt=""
                    loading="lazy"
                    width={120}
                    height={120}
                  />
                  <span className="app-name">{app.name}</span>
                  <span className="app-desc">{app.desc}</span>
                  <span className="app-rating" aria-label={`Rated ${app.rating} stars on Google Play`}>
                    <span aria-hidden="true">★</span> {app.rating}
                  </span>
                </a>
              ))}
            </div>
            <p className="proof-more r" style={css(5)}>
              <a className="btn btn-ghost" href="/apps">
                See all our apps
              </a>
            </p>
          </Reveal>

          <Reveal className="promises">
            <div data-vine-node />
            <p className="kicker r" style={css(0)}>
              The fine print, up front
            </p>
            <h2 className="r" style={css(1)}>
              What working with us feels like.
            </h2>
            <ol>
              <li className="r" style={css(2)}>
                <h3>You own everything.</h3>
                <p>
                  Code, designs, accounts, and domains sit in your name from day
                  one. If we ever part ways, you lose nothing.
                </p>
              </li>
              <li className="r" style={css(3)}>
                <h3>Same-day replies.</h3>
                <p>
                  You will never chase us for an update. Ask anything, get an
                  answer in plain words the same business day.
                </p>
              </li>
              <li className="r" style={css(4)}>
                <h3>The team you meet is the team that builds.</h3>
                <p>
                  No hand-offs, no subcontractors, no strangers appearing after
                  the contract is signed.
                </p>
              </li>
              <li className="r" style={css(5)}>
                <h3>Fixed quotes stay fixed.</h3>
                <p>
                  Changes are priced before work starts, never after. The number
                  you agree to is the number you pay.
                </p>
              </li>
              <li className="r" style={css(6)}>
                <h3>We stay after launch.</h3>
                <p>
                  Fixes and updates come first. Then growth. Launch day is the
                  start, not the goodbye.
                </p>
              </li>
            </ol>
          </Reveal>

          <Reveal id="process" className="plant-sec">
            <div data-vine-node />
            <div className="process-head">
              <div>
                <p className="kicker r" style={css(0)}>
                  How it works
                </p>
                <h2 className="r" style={css(1)}>
                  From seed to shipped.
                </h2>
              </div>
              <div className="r" style={css(2)}>
                <PlantMoment />
              </div>
            </div>
            <ol className="steps">
              <li className="step" style={css(0)}>
                <h3>Understand</h3>
                <p>
                  Your idea, your goal, your audience, your timeline. We learn
                  the business before we open an editor.
                </p>
              </li>
              <li className="step" style={css(1)}>
                <h3>Design</h3>
                <p>
                  Layouts, product flow, and screens. You see and steer it
                  before a line of code exists.
                </p>
              </li>
              <li className="step" style={css(2)}>
                <h3>Build</h3>
                <p>
                  Frontend, backend, integrations. Short cycles, working
                  software, progress you can click every week.
                </p>
              </li>
              <li className="step" style={css(3)}>
                <h3>Launch</h3>
                <p>
                  Testing, deployment, stores, domains, analytics. Handled, in
                  your name.
                </p>
              </li>
              <li className="step" style={css(4)}>
                <h3>Improve</h3>
                <p>
                  Fixes, new features, and growth. Real usage teaches, and we
                  tune from there.
                </p>
              </li>
            </ol>
          </Reveal>

          <Reveal id="estimate" className="estimate">
            <div data-vine-node />
            <p className="kicker r" style={css(0)}>
              Pricing
            </p>
            <h2 className="r" style={css(1)}>
              Shape your project. Get a real number.
            </h2>
            <p className="lede r" style={css(2)}>
              Pick what you need. Your choices land in the form below, and a
              fixed quote comes back the same business day.
            </p>
            <div className="r" style={css(3)}>
              <Estimator />
            </div>
          </Reveal>

          <Reveal id="faq" className="faq">
            <div data-vine-node />
            <div className="sec-head">
              <p className="kicker r" style={css(0)}>
                FAQ
              </p>
              <h2 className="r" style={css(1)}>
                Asked every week.
              </h2>
            </div>
            <div className="r" style={css(2)}>
              <details>
                <summary>What does Growblic build?</summary>
                <p>
                  Websites, mobile apps, SaaS platforms, dashboards, admin
                  panels, backend APIs, and automation systems. If your business
                  runs on it, we build it.
                </p>
              </details>
              <details>
                <summary>How much does a project cost?</summary>
                <p>
                  Every project gets a fixed quote before any commitment, with
                  the number and what drives it in plain words. Use the
                  estimator above or just write to us, and you will have it
                  within a day.
                </p>
              </details>
              <details>
                <summary>Who owns the code?</summary>
                <p>
                  You do. Repos, hosting, and store listings live in your
                  accounts. Always.
                </p>
              </details>
              <details>
                <summary>Who will actually work on my project?</summary>
                <p>
                  The people you talk to. Growblic is an in-house team. Nothing
                  is passed to strangers.
                </p>
              </details>
              <details>
                <summary>What happens after launch?</summary>
                <p>
                  We stay. Fixes and updates first, then growth: search, ads,
                  and reviews to put your product in front of people.
                </p>
              </details>
              <details>
                <summary>How fast do you reply?</summary>
                <p>Same business day, usually within hours.</p>
              </details>
            </div>
          </Reveal>

          <Reveal id="start" className="start">
            <div data-vine-node />
            <div className="sec-head">
              <p className="kicker r" style={css(0)}>
                Start
              </p>
              <h2 className="r" style={css(1)}>
                Tell us what you want to grow.
              </h2>
              <p className="lede r" style={css(2)}>
                One message starts it. You get a same-day reply, a
                plain-language plan, and a fixed quote. No pressure, no jargon.
              </p>
            </div>
            <div className="start-panel r" style={css(3)}>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </main>

      <Footer />
    </>
  );
}
