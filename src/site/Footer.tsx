import { CONTACT } from './data.js';

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot__cta glass rv">
        <p className="eyebrow">Have a brief?</p>
        <h2 className="display">Let us build yours.</h2>
        <div className="foot__btns"><a className="pill display" href="#/quote">Get a quote</a><a className="pill pill--ghost display" href="#/contact">Say hello</a></div>
      </div>
      <div className="foot__row caps">
        <span>© {new Date().getFullYear()} The Studios</span>
        <nav aria-label="Footer"><a href="#/services">Services</a><a href="#/work">Work</a><a href="#/about">About</a><a href="#/contact">Contact</a></nav>
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      </div>
    </footer>
  );
}
