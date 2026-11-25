import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// base './' so the build works on GitHub Pages (project sites live under /repo-name/).
export default defineConfig({ base: './', plugins: [react()], build: { target: 'es2022' } });
