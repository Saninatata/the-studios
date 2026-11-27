import { useEffect, useState } from 'react';
import { PROJECTS } from '../../engine/content.js';
import { projectImage } from '../../engine/art.js';
import { PROJECT_META } from '../data.js';

type Meta = { category: string; year: string; role: string; services: string[]; brief: string; approach: string; result: string };
const META = PROJECT_META as Record<string, Meta>;

export default function CaseStudy({ id }: { id: string }) {
  const [, redraw] = useState(0);
  useEffect(() => { document.fonts.load('128px "Instrument Serif"').then(() => redraw(1)); }, []);
  const i = PROJECTS.findIndex((p) => p.id === id);
  if (i < 0) return <section className="hero"><p className="eyebrow">Work</p><h1 className="h1 display">Not found.</h1><a className="pill display" href="#/work">All work</a></section>;
  const p = PROJECTS[i], m = META[p.id], next = PROJECTS[(i + 1) % PROJECTS.length];
  return (
    <>
      <section className="hero">
        <a className="link" href="#/work">← All work</a>
        <h1 className="h1 display rv">{p.name}</h1>
        <p className="lead rv">{p.caption.replace(/^\d+ — /, '')}</p>
      </section>
      <figure className="case__img glass rv"><img src={projectImage(p)} alt={p.name} /></figure>
      <section className="block case__meta rv">
        <div><span className="caps">Year</span><p>{m.year}</p></div>
        <div><span className="caps">Role</span><p>{m.role}</p></div>
        <div><span className="caps">Services</span><p>{m.services.join(', ')}</p></div>
      </section>
      <section className="block case__text">
        {([['Brief', m.brief], ['Approach', m.approach], ['Result', m.result]] as const).map(([h, t]) => (
          <article key={h} className="rv"><h2 className="display">{h}</h2><p>{t}</p></article>
        ))}
      </section>
      <a className="next glass rv" href={`#/work/${next.id}`}><span className="caps">Next piece</span><span className="display">{next.name} →</span></a>
    </>
  );
}
