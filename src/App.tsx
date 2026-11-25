// Markup only. src/engine/engine.js finds these elements by id / class and drives them.
const Sound = () => (
  <button className="sound caps" type="button" data-sound-toggle aria-pressed="true">
    <span className="sound__bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
    <span data-sound-label>Sound [on]</span>
  </button>
);

export default function App() {
  return (
    <>
      <div className="preloader" id="preloader" role="status" aria-live="polite">
        <p className="preloader__top caps">Design Authority</p>
        <div className="preloader__frame" id="preFrame"><img className="preloader__mark" src="/studios-mark.svg" alt="The Studios monogram" /></div>
        <div className="preloader__enter" id="preEnter" hidden>
          <button className="pill display" id="enterBtn" type="button">Enter</button>
          <Sound />
        </div>
        <p className="preloader__count caps" id="preCount">000</p>
        <p className="preloader__status caps" id="preStatus">Ground</p>
        <p className="preloader__hint caps" id="preHint" hidden>Best on a large screen. Scroll slowly.</p>
      </div>

      <section className="hero" id="hero" aria-label="The Studios visual introduction" aria-hidden="true">
        <div className="hero__eyebrow caps">Independent creative studio · Selected visual culture</div>
        <div className="hero__collage" id="heroCollage"></div>
        <div className="hero__copy"><p className="caps">Art · Identity · Digital</p><h1 className="display">A world of<br /><em>visual ideas.</em></h1></div>
        <button className="hero__enter caps" id="heroEnter" type="button">Explore the exhibition <span>↘</span></button>
        <div className="hero__index caps">The Studios — Visual exhibition / 001</div>
      </section>

      <main className="stage" id="stage">
        <canvas className="stage__canvas" id="gl" aria-hidden="true"></canvas>
        <header className="header">
          <span className="caps header__about" aria-disabled="true">About</span>
          <a className="header__logo display" href="#top" id="logo" aria-label="The Studios — back to start">The<br />Studios</a>
          <Sound />
        </header>
        <div className="titles" id="titles"></div>
        <div className="bodies" id="bodies"></div>
        <button className="card glass" id="card" type="button" aria-label="View project">
          <span className="card__img"><img id="cardImg" alt="" /></span>
          <span className="card__cap" id="cardCap"></span>
        </button>
        <nav className="rail" id="rail" aria-label="Chapters"></nav>
        <p className="hint caps" id="hint">Scroll to<br /><span id="hintWord">build</span></p>
      </main>

      <div className="overlay" id="overlay" role="dialog" aria-modal="true" aria-labelledby="ovTitle" hidden>
        <button className="overlay__close caps" type="button" id="ovClose">Close <span>(Esc)</span></button>
        <nav className="overlay__nav"><button className="caps" type="button" id="ovPrev">← Previous</button><a className="caps" id="ovSource" href="#" target="_blank" rel="noreferrer">Original source ↗</a><button className="caps" type="button" id="ovNext">Next →</button></nav>
        <div className="overlay__left">
          <p className="overlay__year" id="ovYear"></p>
          <h2 className="overlay__title display" id="ovTitle"></h2>
          <p className="overlay__label" id="ovLabel"></p>
        </div>
        <figure className="overlay__figure glass"><img id="ovImg" alt="" /><iframe id="ovFrame" title="Live website preview" loading="lazy" hidden></iframe></figure>
        <div className="overlay__right" id="ovText"></div>
      </div>

      <div className="cursor" id="cursor" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none"><circle className="cursor__ring" cx="8" cy="8" r="7.75" /><circle className="cursor__dot" cx="8" cy="8" r="2" /></svg>
        <span className="cursor__label" id="cursorLabel">View</span>
      </div>

      <div className="scroll" id="top" aria-hidden="true"></div>
      <div className="no-gl caps" id="noGl"><p>This page needs WebGL 2.<br />Open it in a current browser.</p></div>
    </>
  );
}
