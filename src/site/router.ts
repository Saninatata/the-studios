import { useSyncExternalStore } from 'react';

export type Route = { name: 'home' | 'services' | 'work' | 'case' | 'museum' | 'about' | 'quote' | 'contact' | 'missing'; id?: string };

/** Hash routes (#/services, #/work/renderit …): they work on GitHub Pages and any static host with no server setup. */
export function parse(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const [a, b] = parts;
  if (!a) return { name: 'home' };
  if (a === 'work') return b ? { name: 'case', id: b } : { name: 'work' };
  if (a === 'museum') return { name: 'museum' };
  if (a === 'services' || a === 'about' || a === 'quote' || a === 'contact') return { name: a };
  return { name: 'missing' };
}

const subscribe = (cb: () => void) => { addEventListener('hashchange', cb); return () => removeEventListener('hashchange', cb); };
const snapshot = () => location.hash;

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, snapshot, () => '');
  return parse(hash);
}
