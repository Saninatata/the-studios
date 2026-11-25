/* The Studios — the studio that builds itself.
   The framed canvases are original gallery studies, not stock placeholder gradients. */
import * as THREE from 'three';

export const WALL_Z = -27;
export const FRAME_X = [-8.4, 0, 8.4];

function paper(x, w, h, colour = '#f3f0e9') {
  x.fillStyle = colour; x.fillRect(0, 0, w, h);
}
function text(x, value, px, py, size, font = 'sans-serif', colour = '#171717', weight = '400') {
  x.fillStyle = colour; x.font = `${weight} ${size}px ${font}`; x.fillText(value, px, py);
}
function artCanvas(p) {
  const w = 960, h = 660, c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d');
  paper(x, w, h, '#e9e5dc');
  if (p.kind === 'history') {
    // Three original visual studies: Renaissance proportion, Ukiyo-e movement, Bauhaus geometry.
    x.fillStyle = '#f7f3e9'; x.fillRect(36, 36, 888, 588);
    text(x, 'A SHORT HISTORY OF FORM', 70, 91, 19, 'sans-serif', '#25231f', '600');
    text(x, 'ART / IMAGE / IDEAS', 770, 91, 13, 'sans-serif', '#625d54');
    x.strokeStyle = '#c9c1b4'; x.lineWidth = 1; x.beginPath(); x.moveTo(70, 112); x.lineTo(890, 112); x.stroke();
    // Renaissance-inspired architectural perspective study.
    x.fillStyle = '#d9c6a4'; x.fillRect(70, 145, 250, 360);
    x.fillStyle = '#b77d57'; x.beginPath(); x.arc(195, 260, 82, Math.PI, 0); x.fill();
    x.fillStyle = '#eee2c9'; x.fillRect(112, 260, 166, 180);
    x.strokeStyle = '#8d654a'; x.lineWidth = 3;
    for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(112 + i * 41, 260); x.lineTo(112 + i * 41, 440); x.stroke(); }
    x.strokeStyle = '#8d654a'; x.beginPath(); x.moveTo(112, 350); x.lineTo(278, 350); x.stroke();
    text(x, '01 / RENAISSANCE', 70, 540, 15, 'sans-serif', '#25231f', '600');
    text(x, 'Perspective & proportion', 70, 565, 15, 'serif', '#625d54');
    // Ukiyo-e inspired wave study (an original motif).
    x.fillStyle = '#d7e0dc'; x.fillRect(355, 145, 250, 360);
    x.fillStyle = '#264e5b'; x.beginPath(); x.moveTo(355, 380); x.bezierCurveTo(410, 250, 460, 470, 520, 320); x.bezierCurveTo(555, 260, 580, 305, 605, 270); x.lineTo(605, 505); x.lineTo(355, 505); x.closePath(); x.fill();
    x.strokeStyle = '#f2eee3'; x.lineWidth = 9; x.beginPath(); x.moveTo(370, 380); x.bezierCurveTo(430, 260, 475, 455, 535, 325); x.stroke();
    x.fillStyle = '#f2eee3'; for (let i = 0; i < 14; i++) { x.beginPath(); x.arc(390 + i * 13, 365 - Math.sin(i * .55) * 38, 3, 0, Math.PI * 2); x.fill(); }
    text(x, '02 / UKIYO-E', 355, 540, 15, 'sans-serif', '#25231f', '600');
    text(x, 'Flat space & movement', 355, 565, 15, 'serif', '#625d54');
    // Bauhaus-inspired geometric composition.
    x.fillStyle = '#e4d6c5'; x.fillRect(640, 145, 250, 360);
    x.fillStyle = '#c64c35'; x.beginPath(); x.arc(765, 280, 92, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#e3b83f'; x.fillRect(665, 340, 205, 82);
    x.fillStyle = '#273f4b'; x.beginPath(); x.moveTo(690, 455); x.lineTo(815, 455); x.lineTo(752, 345); x.closePath(); x.fill();
    x.fillStyle = '#25231f'; x.fillRect(840, 180, 18, 280);
    text(x, '03 / BAUHAUS', 640, 540, 15, 'sans-serif', '#25231f', '600');
    text(x, 'Geometry & function', 640, 565, 15, 'serif', '#625d54');
    text(x, 'VISUAL STUDIES — NOT ORIGINAL HISTORICAL WORKS', 70, 600, 12, 'sans-serif', '#777064');
  } else if (p.kind === 'identity') {
    x.fillStyle = '#f7f5ef'; x.fillRect(36, 36, 888, 588);
    text(x, 'IDENTITY / FORM / MEMORY', 70, 91, 19, 'sans-serif', '#25231f', '600');
    text(x, 'MARK-MAKING STUDIES', 740, 91, 13, 'sans-serif', '#625d54');
    x.strokeStyle = '#c9c1b4'; x.beginPath(); x.moveTo(70, 112); x.lineTo(890, 112); x.stroke();
    const cells = [[70,145],[355,145],[640,145],[70,380],[355,380],[640,380]];
    const marks = [
      (cx,cy)=>{ x.beginPath(); x.arc(cx,cy,58,0,Math.PI*2); x.stroke(); x.beginPath(); x.moveTo(cx-42,cy+34); x.lineTo(cx+42,cy-34); x.stroke(); },
      (cx,cy)=>{ x.beginPath(); x.moveTo(cx-55,cy+48); x.lineTo(cx,cy-55); x.lineTo(cx+55,cy+48); x.closePath(); x.stroke(); x.beginPath(); x.moveTo(cx-28,cy+12); x.lineTo(cx+28,cy+12); x.stroke(); },
      (cx,cy)=>{ x.fillRect(cx-54,cy-54,108,108); x.clearRect(cx-25,cy-25,50,50); },
      (cx,cy)=>{ x.beginPath(); x.arc(cx,cy,56,Math.PI*.15,Math.PI*1.85); x.stroke(); x.beginPath(); x.moveTo(cx-4,cy-54); x.lineTo(cx+48,cy+40); x.stroke(); },
      (cx,cy)=>{ x.beginPath(); x.moveTo(cx-55,cy-48); x.lineTo(cx+55,cy-48); x.lineTo(cx+55,cy+48); x.stroke(); x.beginPath(); x.moveTo(cx-55,cy+48); x.lineTo(cx+55,cy-48); x.stroke(); },
      (cx,cy)=>{ x.beginPath(); x.arc(cx-24,cy,42,0,Math.PI*2); x.arc(cx+24,cy,42,0,Math.PI*2); x.stroke(); }
    ];
    cells.forEach(([cx,cy],i)=>{ x.fillStyle = '#ebe7de'; x.fillRect(cx,cy,250,205); x.strokeStyle = '#20201e'; x.lineWidth = 5; x.lineCap='square'; marks[i](cx+125,cy+88); text(x, ['MONOGRAM','GEOMETRY','NEGATIVE SPACE','OPEN FORM','STRUCTURE','OVERLAP'][i],cx+16,cy+184,12,'sans-serif','#514c43','600'); });
    text(x, 'A mark is only the beginning. Build a system around it.', 70, 610, 17, 'serif', '#625d54');
  } else {
    x.fillStyle = '#f4f1eb'; x.fillRect(36, 36, 888, 588);
    text(x, 'DIGITAL / INTERFACE / EXPERIENCE', 70, 91, 19, 'sans-serif', '#25231f', '600');
    text(x, 'WEB DESIGN STUDIES', 755, 91, 13, 'sans-serif', '#625d54');
    x.strokeStyle = '#c9c1b4'; x.beginPath(); x.moveTo(70, 112); x.lineTo(890, 112); x.stroke();
    // Editorial website.
    x.fillStyle = '#e2ded5'; x.fillRect(70,145,250,360); x.fillStyle='#f8f6f0'; x.fillRect(83,158,224,334);
    text(x,'FORM / FIELD',99,190,13,'sans-serif','#262521','600'); text(x,'Objects',99,265,42,'serif','#262521'); text(x,'for considered',99,302,28,'serif','#262521'); text(x,'living.',99,336,28,'serif','#262521');
    x.fillStyle='#b5a58d'; x.fillRect(99,358,192,86); x.fillStyle='#3c4039'; x.fillRect(99,458,68,18);
    // Commerce interface.
    x.fillStyle='#d9ded9'; x.fillRect(355,145,250,360); x.fillStyle='#fff'; x.fillRect(368,158,224,334);
    text(x,'OBJECTS — SHOP',384,190,12,'sans-serif','#262521','600'); x.fillStyle='#d8c6ad'; x.fillRect(384,211,192,142);
    x.fillStyle='#a48c6f'; x.beginPath(); x.arc(480,275,42,0,Math.PI*2); x.fill();
    text(x,'Everyday forms',384,389,22,'serif','#262521'); text(x,'A considered collection',384,414,12,'sans-serif','#625d54'); x.fillStyle='#242421'; x.fillRect(384,446,92,24);
    // Portfolio interface.
    x.fillStyle='#d9d4ca'; x.fillRect(640,145,250,360); x.fillStyle='#232522'; x.fillRect(653,158,224,334);
    text(x,'STUDIO / 08',671,190,12,'sans-serif','#eae5db','600'); text(x,'Ideas into',671,270,35,'serif','#f5f0e6'); text(x,'experiences.',671,309,35,'serif','#f5f0e6');
    x.fillStyle='#b7b09f'; x.fillRect(671,340,190,105); x.fillStyle='#d4c6ad'; x.fillRect(671,458,58,2);
    text(x,'EDITORIAL',70,540,14,'sans-serif','#25231f','600'); text(x,'COMMERCE',355,540,14,'sans-serif','#25231f','600'); text(x,'PORTFOLIO',640,540,14,'sans-serif','#25231f','600');
    text(x, 'LAYOUT / TYPE / HIERARCHY / RESPONSIVE THINKING', 70, 600, 13, 'sans-serif', '#777064');
  }
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
  const add = (o, pos, range, off, spin = 1) => {
    o.position.set(...pos); o.userData = { t: pos, a: range[0], b: range[1], o: off, r: [rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1], spin };
    o.visible = false; group.add(o); parts.push(o); return o;
  };
  for (let i = -3; i <= 3; i++) for (let j = 0; j <= 9; j++) {
    const glass = (i * 7 + j * 3) % 8 === 0, a = 0.06 + 0.17 * (j / 9) + 0.04 * rnd();
    const m = glass ? M.glass : (i + j) % 2 ? M.ceramic : M.stone;
    add(bx(2.88, glass ? 0.26 : 0.2, 2.88, m), [i * 3, -0.1, 4 - j * 3], [a, a + 0.1], [(rnd() - .5) * 7, -9 - rnd() * 9, (rnd() - .5) * 7], 1.4);
  }
  for (const s of [-1, 1]) for (let k = 0; k < 7; k++) {
    const col = new THREE.Group(), a = 0.28 + k * 0.016;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.46, 6.6, 40), M.glass); shaft.position.y = 3.3;
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 6.7, 16), M.ceramic); core.position.y = 3.3;
    const lo = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.6, 0.18, 40), M.chrome); lo.position.y = 0.09;
    const hi = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.5, 0.18, 40), M.chrome); hi.position.y = 6.55;
    col.add(shaft, core, lo, hi); add(col, [s * 8, 0, 3 - k * 5.4], [a, a + 0.1], [0, 11, 0], 0.4);
  }
  for (const s of [-1, 1]) add(bx(0.7, 0.5, 37, M.ceramic), [s * 8, 6.95, -14.5], [0.4, 0.5], [0, 12, 0], 0.2);
  for (let k = 0; k < 7; k++) { const a = 0.41 + k * 0.01; add(bx(16.8, 0.32, 0.55, M.ceramic), [0, 7.3, 3 - k * 5.4], [a, a + 0.08], [0, 12, 0], 0.2); }
  for (const s of [-1, 1]) add(bx(0.14, 6.6, 36, M.frost), [s * 9.6, 3.3, -14.5], [0.43, 0.51], [s * 5, 0, 0], 0.1);
  add(bx(27, 10, 0.5, M.ceramic), [0, 5, WALL_Z - 0.7], [0.44, 0.52], [0, -10, 0], 0.1);
  add(bx(26, 9, 0.3, M.frost), [0, 4.6, WALL_Z], [0.46, 0.54], [0, 0, -8], 0.2);
  const frames = PROJECTS.map((p, i) => {
    const cv = artCanvas(p), tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    p.image = cv.toDataURL('image/jpeg', 0.92);
    const mat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }), g = new THREE.Group();
    const slab = bx(7.1, 4.9, 0.16, M.glass); g.add(slab);
    for (const [fw, fh, fx, fy] of [[7.3, .09, 0, 2.5], [7.3, .09, 0, -2.5], [.09, 5.0, 3.6, 0], [.09, 5.0, -3.6, 0]]) { const e = bx(fw, fh, 0.22, M.chrome); e.position.set(fx, fy, 0); g.add(e); }
    const art = new THREE.Mesh(new THREE.PlaneGeometry(6.6, 4.55), mat); art.position.z = 0.1; g.add(art);
    const a = 0.54 + i * 0.03; add(g, [FRAME_X[i], 4.7, WALL_Z + 0.35], [a, a + 0.09], [(i - 1) * 6, 3, 14], 1.1);
    return { mat, x: FRAME_X[i] };
  });
  const strips = [];
  for (let i = 0; i < 4; i++) { const a = 0.8 + i * 0.02, s = add(bx(6, 0.07, 0.07, M.lamp), [(i - 1.5) * 8, 8, WALL_Z + 6], [a, a + 0.05], [0, 6, 0], 0.2); strips.push(s); }
  const lights = [-8, 0, 8].map((x) => { const l = new THREE.PointLight(0xfff1de, 0, 40, 1.4); l.position.set(x, 7.5, WALL_Z + 7); group.add(l); return l; });
  const N = 420, pp = new Float32Array(N * 3);
  for (let i = 0; i < N * 3; i += 3) { pp[i] = rnd() * 36 - 18; pp[i + 1] = rnd() * 9; pp[i + 2] = rnd() * 50 - 30; }
  const dust = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pp, 3)), new THREE.PointsMaterial({ color: 0x0d0d0f, size: 0.045, transparent: true, opacity: 0.22, depthWrite: false }));
  group.add(dust);
  const ease = (k) => 1 - Math.pow(1 - k, 3), clamp = (v) => Math.min(1, Math.max(0, v));
  return {
    group, frames,
    assemble(p) { for (const o of parts) { const u = o.userData, k = ease(clamp((p - u.a) / (u.b - u.a))), f = 1 - k; o.visible = k > 0; o.position.set(u.t[0] + u.o[0] * f, u.t[1] + u.o[1] * f, u.t[2] + u.o[2] * f); o.rotation.set(u.r[0] * f * 2.4 * u.spin, u.r[1] * f * 2.4 * u.spin, u.r[2] * f * 1.6 * u.spin); } },
    light(focus, lamps) { frames.forEach((f, i) => f.mat.color.setScalar(focus < 0 ? 0.92 : i === focus ? 1 : 0.62)); M.lamp.color.setScalar(0.4 + lamps * 4.2); lights.forEach((l) => (l.intensity = lamps * 90)); },
    drift(dt) { const a = dust.geometry.attributes.position; for (let i = 1; i < N * 3; i += 3) { a.array[i] += dt * 0.1; if (a.array[i] > 9) a.array[i] = 0; } a.needsUpdate = true; },
  };
}
