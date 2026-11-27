/* The Studios — the lens.
   Scene → soft bloom (the lamp strips and glass glints glow) → tone map → one finishing pass:
   the opening after Enter (white eaten away from the middle in spreading blots, with a faint glass edge),
   a touch of chromatic spread while the camera rushes, a light vignette and fine grain. */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const FINISH = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uOpen: { value: 1 }, uAspect: { value: 1 }, uRush: { value: 0 }, uBg: { value: new THREE.Color('#f5f4f1') } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse; uniform float uTime, uOpen, uAspect, uRush; uniform vec3 uBg; varying vec2 vUv;
    float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
    float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1,0)), f.x), mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y); }
    float fbm(vec2 p){ float a = .5, s = 0.; for (int i = 0; i < 4; i++){ s += a * noise(p); p = p * 2.03 + 17.1; a *= .5; } return s; }
    void main(){
      vec2 d = vUv - .5;
      float sp = uRush * .018 * dot(d, d) * 4.0;
      vec3 c = vec3(texture2D(tDiffuse, vUv + d * sp).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - d * sp).b);
      c *= 1.0 - .07 * smoothstep(.35, .85, length(d * vec2(1.0, .9)));
      c += (hash(gl_FragCoord.xy + fract(uTime) * 91.7) - .5) * .014;
      if (uOpen < .999) {
        vec2 m = d * vec2(uAspect, 1.0);
        float cloud = fbm(m * 1.6 + .37) * .72 + fbm(m * 4.2 + .11) * .28;
        float e = length(m) / length(vec2(uAspect, 1.0)) * 1.26 + cloud * .62 - mix(.13, 1.13, uOpen);
        float edge = exp(-max(e, 0.) / .012) * smoothstep(0., .2, uOpen) * (1. - smoothstep(.8, 1., uOpen));
        c = mix(c, uBg - vec3(.1, .09, .06) * edge + vec3(.06) * edge * edge, smoothstep(0., .006, e));
      }
      gl_FragColor = vec4(max(c, 0.), 1.);
    }`,
};

export function makeLens(renderer, scene, camera) {
  const composer = new EffectComposer(renderer);
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.3, 0.7, 1.08);
  const finish = new ShaderPass(FINISH);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  composer.addPass(finish);
  const u = finish.uniforms;
  return {
    composer,
    resize(w, h, ratio) { composer.setPixelRatio(ratio); composer.setSize(w, h); u.uAspect.value = w / h; },
    render(time, open, rush) { u.uTime.value = time; u.uOpen.value = open; u.uRush.value = rush; composer.render(); },
  };
}
