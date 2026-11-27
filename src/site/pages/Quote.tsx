import { useState } from 'react';
import { SERVICES, QUOTE, submitForm } from '../data.js';

export default function Quote() {
  const [picked, setPicked] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [time, setTime] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'sent' | 'mailto' | 'error'>('idle');
  const toggle = (n: string) => setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));
  const steps = [picked.length > 0, !!budget, !!time];
  const done = steps.filter(Boolean).length;

  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState('busy');
    try {
      setState(await submitForm('Quote request — The Studios', {
        Name: String(f.get('name')), Email: String(f.get('email')), Company: String(f.get('company')),
        Services: picked, Budget: budget || 'Not given', Timeline: time || 'Not given', Brief: String(f.get('brief')),
      }) as 'sent' | 'mailto');
    } catch { setState('error'); }
  };

  return (
    <>
      <section className="hero">
        <p className="eyebrow rv">Get a quote</p>
        <h1 className="h1 display rv">Tell us what<br />to build.</h1>
        <p className="lead rv">Four short steps. You will hear back within one working day with a plan and a price.</p>
      </section>
      <form className="quote block" onSubmit={send}>
        <div className="quote__main">
          <fieldset className="qstep glass rv"><legend className="caps">1 — What do you need?</legend>
            <div className="chips">{SERVICES.map((s) => <button key={s.id} type="button" className="chip chip--lg" aria-pressed={picked.includes(s.name)} onClick={() => toggle(s.name)}>{s.name}</button>)}</div>
          </fieldset>
          <fieldset className="qstep glass rv"><legend className="caps">2 — Budget</legend>
            <div className="chips">{QUOTE.budgets.map((b) => <button key={b} type="button" className="chip chip--lg" aria-pressed={budget === b} onClick={() => setBudget(b)}>{b}</button>)}</div>
          </fieldset>
          <fieldset className="qstep glass rv"><legend className="caps">3 — Timeline</legend>
            <div className="chips">{QUOTE.timelines.map((t) => <button key={t} type="button" className="chip chip--lg" aria-pressed={time === t} onClick={() => setTime(t)}>{t}</button>)}</div>
          </fieldset>
          <fieldset className="qstep glass rv"><legend className="caps">4 — About you</legend>
            <div className="form form--flat">
              <label className="field"><span className="caps">Name</span><input name="name" required autoComplete="name" /></label>
              <label className="field"><span className="caps">Email</span><input name="email" type="email" required autoComplete="email" /></label>
              <label className="field"><span className="caps">Company (optional)</span><input name="company" autoComplete="organization" /></label>
              <label className="field"><span className="caps">The brief</span><textarea name="brief" rows={5} required placeholder="What are you making, and what should it do?"></textarea></label>
            </div>
          </fieldset>
        </div>
        <aside className="quote__side glass rv" aria-live="polite">
          <p className="eyebrow">Your quote request</p>
          <div className="meter" aria-hidden="true"><i style={{ transform: `scaleX(${done / 3})` }}></i></div>
          <dl className="facts">
            <div><dt className="caps">Services</dt><dd>{picked.length ? picked.join(', ') : '—'}</dd></div>
            <div><dt className="caps">Budget</dt><dd>{budget || '—'}</dd></div>
            <div><dt className="caps">Timeline</dt><dd>{time || '—'}</dd></div>
          </dl>
          <button className="pill display" type="submit" disabled={state === 'busy' || picked.length === 0}>{state === 'busy' ? 'Sending…' : 'Request quote'}</button>
          {picked.length === 0 && <p className="note">Pick at least one service to continue.</p>}
          {state === 'sent' && <p className="note">Thank you. We will reply within one working day.</p>}
          {state === 'mailto' && <p className="note">Your email app should have opened with the request ready to send.</p>}
          {state === 'error' && <p className="note">That did not send. Please email us directly.</p>}
        </aside>
      </form>
    </>
  );
}
