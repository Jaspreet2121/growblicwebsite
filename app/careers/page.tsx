import type { Metadata } from "next";
import Nav from "@/components/Nav";
import EnvLayer from "@/components/EnvLayer";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";
import RoleCard from "@/components/RoleCard";
import CareersForm from "@/components/CareersForm";

export const metadata: Metadata = {
  title: "Careers at Growblic | Jobs and internships",
  description:
    "Join Growblic: engineering, design, and growth roles, plus internships where you learn by shipping real products.",
};

const css = (v: number) => ({ "--i": v } as React.CSSProperties);

export default function CareersPage() {
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
            Careers
          </p>
          <h1 className="r" style={css(1)}>
            Grow with us.
          </h1>
          <p className="lede r" style={css(2)}>
            We design, build, and grow software all day, and we like company.
            If you build, design, or grow things, or you want to learn to,
            we want to hear from you.
          </p>
          <div className="role-grid r" style={css(3)}>
            <RoleCard
              role="Engineering"
              title="Engineering"
              copy="Web, mobile, and backend. You ship real products that real people use."
            />
            <RoleCard
              role="Design"
              title="Design"
              copy="Product and visual design. You decide how our work looks and feels."
            />
            <RoleCard
              role="Growth marketing"
              title="Growth marketing"
              copy="SEO, ads, and content. You put what we build in front of people."
            />
            <RoleCard
              role="Internship"
              title="Internship"
              copy="Learn by shipping. Real projects, real mentorship, a real path to a role."
            />
          </div>
        </Reveal>
        <Reveal id="apply" className="careers-apply">
          <p className="kicker r" style={css(0)}>
            Apply
          </p>
          <h2 className="r" style={css(1)}>
            Tell us about yourself.
          </h2>
          <p className="lede r" style={css(2)}>
            No cover letter rituals. A few honest lines and a link to
            something you have made beat a formal essay every time.
          </p>
          <div className="start-panel r" style={css(3)}>
            <CareersForm />
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
