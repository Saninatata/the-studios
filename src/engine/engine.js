/* The Studios — engine. Scroll is the clock: p goes 0 → 1 down the page and everything (the build, the camera,
   the texts, the sound) is a function of p. Nothing here is a film: the studio is real geometry assembled live. */
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { SCENES, CHAPTERS, PROJECTS, HINT_WORDS } from './content.js';
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

export async function start() {
  /* ---------- Renderer ---------- */
  const canvas = el('gl');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' }); if (!renderer.capabilities.isWebGL2) throw 0; }
  catch { el('noGl').classList.add('is-on'); return; }
  renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 0.72;
  const scene = new THREE.Scene(), bg = new THREE.Color('#f5f4f1');
  scene.background = bg; scene.fog = new THREE.FogExp2(bg, 0.021);
  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 220);

  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.48; pm.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff, 0xdfe6f0, 0.24));
  const key = new THREE.DirectionalLight(0xffffff, 0.52); key.position.set(-9, 18, 12); scene.add(key);

  await Promise.all([document.fonts.load('128px "Instrument Serif"'), document.fonts.load('22px "Geist Variable"')]).catch(() => {});
  /* Fetch only public-domain object records from The Met; never substitute drawn stand-ins. */
  await Promise.all(PROJECTS.filter((p) => p.metId).map(async (p) => {
    try {
      const r = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/objects/' + p.metId, { signal: AbortSignal.timeout(8000) });
      if (!r.ok) throw new Error('Met API unavailable');
      const data = await r.json();
      if (!data.isPublicDomain || !(data.primaryImageSmall || data.primaryImage)) throw new Error('No open-access image');
      p.image = data.primaryImageSmall || data.primaryImage;
      p.imageFallback = data.primaryImage && data.primaryImage !== p.image ? data.primaryImage : null;
      p.creator = data.artistDisplayName || p.creator;
      p.date = data.objectDate || p.date;
      p.medium = data.medium || p.medium;
      p.description = data.objectName ? data.objectName + '. ' + p.description : p.description;
      p.source = data.objectURL || p.source;
    } catch (error) { p.imageFailed = true; }
  }));
  const galleryStart = 0.535, galleryEnd = 0.91, pieceSpan = (galleryEnd - galleryStart) / PROJECTS.length;
  PROJECTS.forEach((p, i) => { p.at = [galleryStart + i * pieceSpan, galleryStart + (i + 1) * pieceSpan]; });
  const heroCollage = el('heroCollage');
  PROJECTS.slice(0, 6).forEach((project, index) => {
    const frame = document.createElement('figure'); frame.className = 'hero__piece';
    const img = document.createElement('img'); img.alt = project.name; img.loading = index < 3 ? 'eager' : 'lazy';
    img.src = project.image || (project.source ? 'https://image.thum.io/get/width/720/crop/900/noanimate/' + project.source : '');
    frame.append(img); heroCollage.append(frame);
  });
  const studio = buildStudio(PROJECTS, renderer); scene.add(studio.group);
  const lens = makeLens(renderer, scene, camera);

  let ratio = Math.min(devicePixelRatio || 1, 2);
  const resize = () => { const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight; renderer.setPixelRatio(ratio); renderer.setSize(w, h, false); lens.resize(w, h, ratio); camera.aspect = w / h; camera.updateProjectionMatrix(); dirty = true; };
  let dirty = true; addEventListener('resize', resize); resize();

  /* ---------- Interface ---------- */
  const stage = el('stage'), card = el('card'), cardImg = el('cardImg'), cardCap = el('cardCap'), overlay = el('overlay');
  const hintWord = el('hintWord'), hint = el('hint'), rail = el('rail');
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
  el('logo').addEventListener('click', (e) => { e.preventDefault(); toProgress(0); });
  const stepGlide = (now) => { if (!glide) return; const u = clamp((now - glide.start) / glide.ms); scrollTo(0, lerp(glide.from, glide.to, smooth(u))); if (u >= 1) glide = null; };
  ['wheel', 'touchstart', 'keydown'].forEach((t) => addEventListener(t, () => { glide = null; leap = false; }, { passive: true }));

  let focus = -1, lastUI = -1, lastChapter = -1;
  function ui(p) {
    for (const s of SCENES) { const on = inRange(p, s.range); s.el.classList.toggle('is-on', on); s.bodyEl.classList.toggle('is-on', s.bodyRange ? inRange(p, s.bodyRange) : on); }
    stage.classList.toggle('has-rail', p > 0.06 && p < 0.94);
    railItems.forEach((b, i) => { const [a, z] = CHAPTERS[i].range; b.style.setProperty('--p', clamp((p - a) / (z - a)).toFixed(3)); b.classList.toggle('is-current', p >= a && p < z); });
    const on = p >= PROJECTS[0].at[0] && p < PROJECTS[PROJECTS.length - 1].at[1];
    card.classList.toggle('is-on', on);
    const f = on ? Math.max(0, PROJECTS.findIndex((q) => p < q.at[1])) : -1;
    if (f !== focus) { focus = f; if (f >= 0) { cardImg.src = PROJECTS[f].image || ''; cardImg.alt = PROJECTS[f].name; cardCap.textContent = String(f + 1).padStart(2, '0') + ' / ' + PROJECTS.length + ' — ' + PROJECTS[f].caption; } }
    const w = HINT_WORDS.find(([from]) => p >= from)[1]; if (w !== hintWord.textContent) hintWord.textContent = w;
    hint.style.opacity = p > 0.02 && p < 0.9 ? 0 : 1;
    const ch = CHAPTERS.findIndex((c) => inRange(p, c.range)); if (ch !== lastChapter) { lastChapter = ch; if (ch >= 0) Sound.chime(ch); }
  }

  /* Overlay: one selected piece, with original credit and source navigation. */
  let lastFocus = null, lastFocusIndex = -1;
  function openOverlay(pr) {
    el('ovYear').textContent = [pr.category || pr.kind, pr.date, pr.medium].filter(Boolean).join('  /  ');
    el('ovTitle').textContent = pr.name;
    el('ovLabel').textContent = [pr.creator, pr.date].filter(Boolean).join(' · ');
    const liveFrame = el('ovFrame'), stillImage = el('ovImg');
    const isWebsite = pr.kind === 'website';
    liveFrame.hidden = !isWebsite; stillImage.hidden = isWebsite;
    if (isWebsite) liveFrame.src = pr.source;
    else { liveFrame.src = 'about:blank'; Object.assign(stillImage, { src: pr.image || '', alt: pr.name }); }
    el('ovText').innerHTML = `<p>${pr.description || ''}</p><p>Creator / studio: ${pr.creator || 'Not credited on the source page'}.</p><p>Original source: ${pr.kind === 'art' ? 'The Metropolitan Museum of Art — Open Access collection.' : 'Original project / website.'}</p>`;
    const source = el('ovSource'); source.href = pr.source || '#'; source.hidden = !pr.source;
    lastFocus = document.activeElement; lastFocusIndex = PROJECTS.indexOf(pr);
    overlay.hidden = false; document.body.classList.add('is-locked'); stage.classList.add('is-veiled');
    requestAnimationFrame(() => overlay.classList.add('is-on')); el('ovClose').focus({ preventScroll: true });
  }
  function closeOverlay() {
    if (overlay.hidden) return; overlay.classList.remove('is-on'); document.body.classList.remove('is-locked'); stage.classList.remove('is-veiled');
    setTimeout(() => { overlay.hidden = true; }, 500); if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  const moveOverlay = (step) => { const next = (lastFocusIndex + step + PROJECTS.length) % PROJECTS.length; openOverlay(PROJECTS[next]); };
  card.addEventListener('click', () => { if (focus >= 0) openOverlay(PROJECTS[focus]); });
  el('ovPrev').addEventListener('click', () => moveOverlay(-1));
  el('ovNext').addEventListener('click', () => moveOverlay(1));
  el('ovClose').addEventListener('click', closeOverlay);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeOverlay(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOverlay();
    if (!overlay.hidden && e.key === 'ArrowLeft') moveOverlay(-1);
    if (!overlay.hidden && e.key === 'ArrowRight') moveOverlay(1);
    if (e.key === 'Tab' && !overlay.hidden) { const it = [...overlay.querySelectorAll('button, a')].filter((x) => !x.hidden), first = it[0], last = it[it.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
  });

  /* Cursor: ring + dot; "View" over the card */
  const cursor = el('cursor'), mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  if (fine) {
    document.documentElement.classList.add('has-cursor');
    addEventListener('pointermove', (e) => { mouse.x = e.clientX / innerWidth * 2 - 1; mouse.y = e.clientY / innerHeight * 2 - 1; cursor.classList.add('is-on'); cursor.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`; }, { passive: true });
    document.addEventListener('pointerover', (e) => { const t = e.target.closest && e.target.closest('button, a'); cursor.classList.toggle('is-hover', !!t); cursor.classList.toggle('is-label', !!(t && t.id === 'card')); }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => cursor.classList.remove('is-on'));
  }

  /* ---------- Sound: a slow synthesised pad, and a soft bell at each chapter ---------- */
  const Sound = (() => {
    let on = true, ctx = null, master = null;
    const btns = [...document.querySelectorAll('[data-sound-toggle]')];
    const show = () => btns.forEach((b) => { b.setAttribute('aria-pressed', String(on)); b.querySelector('[data-sound-label]').textContent = `Sound [${on ? 'on' : 'off'}]`; });
    btns.forEach((b) => b.addEventListener('click', () => { on = !on; show(); if (master) master.gain.setTargetAtTime(on ? 0.5 : 0, ctx.currentTime, 0.25); }));
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

    /* The camera follows the selected piece down the two-sided exhibition hall. */
    const travel = smooth(clamp(p / 0.96)), fin = sstep(0.95, 1, p);
    const frame = fi >= 0 ? studio.frames[fi] : null;
    const aimX = frame ? frame.x * 0.55 : 0;
    const aimZ = frame ? frame.z + 5.4 : lerp(17, -35, travel);
    camX += (aimX - camX) * (1 - Math.exp(-dt * 2.6));
    mouse.sx += (mouse.x - mouse.sx) * (1 - Math.exp(-dt * 3)); mouse.sy += (mouse.y - mouse.sy) * (1 - Math.exp(-dt * 3));
    const free = fine && !reduced ? 1 - fin : 0;
    camera.position.set(camX + mouse.sx * 0.45 * free, 4.2 + fin * 12 - mouse.sy * 0.25 * free, aimZ + fin * 24);
    camera.lookAt(frame ? frame.x * 0.9 : camX * 0.8, 4.55 - fin * 2.4, frame ? frame.z : aimZ - 13);
    camera.fov = frame ? 42 : 52; camera.fov += fin * 11; camera.updateProjectionMatrix();

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

  /* ---------- Preloader: separate real 3D glass monogram ---------- */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; scrollTo(0, 0);
  const pre = el('preloader'), preCount = el('preCount'), preStatus = el('preStatus'), t0 = performance.now();
  let shown = 0, compiled = false;
  renderer.compileAsync(scene, camera).catch(() => {}).then(() => { compiled = true; });
  const logoCanvas = el('logoGl');
  let logoRenderer = null, logoScene = null, logoCamera = null, logoObject = null, logoFrame = 0;
  try {
    logoRenderer = new THREE.WebGLRenderer({ canvas: logoCanvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    logoRenderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
    logoRenderer.setSize(logoCanvas.clientWidth || innerWidth, logoCanvas.clientHeight || innerHeight, false);
    logoRenderer.toneMapping = THREE.ACESFilmicToneMapping; logoRenderer.toneMappingExposure = 1.15;
    logoScene = new THREE.Scene();
    logoCamera = new THREE.PerspectiveCamera(32, (logoCanvas.clientWidth || innerWidth) / (logoCanvas.clientHeight || innerHeight), 0.1, 100);
    logoCamera.position.set(0, 0, 15);
    const logoPm = new THREE.PMREMGenerator(logoRenderer);
    logoScene.environment = logoPm.fromScene(new RoomEnvironment(), 0.04).texture;
    logoScene.add(new THREE.HemisphereLight(0xffffff, 0x9ba4b3, 1.5));
    const logoKey = new THREE.DirectionalLight(0xffffff, 4.2); logoKey.position.set(-5, 8, 10); logoScene.add(logoKey);
    const logoRim = new THREE.PointLight(0x9dcaff, 26, 24); logoRim.position.set(5, -2, 5); logoScene.add(logoRim);
    const logoWarm = new THREE.PointLight(0xffffff, 18, 20); logoWarm.position.set(-4, -5, 3); logoScene.add(logoWarm);
    const svgText = await fetch('/studios-mark.svg').then(r => { if (!r.ok) throw new Error('Logo SVG unavailable'); return r.text(); });
    const parsed = new SVGLoader().parse(svgText), logoGroup = new THREE.Group();
    for (const path of parsed.paths) for (const shape of SVGLoader.createShapes(path)) {
      const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.42, bevelEnabled: true, bevelSegments: 5, steps: 1, bevelSize: 0.07, bevelThickness: 0.07, curveSegments: 20 });
      geo.computeVertexNormals();
      const glass = new THREE.MeshPhysicalMaterial({ color: 0xeaf3ff, metalness: 0.08, roughness: 0.055, transmission: 0.94, thickness: 1.8, ior: 1.48, clearcoat: 1, clearcoatRoughness: 0.035, envMapIntensity: 2.1, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geo, glass); mesh.position.z = -0.21; logoGroup.add(mesh);
      mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 28), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.48 })));
    }
    logoGroup.scale.setScalar(0.021); logoGroup.rotation.x = Math.PI;
    const box = new THREE.Box3().setFromObject(logoGroup); logoGroup.position.sub(box.getCenter(new THREE.Vector3()));
    logoObject = new THREE.Group(); logoObject.add(logoGroup); logoScene.add(logoObject);
    logoPm.dispose();
    const resizeLogo = () => { if (!logoRenderer || !logoCamera) return; const w=logoCanvas.clientWidth||innerWidth,h=logoCanvas.clientHeight||innerHeight; logoRenderer.setSize(w,h,false); logoCamera.aspect=w/h; logoCamera.updateProjectionMatrix(); };
    addEventListener('resize', resizeLogo);
    const spin = (now) => { if (!logoRenderer || !logoObject) return; logoObject.rotation.y=now*0.00048; logoObject.rotation.x=Math.sin(now*0.00032)*0.055; logoObject.rotation.z=Math.sin(now*0.0002)*0.025; logoRenderer.render(logoScene,logoCamera); logoFrame=requestAnimationFrame(spin); };
    logoFrame=requestAnimationFrame(spin);
  } catch (error) {
    console.warn('Glass logo renderer unavailable:', error); logoCanvas.style.display='none';
    const fallback=document.createElement('img'); fallback.src='/studios-mark.svg'; fallback.alt='The Studios monogram'; fallback.className='preloader__mark'; el('preFrame').append(fallback);
  }
  (function tick(now) {
    const u = clamp((now - t0) / 3000), eased = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
    const goal = Math.min(compiled ? 100 : 92, eased * 100);
    shown += (goal - shown) * 0.08; if (goal >= 100 && shown > 99.6) shown = 100;
    const n = Math.floor(shown);
    preCount.textContent = String(n).padStart(3, '0'); preStatus.textContent = n < 34 ? 'Ground' : n < 90 ? 'Structure' : 'Light';
    pre.style.setProperty('--load', shown.toFixed(1));
    if (shown >= 100) {
      cancelAnimationFrame(logoFrame);
      if (logoRenderer) { logoRenderer.dispose(); logoRenderer = null; }
      renderer.setAnimationLoop(loop);
      document.body.classList.remove('is-loading');
      el('hero').classList.add('is-on');
      pre.classList.add('is-done');
      return;
    }
    requestAnimationFrame(tick);
  })(performance.now());
  open = -1;  // the canvas starts as the same white as the preloader, and opens on Enter
  const hero = el('hero');
  const enterHero = () => {
    if (hero.classList.contains('is-away')) return;
    entered = true; hero.classList.add('is-away');
    if (reduced) open = 1; else { open = 0; opening = performance.now() + OPEN_AFTER; }
    Sound.start();
  };
  el('heroEnter').addEventListener('click', () => { enterHero(); toProgress(0.012); });
  addEventListener('scroll', () => { if (scrollY > 36) enterHero(); }, { passive: true });

  /* For looking into it from the console: __studio.pose(0.55) holds a moment, pose(null) lets go. */
  window.__studio = { renderer, scene, camera, pose(p) { hold = p == null ? null : p; }, open(v) { opening = 0; open = v; } };
}
