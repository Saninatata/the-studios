/* The Studios — a sourced, piece-by-piece exhibition. */
export const SCENES = [
  { id: 'hero', range: [0, 0.05], label: 'Design Authority', title: 'The<br>Studios', body: 'A studio that builds itself, one decision at a time.' },
  { id: 'c1', range: [0.07, 0.25], label: 'I/IV — Ground', title: 'Foundation', body: 'Research, positioning and a point of view.' },
  { id: 'c2', range: [0.29, 0.47], label: 'II/IV — Structure', title: 'Structure', body: 'Systems, grids and type. The decisions nobody sees and everyone feels.' },
  { id: 'c3', range: [0.51, 0.91], label: 'III/IV — The Exhibition', title: 'A living<br>collection', body: 'Real works of art, identity systems and digital experiences, individually presented across the gallery walls.' },
  { id: 'c4', range: [0.92, 0.95], label: 'IV/IV — Light', title: 'Light', body: 'Motion, detail and the final point of view.' },
  { id: 'fin', range: [0.96, 1.1], label: 'The Studios', title: 'Every brand<br>is built.', body: 'Let us build yours.', bodyRange: [0.96, 0.98] },
];
export const CHAPTERS = [
  { name: 'Ground', range: [0.07, 0.27] },
  { name: 'Structure', range: [0.29, 0.49] },
  { name: 'Exhibition', range: [0.51, 0.91] },
  { name: 'Light', range: [0.92, 0.95] },
];

/* Historical works use The Met's object API. The runtime verifies public-domain
   status before accepting the image URL. Design/site previews are live captures
   of the linked original project/site, not fabricated portfolio work. */
const met = (id, title, artist, date, medium, note) => ({
  id: 'met-' + id, kind: 'art', metId: id, name: title, creator: artist, date, medium,
  category: 'Historical artwork', source: 'https://www.metmuseum.org/art/collection/search/' + id,
  description: note, caption: title + ' — ' + artist
});
const identity = (id, title, studio, year, url, note) => ({
  id, kind: 'identity', name: title, creator: studio, date: year, medium: 'Brand identity',
  source: url, image: 'https://image.thum.io/get/width/1200/crop/900/noanimate/' + url,
  description: note, caption: title + ' — Identity design'
});
const website = (id, title, studio, year, url, note) => ({
  id, kind: 'website', name: title, creator: studio, date: year, medium: 'Website / digital experience',
  source: url, image: 'https://image.thum.io/get/width/1200/crop/900/noanimate/' + url,
  description: note, caption: title + ' — Digital experience'
});
export const PROJECTS = [
  met(436535, 'Wheat Field with Cypresses', 'Vincent van Gogh', '1889', 'Oil on canvas', 'Painted at Saint-Rémy, this landscape is built around the expressive vertical movement of the cypress trees and the strong rhythm of the wheat field.'),
  met(437980, 'Cypresses', 'Vincent van Gogh', '1889', 'Oil on canvas', 'A close-up study of the cypress trees. The Met notes Van Gogh’s attention to their distinctive lines and proportions.'),
  met(56353, 'Under the Wave off Kanagawa (The Great Wave)', 'Katsushika Hokusai', 'ca. 1830–32', 'Woodblock print', 'A celebrated print from Thirty-six Views of Mount Fuji, using scale, perspective and the contrast between the wave and Mount Fuji.'),
  met(437127, 'Bridge over a Pond of Water Lilies', 'Claude Monet', '1899', 'Oil on canvas', 'One of Monet’s views of the Japanese-style bridge and water garden at Giverny.'),
  met(436528, 'Irises', 'Vincent van Gogh', '1890', 'Oil on canvas', 'A floral still life made at Saint-Rémy, notable for its contrasting colour fields and energetic brushwork.'),
  met(438722, 'The Potato Peeler', 'Vincent van Gogh', '1885', 'Oil on canvas', 'An early Nuenen-period painting, with a restrained palette and strong, simplified forms.'),
  met(459123, 'Madame Roulin and Her Baby', 'Vincent van Gogh', '1888', 'Oil on canvas', 'A portrait of Augustine Roulin and her infant daughter, painted after Van Gogh moved to Arles.'),
  met(55282, 'Honganji at Asakusa in Edo', 'Katsushika Hokusai', 'ca. 1830–32', 'Woodblock print', 'A print from Hokusai’s Thirty-six Views of Mount Fuji series, balancing architecture and landscape.'),
  identity('identity-poetry-foundation', 'Poetry Foundation', 'Pentagram — team project', 'Identity project', 'https://www.pentagram.com/work/poetry-foundation', 'A published identity system built around the visual potential of poets’ words. Open the original project for the full case study.'),
  identity('identity-philharmonia', 'Philharmonia', 'Pentagram — team project', 'Identity project', 'https://www.pentagram.com/work/philharmonia', 'A published brand identity for the Philharmonia orchestra. Open the original project for the complete identity and context.'),
  identity('identity-alpha-bank', 'Alpha Bank', 'Pentagram — team project', 'Identity project', 'https://www.pentagram.com/work/alpha-bank', 'A contemporary identity project for a major Greek bank. Open the original project for the full system.'),
  identity('identity-firaxis', 'Firaxis Games', 'Pentagram — team project', 'Identity project', 'https://www.pentagram.com/work/firaxis-games', 'An identity, bespoke typography and motion project for Firaxis Games. Open the original project for the full case study.'),
  website('site-apple', 'Apple', 'Apple design team', 'Live website', 'https://www.apple.com', 'A live digital storefront and product storytelling experience. Open the site to explore its current interface.'),
  website('site-linear', 'Linear', 'Linear design team', 'Live website', 'https://linear.app', 'A live product website for a project-management platform, with a strong editorial product narrative.'),
  website('site-stripe', 'Stripe', 'Stripe design team', 'Live website', 'https://stripe.com', 'A live financial technology website with a large documentation and product ecosystem.'),
  website('site-notion', 'Notion', 'Notion design team', 'Live website', 'https://www.notion.com', 'A live product website presenting a connected workspace through product-led storytelling.')
];
export const AGAIN_MS = 4200;
export const ACTIONS_RANGE = [0.98, 1.1];
export const HINT_WORDS = [[0.92, 'watch again'], [0, 'explore']];
