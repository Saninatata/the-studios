import { useEffect, useState } from 'react';
import { PROJECTS } from '../../engine/content.js';
import { projectImage } from '../../engine/art.js';
import { PROJECT_META } from '../data.js';

type Meta = { category: string; year: string; role: string; services: string[] };
const META = PROJECT_META as Record<string, Meta>;
const CATS = ['All', ...Array.from(new Set(Object.values(META).map((m) => m.category)))];

export default function Work() {
  const [cat, setCat] = useState('All');
  const [, redraw] = useState(0);
  useEffect(() => { document.fonts.load('128px "Instrument Serif"').then(() => redraw(1)); }, []);
  const list = PROJECTS.filter((p) => cat === 'All' || META[p.id]?.category === cat);
  return (
    <>
      <section className="hero">
        <p className="eyebrow rv">Work</p>
        <h1 className="h1 display rv">Selected<br />pieces.</h1>
        <p className="lead rv">Each one hung only when it was ready to be judged.</p>
      </section>
      <section className="block">
        <div className="filters" role="group" aria-label="Filter by type">
          {CATS.map((c) => <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
        </div>
        <div className="grid3">
          {list.map((p) => (
            <a key={p.id} className="wcard glass in" href={`#/work/${p.id}`}>
              <span className="wcard__img"><img src={projectImage(p)} alt={p.name} loading="lazy" /></span>
              <span className="wcard__meta"><span className="display">{p.name}</span><span className="caps">{META[p.id]?.category} — {META[p.id]?.year}</span></span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
