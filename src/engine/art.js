/* Pastel stand-in artwork for each project. Set project.image to a real screenshot URL to replace it. */
/* A pastel "screen" for each project: replace with a real screenshot by setting project.image to a URL. */
export function artCanvas(p) {
  const w = 960, h = 660, c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, p.palette[0]); g.addColorStop(1, '#ffffff');
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  x.filter = 'blur(40px)'; x.fillStyle = p.palette[1]; x.globalAlpha = .75; x.beginPath(); x.arc(710, 210, 190, 0, 7); x.fill();
  x.globalAlpha = .35; x.beginPath(); x.arc(200, 560, 220, 0, 7); x.fill(); x.filter = 'none'; x.globalAlpha = 1;
  x.fillStyle = 'rgba(255,255,255,.72)';
  for (const [a, b, cw, ch] of [[70, 330, 340, 190], [430, 380, 220, 150], [670, 330, 220, 190]]) { x.beginPath(); x.roundRect(a, b, cw, ch, 28); x.fill(); }
  x.fillStyle = '#0d0d0f'; x.font = '400 128px "Instrument Serif", Georgia, serif'; x.fillText(p.name, 66, 238);
  x.font = '400 22px "Geist Variable", system-ui, sans-serif'; x.globalAlpha = .55; x.fillText(p.caption.toUpperCase(), 70, 90);
  return c;
}


const cache = {};
/** A data-URL image for a project (its own `image` if you set one). */
export function projectImage(p) {
  if (p.image) return p.image;
  if (cache[p.id]) return cache[p.id];
  const url = artCanvas(p).toDataURL('image/jpeg', 0.9);
  if (document.fonts.check('128px "Instrument Serif"')) cache[p.id] = url;   // only keep it once the display font was in the picture
  return url;
}
