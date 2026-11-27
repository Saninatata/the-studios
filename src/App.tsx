import { lazy, Suspense, useEffect } from 'react';
import { useRoute } from './site/router';
import Nav from './site/Nav';
import Footer from './site/Footer';
const Home = lazy(() => import('./site/Home'));   // three.js loads only when the 3D home page is opened
import Services from './site/pages/Services';
import Work from './site/pages/Work';
import Museum from './site/pages/Museum';
import CaseStudy from './site/pages/CaseStudy';
import About from './site/pages/About';
import Quote from './site/pages/Quote';
import Contact from './site/pages/Contact';

const TITLES = { home: 'Design Authority', services: 'Services', work: 'Work', case: 'Case study', museum: 'Museum', about: 'About', quote: 'Get a quote', contact: 'Contact', missing: 'Not found' } as const;

export default function App() {
  const route = useRoute();
  const key = route.name + (route.id ?? '');

  useEffect(() => {
    scrollTo(0, 0);
    document.title = route.name === 'home' ? 'The Studios — Design Authority' : `${TITLES[route.name]} — The Studios`;
  }, [key, route.name]);

  /* Scroll reveal: anything with class "rv" fades up as it enters the screen. */
  useEffect(() => {
    const io = new IntersectionObserver((list) => list.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
    document.querySelectorAll('.rv').forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [key]);

  const home = route.name === 'home';
  return (
    <>
      <Nav route={route.name} sound={home} />
      {home ? <Suspense fallback={null}><Home /></Suspense> : (
        <div className="site">
          <div className="bgfx" aria-hidden="true"><i className="orb orb--a"></i><i className="orb orb--b"></i><i className="orb orb--c"></i></div>
          <main className="page" key={key}>
            {route.name === 'services' && <Services />}
            {route.name === 'work' && <Work />}
            {route.name === 'museum' && <Museum />}
            {route.name === 'case' && <CaseStudy id={route.id ?? ''} />}
            {route.name === 'about' && <About />}
            {route.name === 'quote' && <Quote />}
            {route.name === 'contact' && <Contact />}
            {route.name === 'missing' && (
              <section className="hero"><p className="eyebrow">404</p><h1 className="h1 display">Nothing built here yet.</h1><p className="lead">That page does not exist.</p><a className="pill display" href="#/">Back home</a></section>
            )}
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}
