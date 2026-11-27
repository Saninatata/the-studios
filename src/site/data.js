/* The Studios — site content. Everything here is placeholder copy: edit freely.
   PROJECTS (the three framed pieces on the home wall) live in ../engine/content.js and are reused on the Work pages. */
export const CONTACT = {
  email: 'hello@thestudios.site',          // placeholder: put your real address here
  location: 'Nigeria — working worldwide',
  hours: 'Mon–Fri, replies within one working day',
  socials: [],                              // e.g. [['Instagram', 'https://instagram.com/yourhandle']]
  formEndpoint: '',                         // optional: a Formspree / Web3Forms URL. Empty = forms open the visitor's email app
};

export const SERVICES = [
  { id: 'brand', n: '01', name: 'Brand identity', line: 'A point of view you can recognise at a glance.', items: ['Strategy & positioning', 'Naming', 'Logo & visual system', 'Brand guidelines'], suits: 'Founders launching or repositioning.' },
  { id: 'web', n: '02', name: 'Websites & experiences', line: 'Fast, considered sites with real motion and depth.', items: ['Art direction', 'React / Vite builds', 'WebGL & 3D', 'Hosting & handover'], suits: 'Brands that need to be remembered.' },
  { id: 'product', n: '03', name: 'Product & interface design', line: 'Interfaces that feel obvious once you use them.', items: ['UX research', 'UI systems', 'Prototyping', 'Design handoff'], suits: 'SaaS products and internal tools.' },
  { id: 'motion', n: '04', name: 'Motion & 3D', line: 'Movement that carries the idea, not decoration.', items: ['Interaction design', '3D scenes', 'Launch films', 'Social motion'], suits: 'Launches, campaigns and hero moments.' },
  { id: 'ai', n: '05', name: 'AI integration', line: 'Put models to work inside the product, quietly.', items: ['AI features', 'Agents & automation', 'Python / Node backends', 'Prompt & evaluation design'], suits: 'Teams adding intelligence to what they already have.' },
  { id: 'viz', n: '06', name: 'Architectural visualisation', line: 'Spaces shown before they are built.', items: ['Concept renders', 'AI-assisted rendering', 'Urban & masterplan boards', 'Walkthroughs'], suits: 'Architects, developers and studios.' },
];

export const PROCESS = [
  { n: 'I', name: 'Ground', text: 'Before a pixel moves, the ground is laid: research, positioning, a point of view.' },
  { n: 'II', name: 'Structure', text: 'Systems, grids and type. The load-bearing decisions nobody sees and everyone feels.' },
  { n: 'III', name: 'Craft', text: 'Each piece is hung only when it is ready to be judged.' },
  { n: 'IV', name: 'Light', text: 'Motion and detail. The last ten percent that makes it feel inevitable.' },
];

export const PROJECT_META = {
  renderit: { category: 'Product', year: '2025', role: 'Design + build', services: ['Product design', 'AI integration', 'Brand'],
    brief: 'Placeholder: what the client needed and why it was hard.', approach: 'Placeholder: the decisions that shaped the work, in two or three sentences.', result: 'Placeholder: what changed once it shipped. Numbers if you have them.' },
  socialmind: { category: 'Product', year: '2025', role: 'Product design', services: ['Interface design', 'AI integration', 'Backend'],
    brief: 'Placeholder: what the client needed and why it was hard.', approach: 'Placeholder: the decisions that shaped the work, in two or three sentences.', result: 'Placeholder: what changed once it shipped. Numbers if you have them.' },
  next: { category: 'Brand', year: '2026', role: 'Brand + web', services: ['Brand identity', 'Website'],
    brief: 'Placeholder: the third piece on the wall.', approach: 'Placeholder: the decisions that shaped the work, in two or three sentences.', result: 'Placeholder: what changed once it shipped.' },
};

export const PRINCIPLES = [
  ['Authority, not decoration', 'Every choice has a reason you can say out loud.'],
  ['Built, not assembled', 'We make the parts ourselves, so they fit.'],
  ['Motion with meaning', 'If it moves, it is telling you something.'],
  ['Small team, full attention', 'The people you meet are the people who make it.'],
];

export const FAQ = [
  ['How long does a project take?', 'Brand and web projects usually run four to eight weeks. A quote will give you a real timeline for yours.'],
  ['How do you price?', 'By project, after a short conversation about scope. Tell us your budget range in the quote form and we will shape the work to fit it.'],
  ['Can you work with our existing team?', 'Yes. We often join product teams for a sprint or a launch and hand everything over cleanly.'],
  ['Do you build as well as design?', 'Yes. What we design is what ships: React, WebGL and backends included.'],
];

export const QUOTE = {
  budgets: ['Under $2k', '$2k – $5k', '$5k – $10k', '$10k +', 'Not sure yet'],
  timelines: ['As soon as possible', '1 – 2 months', '3 months +', 'Flexible'],
};

/** Send a form: to formEndpoint if you set one, otherwise open the visitor's email app with the message filled in. */
export async function submitForm(subject, data) {
  if (CONTACT.formEndpoint) {
    const r = await fetch(CONTACT.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ subject, ...data }) });
    if (!r.ok) throw new Error('The message could not be sent.');
    return 'sent';
  }
  const body = Object.entries(data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n');
  location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return 'mailto';
}
