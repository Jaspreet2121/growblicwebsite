import Mark from "./Mark";
import { SKIFI_URL, GROWBLIC_APP_URL } from "./links";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-cta">
        <p className="footer-line">Software that grows.</p>
        <a className="btn btn-solid" href="/#start">
          Start your project
        </a>
      </div>
      <div className="footer-inner">
        <div className="footer-brand">
          <a className="nav-brand" href="/#top">
            <Mark />
            Growblic
          </a>
          <p>
            Premium digital products for modern businesses. Ideas, engineered
            into software people love to use.
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li>
              <a href="/#services">Services</a>
            </li>
            <li>
              <a href="/#process">Process</a>
            </li>
            <li>
              <a href="/#estimate">Pricing</a>
            </li>
            <li>
              <a href="/#faq">FAQ</a>
            </li>
          </ul>
        </div>
        <div>
          <h4>Apps</h4>
          <ul>
            <li>
              <a href={SKIFI_URL} target="_blank" rel="noopener noreferrer">
                Skifi chatting app
              </a>
            </li>
            <li>
              <a
                href={GROWBLIC_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Growblic app
              </a>
            </li>
            <li>
              <a href="/apps">All our apps</a>
            </li>
          </ul>
        </div>
        <div>
          <h4>Connect</h4>
          <ul>
            <li>
              <a href="mailto:hello@growblic.com">hello@growblic.com</a>
            </li>
            <li>
              <a href="/#start">Start a project</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bar">
        <p>© 2026 Growblic. All rights reserved.</p>
        <ul>
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
              href="https://www.linkedin.com/in/bintu-malik-6b7917387"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
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
        </ul>
      </div>
    </footer>
  );
}
