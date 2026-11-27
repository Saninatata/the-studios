import { useEffect } from 'react';
import { start } from '../engine/engine.js';
import Services from './pages/Services';
import Work from './pages/Work';
import About from './pages/About';
import Contact from './pages/Contact';
import Footer from './Footer';

/** The interactive home page: the studio builds itself as you scroll. The engine (src/engine) lives only while this page is open. */
export default function Home() {
  useEffect(() => {
    const io = new IntersectionObserver((items) => items.forEach((item) => { if (item.isIntersecting) { item.target.classList.add('in'); io.unobserve(item.target); } }), { threshold: 0.12 });
    document.querySelectorAll('.home-sections .rv').forEach((node) => io.observe(node));
    document.body.classList.remove('is-loading');
    const stop = start({ skipIntro: true });
    return () => { io.disconnect(); stop(); };
  }, []);

  return (
    <>
      <div className="preloader" id="preloader" role="status" aria-live="polite">
        <p className="preloader__top caps">Design Authority</p>
        <div className="preloader__frame glass" id="preFrame"><p className="preloader__title display">The<br />Studios</p></div>
        <div className="preloader__enter" id="preEnter" hidden>
          <button className="pill display" id="enterBtn" type="button">Enter</button>
          <button className="sound caps" type="button" data-sound-toggle aria-pressed="true">
            <span className="sound__bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
            <span data-sound-label>Sound [on]</span>
          </button>
        </div>
        <p className="preloader__count caps" id="preCount">000</p>
        <p className="preloader__status caps" id="preStatus">Ground</p>
        <p className="preloader__hint caps" id="preHint" hidden>Best on a large screen. Scroll slowly.</p>
      </div>

      <main className="stage" id="stage">
        <canvas className="stage__canvas" id="gl" aria-hidden="true"></canvas>
        <div className="titles" id="titles"></div>
        <div className="bodies" id="bodies"></div>
        <button className="card glass" id="card" type="button" aria-label="View project">
          <span className="card__img"><img id="cardImg" alt="" /></span>
          <span className="card__cap" id="cardCap"></span>
        </button>
        <div className="actions" id="actions">
          <a className="pill display" id="startBtn" href="#/quote">Get a quote</a>
          <button className="pill pill--ghost display" id="againBtn" type="button">Watch again</button>
        </div>
        <nav className="rail" id="rail" aria-label="Chapters"></nav>
        <p className="hint caps" id="hint">Scroll to<br /><span id="hintWord">build</span></p>
      </main>

      <div className="overlay" id="overlay" role="dialog" aria-modal="true" aria-labelledby="ovTitle" hidden>
        <button className="overlay__close caps" type="button" id="ovClose">Close <span>(Esc)</span></button>
        <div className="overlay__left">
          <p className="overlay__year" id="ovYear"></p>
          <h2 className="overlay__title display" id="ovTitle"></h2>
          <p className="overlay__label" id="ovLabel"></p>
        </div>
        <figure className="overlay__figure glass"><img id="ovImg" alt="" /></figure>
        <div className="overlay__right" id="ovText"></div>
      </div>

      <div className="cursor" id="cursor" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none"><circle className="cursor__ring" cx="8" cy="8" r="7.75" /><circle className="cursor__dot" cx="8" cy="8" r="2" /></svg>
        <span className="cursor__label">View</span>
      </div>

      <div className="scroll" id="top" aria-hidden="true"></div>
      <div className="site home-sections">
        <section id="services" className="home-section page"><Services /></section>
        <section id="work" className="home-section"><Work /></section>
        <section id="about" className="home-section"><About /></section>
        <section id="contact" className="home-section"><Contact /></section>
        <Footer />
      </div>
      <div className="no-gl caps" id="noGl"><p>This page needs WebGL 2.<br />Open it in a current browser.</p></div>
    </>
  );
}
