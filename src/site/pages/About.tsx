import { PRINCIPLES } from '../data.js';

export default function About() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow rv">About</p>
        <h1 className="h1 display rv">A studio that<br />builds itself.</h1>
        <p className="lead rv">The Studios is a design agency with a simple position: a brand should have authority. We design and build the whole thing, from the first idea to the last detail, so what you approve is what ships.</p>
      </section>
      <section className="block">
        <p className="eyebrow rv">Principles</p>
        <div className="grid4">
          {PRINCIPLES.map(([h, t], i) => <article key={h} className="gcard rv" style={{ transitionDelay: `${i * 70}ms` }}><h3 className="display">{h}</h3><p>{t}</p></article>)}
        </div>
      </section>
      <section className="block statement glass rv">
        <p className="display">Design Authority means we stand behind every decision, and can tell you why we made it.</p>
      </section>
    </>
  );
}
