import { useEffect, useState } from 'react';
import type { Route } from './router';

const LINKS: [string, string, Route['name'][]][] = [
  ['Services', '#/services', ['services']],
  ['Work', '#/work', ['work', 'case']],
  ['About', '#/about', ['about']],
  ['Contact', '#/contact', ['contact']],
];

export default function Nav({ route, sound }: { route: Route['name']; sound: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [route]);
  useEffect(() => { document.body.classList.toggle('menu-open', open); return () => document.body.classList.remove('menu-open'); }, [open]);
  const home = (e: React.MouseEvent) => { if (route === 'home') { e.preventDefault(); scrollTo({ top: 0, behavior: 'smooth' }); } };

  return (
    <header className={'nav' + (open ? ' is-open' : '')}>
      <nav className="nav__links caps" aria-label="Main">
        {LINKS.map(([label, href, names]) => (
          <a key={href} href={href} className={names.includes(route) ? 'is-active' : ''} aria-current={names.includes(route) ? 'page' : undefined}>{label}</a>
        ))}
      </nav>
      <a className="nav__logo display" href="#/" onClick={home} aria-label="The Studios — home">The<br />Studios</a>
      <div className="nav__right">
        {sound && (
          <button className="sound caps" type="button" data-sound-toggle aria-pressed="true">
            <span className="sound__bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
            <span data-sound-label>Sound [on]</span>
          </button>
        )}
        <a className="nav__cta caps" href="#/quote">Get a quote</a>
        <button className="nav__burger" type="button" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}><i></i><i></i></button>
      </div>
      <div className="nav__sheet glass" aria-hidden={!open}>
        {LINKS.map(([label, href]) => <a key={href} href={href} className="display">{label}</a>)}
        <a href="#/quote" className="display">Get a quote</a>
      </div>
    </header>
  );
}
