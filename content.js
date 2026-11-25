/* The Studios — copy, projects and where each text stands on the scroll (0…1).
   Everything a non-developer edits is here. Replace PROJECTS images/captions with real work. */
export const SCENES = [
  { id: 'hero', range: [0, 0.05], label: 'Design Authority', title: 'The<br>Studios', body: 'A studio that builds itself, one decision at a time.' },
  { id: 'c1', range: [0.07, 0.25], label: 'I/IV — Ground', title: 'Foundation', body: 'Before a pixel moves, the ground is laid: research, positioning, a point of view.' },
  { id: 'c2', range: [0.29, 0.47], label: 'II/IV — Structure', title: 'Structure', body: 'Systems, grids and type. The load-bearing decisions nobody sees and everyone feels.' },
  { id: 'c3', range: [0.51, 0.62], label: 'III/IV — Craft', title: 'The work', body: 'Each piece is hung only when it is ready to be judged.' },
  { id: 'c4', range: [0.8, 0.9], label: 'IV/IV — Light', title: 'Light', body: 'Motion and detail. The last ten percent that makes it feel inevitable.' },
  { id: 'fin', range: [0.94, 1.1], label: 'The Studios', title: 'Every brand<br>is built.', body: 'Let us build yours.', bodyRange: [0.94, 0.965] },
];

export const CHAPTERS = [
  { name: 'Ground', range: [0.07, 0.27] },
  { name: 'Structure', range: [0.29, 0.49] },
  { name: 'Craft', range: [0.51, 0.78] },
  { name: 'Light', range: [0.8, 0.93] },
];

/* The three framed pieces on the back wall. `at` is the scroll window in which each is the one in focus. */
export const PROJECTS = [
  { id: 'renderit', name: 'Renderit', caption: '01 — Renderit, AI rendering', at: [0.6, 0.67], palette: ['#cfe3ff', '#7aa7ff'],
    overlay: { year: '2025', title: 'Renderit', label: ['AI rendering SaaS', 'Product + brand', 'renderit.site'], text: ['Placeholder: describe the brief, the decision that mattered, and the result.', 'Replace this image with a real screenshot in src/engine/content.js.'] } },
  { id: 'socialmind', name: 'SocialMind', caption: '02 — SocialMind, agent dashboard', at: [0.67, 0.74], palette: ['#ffe3d1', '#ff9a6b'],
    overlay: { year: '2025', title: 'SocialMind', label: ['Agent dashboard', 'Product design', 'Internal tool'], text: ['Placeholder: describe the brief, the decision that mattered, and the result.', 'Replace this image with a real screenshot in src/engine/content.js.'] } },
  { id: 'next', name: 'Your project', caption: '03 — Your project here', at: [0.74, 0.8], palette: ['#d9f2e6', '#5fc79a'],
    overlay: { year: '2026', title: 'Your project', label: ['Brand + web', 'Design Authority', 'Next'], text: ['Placeholder: the third piece on the wall.', 'Replace this image with a real screenshot in src/engine/content.js.'] } },
];

export const AGAIN_MS = 4200;      // how long "Watch again" takes to take the studio apart
export const ACTIONS_RANGE = [0.965, 1.1];
export const HINT_WORDS = [[0.92, 'watch again'], [0, 'build']];
