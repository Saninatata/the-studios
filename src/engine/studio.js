/* The Studios — the studio that builds itself.
   The framed canvases are original gallery studies, not stock placeholder gradients. */
import * as THREE from 'three';

export const WALL_Z = -27;
export const FRAME_X = [-8.8, 8.8];

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
  const loader = new THREE.TextureLoader(); loader.setCrossOrigin('anonymous');
  const frames = PROJECTS.map((p, i) => {
    const side = i % 2 === 0 ? -1 : 1, row = Math.floor(i / 2);
    const z = 3 - row * 4.05, x = side * 9.34;
    const mat = new THREE.MeshBasicMaterial({ color: 0xf1eee8, toneMapped: false });
    if (p.image) loader.load(p.image, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; mat.map = tex; mat.color.set(0xffffff); mat.needsUpdate = true;
    }, undefined, () => { p.imageFailed = true; });
    const g = new THREE.Group(); g.position.set(x, 4.55, z); g.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2;
    const slab = bx(3.25, 4.15, 0.14, M.glass); g.add(slab);
    const rim = new THREE.MeshStandardMaterial({ color: 0xb9b5ad, metalness: 0.82, roughness: 0.2 });
    for (const [w,h,px,py] of [[3.42,.08,0,2.1],[3.42,.08,0,-2.1],[.08,4.12,1.67,0],[.08,4.12,-1.67,0]]) {
      const edge = bx(w,h,.2,rim); edge.position.set(px,py,.08); g.add(edge);
    }
    const art = new THREE.Mesh(new THREE.PlaneGeometry(3.08, 3.92), mat); art.position.z = .11; g.add(art);
    const a = 0.5; add(g, [x, 4.55, z], [a, a + 0.04], [0, 0, 0], 0.1);
    return { mat, x, z, side, mesh: g };
  });
  const strips = [];
  frames.forEach((f) => group.add(f.mesh));
  for (let i = 0; i < 4; i++) { const a = 0.8 + i * 0.02, s = add(bx(6, 0.07, 0.07, M.lamp), [(i - 1.5) * 4, 8, -13], [a, a + 0.05], [0, 6, 0], 0.2); strips.push(s); }
  const lights = [-8.8, 8.8].map((x) => { const l = new THREE.PointLight(0xfff1de, 0, 35, 1.4); l.position.set(x * 0.8, 7.4, -13); group.add(l); return l; });
  const N = 420, pp = new Float32Array(N * 3);
  for (let i = 0; i < N * 3; i += 3) { pp[i] = rnd() * 36 - 18; pp[i + 1] = rnd() * 9; pp[i + 2] = rnd() * 50 - 30; }
  const dust = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pp, 3)), new THREE.PointsMaterial({ color: 0x0d0d0f, size: 0.045, transparent: true, opacity: 0.22, depthWrite: false }));
  group.add(dust);
  const ease = (k) => 1 - Math.pow(1 - k, 3), clamp = (v) => Math.min(1, Math.max(0, v));
  return {
    group, frames,
    assemble(p) { for (const o of parts) { const u = o.userData, k = ease(clamp((p - u.a) / (u.b - u.a))), f = 1 - k; o.visible = k > 0; o.position.set(u.t[0] + u.o[0] * f, u.t[1] + u.o[1] * f, u.t[2] + u.o[2] * f); o.rotation.set(u.r[0] * f * 2.4 * u.spin, u.r[1] * f * 2.4 * u.spin, u.r[2] * f * 1.6 * u.spin); } },
    light(focus, lamps) { frames.forEach((f, i) => f.mat.color.setScalar(focus < 0 ? 1 : i === focus ? 1 : 0.72)); M.lamp.color.setScalar(0.4 + lamps * 4.2); lights.forEach((l) => (l.intensity = lamps * 65)); },
    drift(dt) { const a = dust.geometry.attributes.position; for (let i = 1; i < N * 3; i += 3) { a.array[i] += dt * 0.1; if (a.array[i] > 9) a.array[i] = 0; } a.needsUpdate = true; },
  };
}
