/* The Studios — gallery copy and scroll choreography.
   Gallery panels are original visual studies informed by documented design movements.
   They are not presented as original historical artworks or client commissions. */
export const SCENES = [
  { id: 'hero', range: [0, 0.05], label: 'Design Authority', title: 'The<br>Studios', body: 'A studio that builds itself, one decision at a time.' },
  { id: 'c1', range: [0.07, 0.25], label: 'I/IV — Ground', title: 'Foundation', body: 'Before a pixel moves, the ground is laid: research, positioning, a point of view.' },
  { id: 'c2', range: [0.29, 0.47], label: 'II/IV — Structure', title: 'Structure', body: 'Systems, grids and type. The load-bearing decisions nobody sees and everyone feels.' },
  { id: 'c3', range: [0.51, 0.62], label: 'III/IV — Craft', title: 'The collection', body: 'A study of visual culture: from historical movements to identity systems and digital spaces.' },
  { id: 'c4', range: [0.8, 0.9], label: 'IV/IV — Light', title: 'Light', body: 'Motion and detail. The last ten percent that makes it feel inevitable.' },
  { id: 'fin', range: [0.94, 1.1], label: 'The Studios', title: 'Every brand<br>is built.', body: 'Let us build yours.', bodyRange: [0.94, 0.965] },
];

export const CHAPTERS = [
  { name: 'Ground', range: [0.07, 0.27] },
  { name: 'Structure', range: [0.29, 0.49] },
  { name: 'Craft', range: [0.51, 0.78] },
  { name: 'Light', range: [0.8, 0.93] },
];

/* Three gallery collections displayed as framed works in the 3D hall. */
export const PROJECTS = [
  {
    id: 'history', kind: 'history', name: 'Art History', caption: '01 — Art history & visual culture', at: [0.6, 0.67],
    overlay: {
      year: '1400s — 1930s', title: 'Art History', label: ['Historical visual studies', 'Renaissance · Ukiyo-e · Bauhaus', 'Curated references'],
      text: [
        'A visual timeline exploring how artists and movements changed composition, colour, form and visual communication.',
        'Renaissance (c. 1400–1600): perspective, proportion and human-centred composition. Ukiyo-e (17th–19th centuries): flattened space, expressive outlines and carefully balanced forms. Bauhaus (1919–1933): geometry, function and the union of art and craft.',
        'The gallery artwork is an original educational interpretation, not a reproduction of a specific historical painting. Dates describe broad periods and movements.'
      ]
    }
  },
  {
    id: 'identity', kind: 'identity', name: 'Identity & Logos', caption: '02 — Identity systems & marks', at: [0.67, 0.74],
    overlay: {
      year: 'Visual identity', title: 'Identity & Logos', label: ['Symbol · Wordmark · System', 'Brand identity studies', 'Original explorations'],
      text: [
        'A collection of identity-design studies: monograms, geometric symbols, wordmarks and the relationship between a mark and its wider visual language.',
        'The board explores reduction, proportion, negative space, alignment and repeatable rules. A successful identity must remain recognisable across small marks, print, signage and digital interfaces.',
        'These are original concept studies created for the gallery, not client commissions or existing registered brand marks.'
      ]
    }
  },
  {
    id: 'digital', kind: 'digital', name: 'Digital Experiences', caption: '03 — Website & interface design', at: [0.74, 0.8],
    overlay: {
      year: 'Contemporary', title: 'Digital Experiences', label: ['Web design · UI · Interaction', 'Editorial / commerce / portfolio', 'Interface studies'],
      text: [
        'A set of website-design studies showing how hierarchy, typography, grids, imagery and interaction shape a digital experience.',
        'The layouts explore three directions: an editorial landing page, a considered commerce interface and a portfolio experience. Each is a visual concept rather than a live client website.',
        'The focus is on clarity, pacing, responsive structure and the details that make an interface feel coherent.'
      ]
    }
  },
];

export const AGAIN_MS = 4200;
export const ACTIONS_RANGE = [0.965, 1.1];
export const HINT_WORDS = [[0.92, 'watch again'], [0, 'build']];
