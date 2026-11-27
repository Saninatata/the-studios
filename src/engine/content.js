/* The Studios — exhibition collection and scroll choreography. */
export const SCENES = [
  { id: 'hero', range: [0, 0.05], label: 'Design Authority', title: 'The<br>Studios', body: 'A studio that builds itself, one decision at a time.' },
  { id: 'c1', range: [0.07, 0.25], label: 'I/IV — Ground', title: 'Foundation', body: 'Before a pixel moves, the ground is laid: research, positioning, a point of view.' },
  { id: 'c2', range: [0.29, 0.47], label: 'II/IV — Structure', title: 'Structure', body: 'Systems, grids and type. The load-bearing decisions nobody sees and everyone feels.' },
  { id: 'c3', range: [0.51, 0.62], label: 'III/IV — Craft', title: 'The work', body: 'A collection of ideas, identities and digital experiences, considered one piece at a time.' },
  { id: 'c4', range: [0.8, 0.9], label: 'IV/IV — Light', title: 'Light', body: 'Motion and detail. The last ten percent that makes it feel inevitable.' },
  { id: 'fin', range: [0.94, 1.1], label: 'The Studios', title: 'Every brand<br>is built.', body: 'Let us build yours.', bodyRange: [0.94, 0.965] },
];
export const CHAPTERS = [
  { name: 'Ground', range: [0.07, 0.27] },
  { name: 'Structure', range: [0.29, 0.49] },
  { name: 'Craft', range: [0.51, 0.89] },
  { name: 'Light', range: [0.9, 0.93] },
];
const met = (id) => `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`;
const shot = (url) => `https://image.thum.io/get/width/1400/crop/900/noanimate/${encodeURIComponent(url)}`;
const make = (id, name, caption, source, year, labels, text, image = null) => ({
  id, name, caption, source, image, at: [0.535 + PROJECTS.length * 0.022, 0.557 + PROJECTS.length * 0.022],
  overlay: { year, title: name, label: labels, text }
});
export const PROJECTS = [];
const add = (...args) => PROJECTS.push(make(...args));
add('wheat-field', 'Wheat Field with Cypresses', '01 — Vincent van Gogh, Wheat Field with Cypresses', met(436535), '1889', ['Historical painting', 'Vincent van Gogh', 'The Metropolitan Museum of Art'], ['An expressive landscape by Vincent van Gogh, part of the museum’s collection.', 'Artwork and collection record provided by The Metropolitan Museum of Art.']);
add('cypresses', 'Cypresses', '02 — Vincent van Gogh, Cypresses', met(437980), '1889', ['Historical painting', 'Vincent van Gogh', 'The Metropolitan Museum of Art'], ['A study of the monumental cypress forms that became a recurring subject in Van Gogh’s work.', 'Artwork and collection record provided by The Metropolitan Museum of Art.']);
add('great-wave', 'Under the Wave off Kanagawa', '03 — Katsushika Hokusai, The Great Wave', met(56353), 'c. 1830–32', ['Japanese woodblock print', 'Katsushika Hokusai', 'The Metropolitan Museum of Art'], ['One of the best-known compositions in the series Thirty-six Views of Mount Fuji.', 'Artwork and collection record provided by The Metropolitan Museum of Art.']);
add('water-lilies', 'Bridge over a Pond of Water Lilies', '04 — Claude Monet, Bridge over a Pond of Water Lilies', met(437127), '1899', ['Historical painting', 'Claude Monet', 'The Metropolitan Museum of Art'], ['Monet’s garden bridge, rendered through layered colour and reflections.', 'Artwork and collection record provided by The Metropolitan Museum of Art.']);
add('irises', 'Irises', '05 — Vincent van Gogh, Irises', met(436528), '1890', ['Historical painting', 'Vincent van Gogh', 'The Metropolitan Museum of Art'], ['A floral composition from Van Gogh’s time at the asylum in Saint-Rémy.', 'Artwork and collection record provided by The Metropolitan Museum of Art.']);
add('potato-peeler', 'The Potato Peeler', '06 — Vincent van Gogh, The Potato Peeler', met(438722), '1885', ['Historical painting', 'Vincent van Gogh', 'The Metropolitan Museum of Art'], ['A figure study from Van Gogh’s early Dutch period.', 'Artwork and collection record provided by The Metropolitan Museum of Art.']);
add('madame-roulin', 'Madame Roulin and Her Baby', '07 — Vincent van Gogh, Madame Roulin and Her Baby', met(459123), '1888', ['Historical painting', 'Vincent van Gogh', 'The Metropolitan Museum of Art'], ['A portrait of Augustine Roulin with her infant daughter Marcelle.', 'Artwork and collection record provided by The Metropolitan Museum of Art.']);
add('honganji', 'Honganji at Asakusa in Edo', '08 — Katsushika Hokusai, Honganji at Asakusa in Edo', met(55282), 'c. 1830–32', ['Japanese woodblock print', 'Katsushika Hokusai', 'The Metropolitan Museum of Art'], ['A view of Edo from Hokusai’s series Thirty-six Views of Mount Fuji.', 'Artwork and collection record provided by The Metropolitan Museum of Art.']);
add('poetry-foundation', 'Poetry Foundation', '09 — Pentagram, Poetry Foundation identity', 'https://www.pentagram.com/work/poetry-identity', 'Identity project', ['Brand identity', 'Pentagram', 'Editorial + culture'], ['A visual identity project for the Poetry Foundation.', 'Project presentation and imagery are credited to Pentagram.'], shot('https://www.pentagram.com/work/poetry-identity'));
add('philharmonia', 'Philharmonia', '10 — Pentagram, Philharmonia identity', 'https://www.pentagram.com/work/philharmonia', 'Identity project', ['Brand identity', 'Pentagram', 'Music + culture'], ['A visual identity project for the Philharmonia orchestra.', 'Project presentation and imagery are credited to Pentagram.'], shot('https://www.pentagram.com/work/philharmonia'));
add('alpha-bank', 'Alpha Bank', '11 — Pentagram, Alpha Bank identity', 'https://www.pentagram.com/work/alpha-bank', 'Identity project', ['Brand identity', 'Pentagram', 'Finance'], ['A contemporary identity system for Alpha Bank.', 'Project presentation and imagery are credited to Pentagram.'], shot('https://www.pentagram.com/work/alpha-bank'));
add('firaxis-games', 'Firaxis Games', '12 — Pentagram, Firaxis Games identity', 'https://www.pentagram.com/work/firaxis-games', 'Identity project', ['Brand identity', 'Pentagram', 'Games'], ['A visual identity project for Firaxis Games.', 'Project presentation and imagery are credited to Pentagram.'], shot('https://www.pentagram.com/work/firaxis-games'));
add('apple', 'Apple', '13 — Apple, digital experience', 'https://www.apple.com', 'Website', ['Digital experience', 'Apple', 'Technology'], ['A study in product storytelling, art direction and restrained interaction.', 'Website preview is sourced from Apple’s public website.'], shot('https://www.apple.com'));
add('linear', 'Linear', '14 — Linear, digital experience', 'https://linear.app', 'Website', ['Digital experience', 'Linear', 'Software'], ['A product website with a clear visual system and precise motion language.', 'Website preview is sourced from Linear’s public website.'], shot('https://linear.app'));
add('stripe', 'Stripe', '15 — Stripe, digital experience', 'https://stripe.com', 'Website', ['Digital experience', 'Stripe', 'Financial technology'], ['A considered example of product communication and technical storytelling.', 'Website preview is sourced from Stripe’s public website.'], shot('https://stripe.com'));
add('notion', 'Notion', '16 — Notion, digital experience', 'https://www.notion.com', 'Website', ['Digital experience', 'Notion', 'Productivity'], ['A flexible product identity expressed through a clear, approachable web experience.', 'Website preview is sourced from Notion’s public website.'], shot('https://www.notion.com'));
export const AGAIN_MS = 4200;
export const ACTIONS_RANGE = [0.965, 1.1];
export const HINT_WORDS = [[0.92, 'watch again'], [0, 'build']];
