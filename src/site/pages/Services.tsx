import { useState } from 'react';
import { SERVICES, PROCESS } from '../data.js';

export default function Services() {
  const [open, setOpen] = useState<string>(SERVICES[0].id);
  return (
    <>
      <section className="hero">
        <p className="eyebrow rv">Services</p>
        <h1 className="h1 display rv">What we<br />build.</h1>
        <p className="lead rv">Six disciplines, one team. Pick one, or let us run the whole thing from the ground up.</p>
      </section>

      <section className="block" aria-label="Services">
        {SERVICES.map((s) => {
          const on = open === s.id;
          return (
            <div key={s.id} className={'svc glass rv' + (on ? ' is-open' : '')}>
              <button className="svc__head" type="button" aria-expanded={on} onClick={() => setOpen(on ? '' : s.id)}>
                <span className="svc__n caps">{s.n}</span>
                <span className="svc__name display">{s.name}</span>
                <span className="svc__line">{s.line}</span>
                <span className="svc__plus" aria-hidden="true"></span>
              </button>
              <div className="svc__body"><div>
                <ul className="chips">{s.items.map((i) => <li key={i} className="chip">{i}</li>)}</ul>
                <p className="svc__suits"><span className="caps">Suits</span> {s.suits}</p>
                <a className="link" href="#/quote">Quote this →</a>
              </div></div>
            </div>
          );
        })}
      </section>

      <section className="block">
        <p className="eyebrow rv">How we work</p>
        <h2 className="h2 display rv">The studio builds itself<br />in four moves.</h2>
        <div className="grid4">
          {PROCESS.map((p, i) => (
            <article key={p.name} className="gcard rv" style={{ transitionDelay: `${i * 70}ms` }}>
              <span className="caps">{p.n}/IV</span><h3 className="display">{p.name}</h3><p>{p.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
