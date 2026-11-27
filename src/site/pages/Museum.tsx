import { useEffect, useState } from 'react';

type Piece = { id?:string; title:string; maker:string; date:string; category:string; source:string; image?:string; description:string };
const pieces: Piece[] = [
{id:'436535',title:'Wheat Field with Cypresses',maker:'Vincent van Gogh',date:'1889',category:'Historical art',source:'https://www.metmuseum.org/art/collection/search/436535',description:'A landscape shaped by movement, rhythm and expressive colour.'},
{id:'437980',title:'Cypresses',maker:'Vincent van Gogh',date:'1889',category:'Historical art',source:'https://www.metmuseum.org/art/collection/search/437980',description:'A study of the cypress trees that became a recurring subject in Van Gogh’s work.'},
{id:'56353',title:'Under the Wave off Kanagawa',maker:'Katsushika Hokusai',date:'c. 1830–32',category:'Historical art',source:'https://www.metmuseum.org/art/collection/search/56353',description:'A landmark woodblock print from the series Thirty-six Views of Mount Fuji.'},
{id:'437127',title:'Bridge over a Pond of Water Lilies',maker:'Claude Monet',date:'1899',category:'Historical art',source:'https://www.metmuseum.org/art/collection/search/437127',description:'A view across the water garden at Giverny.'},
{id:'436528',title:'Irises',maker:'Vincent van Gogh',date:'1890',category:'Historical art',source:'https://www.metmuseum.org/art/collection/search/436528',description:'A garden study built from vivid colour and repeated forms.'},
{id:'438722',title:'The Potato Peeler',maker:'Vincent van Gogh',date:'1885',category:'Historical art',source:'https://www.metmuseum.org/art/collection/search/438722',description:'An early figure study from Van Gogh’s Dutch period.'},
{id:'459123',title:'Madame Roulin and Her Baby',maker:'Vincent van Gogh',date:'1888',category:'Historical art',source:'https://www.metmuseum.org/art/collection/search/459123',description:'A portrait from the artist’s time in Arles.'},
{id:'55282',title:'Honganji at Asakusa in Edo',maker:'Katsushika Hokusai',date:'c. 1830–32',category:'Historical art',source:'https://www.metmuseum.org/art/collection/search/55282',description:'A city view from Hokusai’s celebrated landscape series.'},
{title:'Poetry Foundation',maker:'Pentagram',date:'Identity system',category:'Identity & graphic design',source:'https://www.pentagram.com/work/poetry-identity',description:'An identity built for a literary organisation and its broad programme.'},
{title:'Philharmonia',maker:'Pentagram',date:'Identity system',category:'Identity & graphic design',source:'https://www.pentagram.com/work/philharmonia',description:'A visual identity for an orchestra and its musical programme.'},
{title:'Alpha Bank',maker:'Pentagram',date:'Identity system',category:'Identity & graphic design',source:'https://www.pentagram.com/work/alpha-bank',description:'A contemporary identity system for a financial institution.'},
{title:'Firaxis Games',maker:'Pentagram',date:'Identity system',category:'Identity & graphic design',source:'https://www.pentagram.com/work/firaxis-games',description:'A distinctive identity for a game development studio.'},
{title:'Apple',maker:'Apple',date:'Website',category:'Web design',source:'https://www.apple.com',description:'Product storytelling, typography and restrained interaction.'},
{title:'Linear',maker:'Linear',date:'Website',category:'Web design',source:'https://linear.app',description:'A focused interface language for a software product.'},
{title:'Stripe',maker:'Stripe',date:'Website',category:'Web design',source:'https://stripe.com',description:'A clear, editorial approach to explaining complex financial tools.'},
{title:'Notion',maker:'Notion',date:'Website',category:'Web design',source:'https://www.notion.com',description:'A flexible product identity expressed through a clean digital system.'}
];
const filters=['All','Historical art','Identity & graphic design','Web design'];
export default function Museum(){
 const [filter,setFilter]=useState('All'); const [images,setImages]=useState<Record<string,string>>({});
 useEffect(()=>{let live=true;const ids=pieces.filter(p=>/^\\d+$/.test(p.id||'')).map(p=>p.id);Promise.all(ids.map(async id=>{try{const r=await fetch('https://collectionapi.metmuseum.org/public/collection/v1/objects/'+id);const j=await r.json();return [id,j.primaryImageSmall||j.primaryImage] as const;}catch{return [id,''] as const;}})).then(rows=>{if(live)setImages(Object.fromEntries(rows.filter(x=>x[1])));});return()=>{live=false;};},[]);
 const shown=pieces.filter(p=>filter==='All'||p.category===filter);
 return <><section className="hero"><p className="eyebrow rv">The exhibition / 001—016</p><h1 className="h1 display rv">A study of<br/>visual culture.</h1><p className="lead rv">An evolving collection of art, identity and digital experiences. Each piece is presented with its maker, context and original source.</p></section>
 <section className="block"><div className="filters" role="group" aria-label="Filter exhibition">{filters.map(f=><button className="chip" type="button" key={f} aria-pressed={filter===f} onClick={()=>setFilter(f)}>{f}</button>)}</div>
 <div className="museum-grid">{shown.map((p)=><article className="museum-piece" key={p.title}><a className="museum-image" href={p.source} target="_blank" rel="noreferrer">{p.category==='Historical art'?(images[p.id]?<img src={images[p.id]} alt={p.title} loading="lazy"/>:<span className="museum-loading">Loading collection image…</span>):<div className={'museum-preview museum-preview--'+p.category.replace(/[^a-z]/gi,'').toLowerCase()}><span>{p.maker}</span><strong>{p.title}</strong><small>{p.category}</small></div>}</a><div className="museum-caption"><span className="eyebrow">{String(pieces.indexOf(p)+1).padStart(2,'0')} / {p.category}</span><h2>{p.title}</h2><p>{p.maker} · {p.date}</p><p className="museum-description">{p.description}</p><a className="link" href={p.source} target="_blank" rel="noreferrer">View original source ↗</a></div></article>)}</div></section></>;
}
