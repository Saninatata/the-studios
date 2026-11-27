# The Studios — Design Authority

White-and-glass agency site. Vite + React + TypeScript shell; the interactive home is a three.js scene (`src/engine/`) where the studio builds itself as you scroll.

**Pages** (hash routes, so they work on GitHub Pages): `#/` home · `#/services` · `#/work` · `#/work/<id>` · `#/about` · `#/quote` · `#/contact`

```bash
npm install
npm run dev        # http://localhost:5173
npm run build && npm run lint
```

## Edit your content
- `src/site/data.js` — email, location, services, process, FAQ, quote options, project case-study text. **Everything is placeholder.**
- `src/engine/content.js` — the home page's chapters and the three framed projects. Set `image: 'url'` on a project to use a real screenshot instead of the generated artwork.
- Forms: set `CONTACT.formEndpoint` (Formspree / Web3Forms URL) in `data.js`. Empty = the visitor's email app opens with the message filled in.

## Deploy to GitHub Pages
Repo → Settings → Pages → Source: **GitHub Actions**. Push to `main`; `.github/workflows/deploy.yml` builds and publishes `dist/`.
