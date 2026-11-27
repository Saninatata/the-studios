import '@fontsource/instrument-serif/400.css';
import '@fontsource-variable/geist';
import './styles/style.css';
import './styles/site.css';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = document.getElementById('root');
if (!root) throw new Error('#root is missing from index.html');
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
// No StrictMode on purpose: the 3D home page owns a WebGL context and its own animation loop.
createRoot(root).render(<App />);
