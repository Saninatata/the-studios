import '@fontsource/instrument-serif/400.css';
import '@fontsource-variable/geist';
import './styles/style.css';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './App';
import { start } from './engine/engine.js';

const root = document.getElementById('root');
if (!root) throw new Error('#root is missing from index.html');
// React renders the markup once; the engine owns everything after that (no StrictMode on purpose).
flushSync(() => createRoot(root).render(<App />));
start();
