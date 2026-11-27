import { useState } from 'react';
import { CONTACT, FAQ, submitForm } from '../data.js';

export default function Contact() {
  const [state, setState] = useState<'idle' | 'busy' | 'sent' | 'mailto' | 'error'>('idle');
  const [faq, setFaq] = useState(0);
  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState('busy');
    try { setState(await submitForm('New message — The Studios', { Name: String(f.get('name')), Email: String(f.get('email')), Message: String(f.get('message')) }) as 'sent' | 'mailto'); }
    catch { setState('error'); }
  };
  return (
    <>
      <section className="hero">
        <p className="eyebrow rv">Contact</p>
        <h1 className="h1 display rv">Say hello.</h1>
        <p className="lead rv">Tell us what you are making. We reply within one working day.</p>
      </section>
      <section className="block split">
        <div className="rv">
          <dl className="facts">
            <div><dt className="caps">Email</dt><dd><a className="link" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd></div>
            <div><dt className="caps">Studio</dt><dd>{CONTACT.location}</dd></div>
            <div><dt className="caps">Hours</dt><dd>{CONTACT.hours}</dd></div>
            {CONTACT.socials.length > 0 && <div><dt className="caps">Elsewhere</dt><dd>{CONTACT.socials.map(([n, u]: string[]) => <a key={n} className="link" href={u} target="_blank" rel="noreferrer">{n} </a>)}</dd></div>}
          </dl>
        </div>
        <form className="form glass rv" onSubmit={send}>
          <label className="field"><span className="caps">Name</span><input name="name" required autoComplete="name" /></label>
          <label className="field"><span className="caps">Email</span><input name="email" type="email" required autoComplete="email" /></label>
          <label className="field"><span className="caps">Message</span><textarea name="message" rows={5} required></textarea></label>
          <button className="pill display" type="submit" disabled={state === 'busy'}>{state === 'busy' ? 'Sending…' : 'Send message'}</button>
          {state === 'sent' && <p className="note">Thank you. We will be in touch shortly.</p>}
          {state === 'mailto' && <p className="note">Your email app should have opened with the message ready to send.</p>}
          {state === 'error' && <p className="note">That did not send. Please email us directly.</p>}
        </form>
      </section>
      <section className="block">
        <p className="eyebrow rv">Questions</p>
        {FAQ.map(([q, a], i) => (
          <div key={q} className={'svc glass rv' + (faq === i ? ' is-open' : '')}>
            <button className="svc__head svc__head--faq" type="button" aria-expanded={faq === i} onClick={() => setFaq(faq === i ? -1 : i)}><span className="svc__name display">{q}</span><span className="svc__plus" aria-hidden="true"></span></button>
            <div className="svc__body"><div><p>{a}</p></div></div>
          </div>
        ))}
      </section>
    </>
  );
}
