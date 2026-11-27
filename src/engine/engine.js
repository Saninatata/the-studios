/* The Studios — engine. Scroll is the clock: p goes 0 → 1 down the page and everything (the build, the camera,
   the texts, the sound) is a function of p. Nothing here is a film: the studio is real geometry assembled live. */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { SCENES, CHAPTERS, PROJECTS, AGAIN_MS, ACTIONS_RANGE, HINT_WORDS } from './content.js';
import { buildStudio, WALL_Z } from './studio.js';
import { makeLens } from './post.js';

const $ = (s) => document.querySelector(s), el = (id) => document.getElementById(id);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const sstep = (a, b, v) => smooth(clamp((v - a) / (b - a)));
const inRange = (p, [a, b]) => p >= a && p < b;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

export function start(opts = {}) {
  const ctl = { disposed: false, teardown: null };
  run(opts, ctl).catch((err) => console.error(err));
  return () => { ctl.disposed = true; if (ctl.teardown) ctl.teardown(); };
}

const soundState = { on: true };   // survives leaving and coming back to the home page

async function run(opts, ctl) {
  /* ---------- Renderer ---------- */
  const canvas = el('gl');
  const cleanups = [], on = (t, ev, fn, o) => { t.addEventListener(ev, fn, o); cleanups.push(() => t.removeEventListener(ev, fn, o)); };
  if (opts.skipIntro) { el('preloader').classList.add('is-dissolve', 'is-done'); }
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' }); if (!renderer.capabilities.isWebGL2) throw 0; }
  catch { el('noGl').classList.add('is-on'); return; }
  renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 0.82;
  const scene = new THREE.Scene(), bg = new THREE.Color('#f5f4f1');
  scene.background = bg; scene.fog = new THREE.FogExp2(bg, 0.014);
  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 220);

  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.48; pm.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d1c5, 0.34));
  const key = new THREE.DirectionalLight(0xfff8ed, 0.62); key.position.set(-9, 18, 12); scene.add(key);

  await Promise.all([document.fonts.load('128px "Instrument Serif"'), document.fonts.load('22px "Geist Variable"')]).catch(() => {});
  if (ctl.disposed) { renderer.dispose(); return; }
  const studio = buildStudio(PROJECTS); scene.add(studio.group);
  const lens = makeLens(renderer, scene, camera);

  let ratio = Math.min(devicePixelRatio || 1, 2);
  const resize = () => { const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight; renderer.setPixelRatio(ratio); renderer.setSize(w, h, false); lens.resize(w, h, ratio); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  on(window, 'resize', resize); resize();

  /* ---------- Interface ---------- */
  const stage = el('stage'), card = el('card'), cardImg = el('cardImg'), cardCap = el('cardCap'), overlay = el('overlay');
  const actions = el('actions'), hintWord = el('hintWord'), hint = el('hint'), rail = el('rail');
  for (const s of SCENES) {
    s.el = Object.assign(document.createElement('div'), { className: 'title' });
    s.el.innerHTML = `<p class="title__label">${s.label}</p><p class="title__text display">${s.title}</p>`;
    s.bodyEl = Object.assign(document.createElement('p'), { className: 'body', innerHTML: s.body });
    el('titles').append(s.el); el('bodies').append(s.bodyEl);
  }
  const railItems = CHAPTERS.map((c, i) => {
    const b = Object.assign(document.createElement('button'), { type: 'button', className: 'rail__item' });
    b.innerHTML = `<span class="rail__line"><i></i></span><span class="rail__text">${['I', 'II', 'III', 'IV'][i]}/IV — ${c.name}</span>`;
    b.addEventListener('click', () => toProgress(c.range[0] + 0.02)); rail.append(b); return b;
  });
  const maxScroll = () => document.documentElement.scrollHeight - innerHeight;
  let leap = false, glide = null, current = 0, target = 0, hold = null;
  const toProgress = (p) => { leap = true; scrollTo({ top: p * maxScroll(), behavior: reduced ? 'auto' : 'smooth' }); };
  el('againBtn').addEventListener('click', () => {
    if (reduced) return scrollTo(0, 0);
    glide = { from: scrollY, to: 0, start: performance.now(), ms: AGAIN_MS };
  });
  const stepGlide = (now) => { if (!glide) return; const u = clamp((now - glide.start) / glide.ms); scrollTo(0, lerp(glide.from, glide.to, smooth(u))); if (u >= 1) glide = null; };
  ['wheel', 'touchstart', 'keydown'].forEach((t) => on(window, t, () => { glide = null; leap = false; }, { passive: true }));

  let focus = -1, lastChapter = -1;
  function ui(p) {
    for (const s of SCENES) { const on = inRange(p, s.range); s.el.classList.toggle('is-on', on); s.bodyEl.classList.toggle('is-on', s.bodyRange ? inRange(p, s.bodyRange) : on); }
    stage.classList.toggle('has-rail', p > 0.06 && p < 0.94);
    railItems.forEach((b, i) => { const [a, z] = CHAPTERS[i].range; b.style.setProperty('--p', clamp((p - a) / (z - a)).toFixed(3)); b.classList.toggle('is-current', p >= a && p < z); });
    const on = p >= PROJECTS[0].at[0] - 0.01 && p < PROJECTS[PROJECTS.length - 1].at[1];
    card.classList.toggle('is-on', on);
    const f = on ? Math.max(0, PROJECTS.findIndex((q) => p < q.at[1])) : -1;
    if (f !== focus) focus = f;
    if (f >= 0) { const image = PROJECTS[f].image || ''; if (cardImg.getAttribute('src') !== image) { if (image) cardImg.src = image; else cardImg.removeAttribute('src'); } cardCap.textContent = PROJECTS[f].caption; }
    actions.classList.toggle('is-on', inRange(p, ACTIONS_RANGE));
    const w = HINT_WORDS.find(([from]) => p >= from)[1]; if (w !== hintWord.textContent) hintWord.textContent = w;
    hint.style.opacity = p > 0.02 && p < 0.9 ? 0 : 1;
    const ch = CHAPTERS.findIndex((c) => inRange(p, c.range)); if (ch !== lastChapter) { lastChapter = ch; if (ch >= 0) Sound.chime(ch); }
  }

  /* Overlay: the piece in focus, full size on glass */
  let lastFocus = null;
  function openOverlay(pr) {
    const o = pr.overlay;
    el('ovYear').textContent = o.year; el('ovTitle').textContent = o.title; el('ovLabel').innerHTML = o.label.join('<br>');
    Object.assign(el('ovImg'), { src: pr.image, alt: pr.name }); el('ovText').innerHTML = o.text.map((t) => `<p>${t}</p>`).join('');
    lastFocus = document.activeElement; overlay.hidden = false; document.body.classList.add('is-locked'); stage.classList.add('is-veiled');
    requestAnimationFrame(() => overlay.classList.add('is-on')); el('ovClose').focus({ preventScroll: true });
  }
  function closeOverlay() {
    if (overlay.hidden) return; overlay.classList.remove('is-on'); document.body.classList.remove('is-locked'); stage.classList.remove('is-veiled');
    setTimeout(() => { overlay.hidden = true; }, 500); if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  card.addEventListener('click', () => openOverlay(PROJECTS[Math.max(0, focus)]));
  el('ovClose').addEventListener('click', closeOverlay);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeOverlay(); });
  on(document, 'keydown', (e) => {
    if (e.key === 'Escape') closeOverlay();
    if (e.key === 'Tab' && !overlay.hidden) { const it = [...overlay.querySelectorAll('button')], a = it[0], z = it[it.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  });

  /* Cursor: ring + dot; "View" over the card */
  const cursor = el('cursor'), mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  if (fine) {
    document.documentElement.classList.add('has-cursor');
    on(window, 'pointermove', (e) => { mouse.x = e.clientX / innerWidth * 2 - 1; mouse.y = e.clientY / innerHeight * 2 - 1; cursor.classList.add('is-on'); cursor.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`; }, { passive: true });
    on(document, 'pointerover', (e) => { const t = e.target.closest && e.target.closest('button, a'); cursor.classList.toggle('is-hover', !!t); cursor.classList.toggle('is-label', !!(t && t.id === 'card')); }, { passive: true });
    on(document.documentElement, 'pointerleave', () => cursor.classList.remove('is-on'));
  }

  /* ---------- Sound: a slow synthesised pad, and a soft bell at each chapter ---------- */
  const Sound = (() => {
    let on = soundState.on, ctx = null, master = null;
    const btns = [...document.querySelectorAll('[data-sound-toggle]')];
    const show = () => btns.forEach((b) => { b.setAttribute('aria-pressed', String(on)); b.querySelector('[data-sound-label]').textContent = `Sound [${on ? 'on' : 'off'}]`; });
    btns.forEach((b) => b.addEventListener('click', () => { on = !on; soundState.on = on; show(); if (master) master.gain.setTargetAtTime(on ? 0.5 : 0, ctx.currentTime, 0.25); }));
    show();
    const NOTES = [392, 440, 523.25, 659.25];
    return {
      start() {
        const AC = window.AudioContext || window.webkitAudioContext; if (ctx || !AC) return;
        ctx = new AC(); master = ctx.createGain(); master.gain.value = on ? 0.5 : 0; master.connect(ctx.destination);
        const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 600; const pad = ctx.createGain(); pad.gain.value = 0.16; f.connect(pad).connect(master);
        [55, 82.41, 110, 164.81].forEach((hz, i) => {
          const o = ctx.createOscillator(), g = ctx.createGain(), l = ctx.createOscillator(), lg = ctx.createGain();
          o.type = i % 2 ? 'sine' : 'triangle'; o.frequency.value = hz; g.gain.value = 0.3; l.frequency.value = 0.04 + i * 0.03; lg.gain.value = 0.14;
          l.connect(lg).connect(g.gain); o.connect(g).connect(f); o.start(); l.start();
        });
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      },
      stop() { if (ctx) ctx.close().catch(() => {}); ctx = null; master = null; },
      chime(i) {
        if (!ctx || !on) return; const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = NOTES[i % 4]; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.09, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
        o.connect(g).connect(master); o.start(t); o.stop(t + 2.7);
      },
    };
  })();

  /* ---------- Frame ---------- */
  let elapsed = 0, last = performance.now(), open = 1, opening = 0, rush = 0, lastP = 0, camX = 0, entered = false, slow = 0, frames = 0;
  const OPEN_MS = 1900, OPEN_AFTER = 240;
  function draw(dt) {
    target = maxScroll() > 0 ? clamp(scrollY / maxScroll()) : 0;
    if (reduced) current = target; else {
      const ahead = Math.abs(target - current);
      current += (target - current) * (1 - Math.exp(-dt * (leap || glide ? 5 : 3.2)));
      if (leap && ahead < 0.002) leap = false;
    }
    if (Math.abs(target - current) < 0.00005) current = target;
    if (hold != null) current = target = hold;
    const p = current, speed = Math.abs(p - lastP) / Math.max(dt, 0.004); lastP = p;
    rush += (clamp(speed * 7) * (reduced ? 0 : 1) - rush) * (1 - Math.exp(-dt * 6));

    studio.assemble(p);
    const lampsOn = sstep(0.8, 0.9, p);
    const fi = p >= PROJECTS[0].at[0] && p < PROJECTS[PROJECTS.length - 1].at[1] ? Math.max(0, PROJECTS.findIndex((q) => p < q.at[1])) : -1;
    studio.light(fi, lampsOn); studio.drift(dt);

    /* Camera: a long dolly down the hall; in Craft it slides to each piece and moves in on it; at the end it lifts and pulls back to show the whole studio. */
    const travel = smooth(clamp(p / 0.82)), fin = sstep(0.9, 1, p), dive = sstep(0.6, 0.8, p);
    const activeFrame = fi >= 0 ? studio.frames[fi] : null;
    const aim = activeFrame ? activeFrame.x - activeFrame.side * 2.8 : 0;
    const aimZ = activeFrame ? activeFrame.z + 0.35 : WALL_Z;
    camX += (aim - camX) * (1 - Math.exp(-dt * 2.4));
    mouse.sx += (mouse.x - mouse.sx) * (1 - Math.exp(-dt * 3)); mouse.sy += (mouse.y - mouse.sy) * (1 - Math.exp(-dt * 3));
    const free = fine && !reduced ? 1 - fin : 0;
    camera.position.set(camX + mouse.sx * 1.3 * free, lerp(2.5, 3.1, travel) + fin * 13 - mouse.sy * 0.7 * free, activeFrame ? aimZ + 2.8 : lerp(17, -7, travel) - dive * 3 + fin * 46);
    camera.lookAt(activeFrame ? activeFrame.x : camX * 0.8, activeFrame ? activeFrame.y : lerp(3.2, 4.3, travel) - fin * 2.4, activeFrame ? activeFrame.z : WALL_Z + fin * 16);
    camera.fov = lerp(52, 41, sstep(0.58, 0.78, p)) + fin * 11; camera.updateProjectionMatrix();

    ui(p); lens.render(elapsed, open, rush);
  }
  function loop(now) {
    const dt = Math.min(0.1, (now - last) / 1000 || 0); last = now; elapsed += dt;
    stepGlide(performance.now());
    if (opening) { const a = clamp((performance.now() - opening) / OPEN_MS); open = a < 0.5 ? 2 * a * a : 1 - Math.pow(-2 * a + 2, 2) / 2; if (a >= 1) { opening = 0; open = 1; } }
    draw(dt);
    /* if the machine can't keep up, draw fewer points (never back up, so it doesn't hunt) */
    if (entered && !document.hidden && dt < 0.25 && ++frames > 40) { if (dt > 0.026) slow++; if (frames % 90 === 0) { if (slow > 30 && ratio > 1) { ratio = Math.max(1, ratio - 0.25); resize(); } slow = 0; } }
  }

  /* ---------- Preloader ---------- */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; scrollTo(0, 0);
  const pre = el('preloader'), preCount = el('preCount'), preStatus = el('preStatus'), t0 = performance.now();
  let shown = 0, compiled = false, raf = 0;
  renderer.compileAsync(scene, camera).catch(() => {}).then(() => { compiled = true; });
  (function tick(now) {
    const u = clamp((now - t0) / 3000), eased = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
    const goal = Math.min(compiled ? 100 : 92, eased * 100);
    shown += (goal - shown) * 0.08; if (goal >= 100 && shown > 99.6) shown = 100;
    const n = Math.floor(shown);
    preCount.textContent = String(n).padStart(3, '0'); preStatus.textContent = n < 34 ? 'Ground' : n < 90 ? 'Structure' : 'Light';
    pre.style.setProperty('--load', shown.toFixed(1));
    if (shown >= 100) {
      renderer.setAnimationLoop(loop);   // from here the hall draws behind the preloader, so Enter has no hitch
      setTimeout(() => { el('preEnter').hidden = false; el('preHint').hidden = false; pre.classList.add('is-morph'); }, 500);
      return;
    }
    raf = requestAnimationFrame(tick);
  })(performance.now());
  open = -1;  // the canvas starts as the same white as the preloader, and opens on Enter
  el('enterBtn').addEventListener('click', () => {
    scrollTo(0, 0); entered = true; document.body.classList.remove('is-loading');
    if (reduced) { open = 1; } else { open = 0; opening = performance.now() + OPEN_AFTER; pre.classList.add('is-dissolve'); }
    pre.classList.add('is-done'); Sound.start();
  });

  if (opts.skipIntro) {   // coming back to the home page in the same visit: no preloader, straight into the opening
    cancelAnimationFrame(raf); pre.classList.add('is-dissolve', 'is-done'); document.body.classList.remove('is-loading');
    entered = true; renderer.setAnimationLoop(loop);
    if (reduced) open = 1; else { open = -1; opening = performance.now() + 120; }
    Sound.start();
  }

  ctl.teardown = () => {
    cancelAnimationFrame(raf); renderer.setAnimationLoop(null); cleanups.forEach((f) => f());
    document.documentElement.classList.remove('has-cursor'); document.body.classList.remove('is-loading', 'is-locked');
    Sound.stop();
    scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); const m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach((x) => { if (x.map) x.map.dispose(); x.dispose(); }); });
    lens.composer.dispose(); renderer.dispose(); renderer.forceContextLoss(); delete window.__studio;
  };

  /* For looking into it from the console: __studio.pose(0.55) holds a moment, pose(null) lets go. */
  window.__studio = { renderer, scene, camera, pose(p) { hold = p == null ? null : p; }, open(v) { opening = 0; open = v; } };
}
