/* The Studios — the studio that builds itself.
   Every piece is real geometry that flies in and locks into place on a window of the scroll (0…1).
   Materials: white ceramic, clear + frosted glass, chrome. Light comes from an environment (soft white room)
   plus a few strips that switch on in the last chapter. Units are metres-ish; the camera starts at z = +17 looking down -z. */
import * as THREE from 'three';

export const WALL_Z = -27;
export const FRAME_X = [-8.4, 0, 8.4];

/* A pastel "screen" for each project: replace with a real screenshot by setting project.image to a URL. */
function artCanvas(p) {
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

export function buildStudio(PROJECTS) {
  const group = new THREE.Group(), parts = [];
  let seed = 7; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;

  const M = {
    ceramic: new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08 }),
    stone: new THREE.MeshPhysicalMaterial({ color: 0xe6e4df, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.15 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0xeef6ff, transmission: 1, thickness: 0.9, roughness: 0.03, ior: 1.5, attenuationColor: new THREE.Color(0xcfe4ff), attenuationDistance: 2.5, envMapIntensity: 1.3 }),
    frost: new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, thickness: 0.6, roughness: 0.55, ior: 1.45, envMapIntensity: 1 }),
    chrome: new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.07 }),
    lamp: new THREE.MeshBasicMaterial({ color: new THREE.Color().setScalar(0.4), toneMapped: false }),
  };

  const bx = (w, h, d, m) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  /* range: the stretch of scroll it builds in; off: where it comes from; spin: how much it tumbles on the way */
  const add = (o, pos, range, off, spin = 1) => {
    o.position.set(...pos); o.userData = { t: pos, a: range[0], b: range[1], o: off, r: [rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1], spin };
    o.visible = false; group.add(o); parts.push(o); return o;
  };

  /* Ground: ceramic and stone tiles with a few glass slabs, rising out of the void from below. */
  for (let i = -3; i <= 3; i++) for (let j = 0; j <= 9; j++) {
    const glass = (i * 7 + j * 3) % 8 === 0, a = 0.06 + 0.17 * (j / 9) + 0.04 * rnd();
    const m = glass ? M.glass : (i + j) % 2 ? M.ceramic : M.stone;
    add(bx(2.88, glass ? 0.26 : 0.2, 2.88, m), [i * 3, -0.1, 4 - j * 3], [a, a + 0.1], [(rnd() - .5) * 7, -9 - rnd() * 9, (rnd() - .5) * 7], 1.4);
  }
  /* Structure: glass columns on chrome collars, each with a white core. */
  for (const s of [-1, 1]) for (let k = 0; k < 7; k++) {
    const col = new THREE.Group(), a = 0.28 + k * 0.016;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.46, 6.6, 40), M.glass); shaft.position.y = 3.3;
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 6.7, 16), M.ceramic); core.position.y = 3.3;
    const lo = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.6, 0.18, 40), M.chrome); lo.position.y = 0.09;
    const hi = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.5, 0.18, 40), M.chrome); hi.position.y = 6.55;
    col.add(shaft, core, lo, hi);
    add(col, [s * 8, 0, 3 - k * 5.4], [a, a + 0.1], [0, 11, 0], 0.4);
  }
  for (const s of [-1, 1]) add(bx(0.7, 0.5, 37, M.ceramic), [s * 8, 6.95, -14.5], [0.4, 0.5], [0, 12, 0], 0.2);
  for (let k = 0; k < 7; k++) { const a = 0.41 + k * 0.01; add(bx(16.8, 0.32, 0.55, M.ceramic), [0, 7.3, 3 - k * 5.4], [a, a + 0.08], [0, 12, 0], 0.2); }
  for (const s of [-1, 1]) add(bx(0.14, 6.6, 36, M.frost), [s * 9.6, 3.3, -14.5], [0.43, 0.51], [s * 5, 0, 0], 0.1);

  /* Craft: a frosted glass wall on white, and three framed pieces hung on it. */
  add(bx(27, 10, 0.5, M.ceramic), [0, 5, WALL_Z - 0.7], [0.44, 0.52], [0, -10, 0], 0.1);
  add(bx(26, 9, 0.3, M.frost), [0, 4.6, WALL_Z], [0.46, 0.54], [0, 0, -8], 0.2);
  const frames = PROJECTS.map((p, i) => {
    const cv = artCanvas(p), tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    p.image = p.image || cv.toDataURL('image/jpeg', 0.9);
    const mat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }), g = new THREE.Group();
    const slab = bx(7.1, 4.9, 0.16, M.glass); g.add(slab);
    for (const [w, h, x, y] of [[7.3, .09, 0, 2.5], [7.3, .09, 0, -2.5], [.09, 5.0, 3.6, 0], [.09, 5.0, -3.6, 0]]) { const e = bx(w, h, 0.22, M.chrome); e.position.set(x, y, 0); g.add(e); }
    const art = new THREE.Mesh(new THREE.PlaneGeometry(6.6, 4.55), mat); art.position.z = 0.1; g.add(art);
    const a = 0.54 + i * 0.03;
    add(g, [FRAME_X[i], 4.7, WALL_Z + 0.35], [a, a + 0.09], [(i - 1) * 6, 3, 14], 1.1);
    return { mat, x: FRAME_X[i] };
  });

  /* Light: strips that come on in the last chapter (HDR values, so the bloom picks them up). */
  const strips = [];
  for (let i = 0; i < 4; i++) { const a = 0.8 + i * 0.02, s = add(bx(6, 0.07, 0.07, M.lamp), [(i - 1.5) * 8, 8, WALL_Z + 6], [a, a + 0.05], [0, 6, 0], 0.2); strips.push(s); }
  const lights = [-8, 0, 8].map((x) => { const l = new THREE.PointLight(0xfff1de, 0, 40, 1.4); l.position.set(x, 7.5, WALL_Z + 7); group.add(l); return l; });

  /* Pollen: a few soft specks hanging in the air. */
  const N = 420, pp = new Float32Array(N * 3);
  for (let i = 0; i < N * 3; i += 3) { pp[i] = rnd() * 36 - 18; pp[i + 1] = rnd() * 9; pp[i + 2] = rnd() * 50 - 30; }
  const dust = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pp, 3)), new THREE.PointsMaterial({ color: 0x0d0d0f, size: 0.045, transparent: true, opacity: 0.22, depthWrite: false }));
  group.add(dust);

  const ease = (k) => 1 - Math.pow(1 - k, 3);
  const clamp = (v) => Math.min(1, Math.max(0, v));
  return {
    group, frames,
    /* Place every piece for scroll position p. */
    assemble(p) {
      for (const o of parts) {
        const u = o.userData, k = ease(clamp((p - u.a) / (u.b - u.a))), f = 1 - k;
        o.visible = k > 0;
        o.position.set(u.t[0] + u.o[0] * f, u.t[1] + u.o[1] * f, u.t[2] + u.o[2] * f);
        o.rotation.set(u.r[0] * f * 2.4 * u.spin, u.r[1] * f * 2.4 * u.spin, u.r[2] * f * 1.6 * u.spin);
      }
    },
    /* focus: index of the piece in focus (or -1); on: how much the wall is lit; lamps: 0…1 */
    light(focus, lamps) {
      frames.forEach((f, i) => f.mat.color.setScalar(focus < 0 ? 0.92 : i === focus ? 1 : 0.62));
      M.lamp.color.setScalar(0.4 + lamps * 4.2); lights.forEach((l) => (l.intensity = lamps * 90));
    },
    drift(dt) { const a = dust.geometry.attributes.position; for (let i = 1; i < N * 3; i += 3) { a.array[i] += dt * 0.1; if (a.array[i] > 9) a.array[i] = 0; } a.needsUpdate = true; },
  };
}
