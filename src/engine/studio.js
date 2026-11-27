/* The Studios — assembled architectural exhibition. */
import * as THREE from 'three';
export const WALL_Z = -27;
export const FRAME_X = [-8.4, 0, 8.4];
const clamp = (v) => Math.min(1, Math.max(0, v));
export function buildStudio(PROJECTS) {
  const group = new THREE.Group(), parts = [];
  let seed = 7; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  const M = {
    ceramic: new THREE.MeshStandardMaterial({ color: 0xe5e2dc, roughness: 0.78 }),
    stone: new THREE.MeshStandardMaterial({ color: 0xc9c5bc, roughness: 0.86 }),
    glass: new THREE.MeshStandardMaterial({ color: 0xd4d0c8, roughness: 0.52, metalness: 0.12 }),
    frost: new THREE.MeshStandardMaterial({ color: 0xe9e6df, roughness: 0.82 }),
    chrome: new THREE.MeshStandardMaterial({ color: 0x77736b, metalness: 0.48, roughness: 0.38 }),
    lamp: new THREE.MeshBasicMaterial({ color: new THREE.Color().setScalar(0.4), toneMapped: false }),
  };
  const bx = (w,h,d,m) => new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);
  const add = (o,pos,range,off,spin=1) => {
    o.position.set(...pos); o.userData={t:pos,a:range[0],b:range[1],o:off,r:[rnd()*2-1,rnd()*2-1,rnd()*2-1],spin};
    o.visible=false; group.add(o); parts.push(o); return o;
  };
  for(let i=-3;i<=3;i++) for(let j=0;j<=9;j++){
    const glass=(i*7+j*3)%8===0,a=0.06+0.17*(j/9)+0.04*rnd(),m=glass?M.glass:(i+j)%2?M.ceramic:M.stone;
    add(bx(2.88,glass?0.26:0.2,2.88,m),[i*3,-0.1,4-j*3],[a,a+0.1],[(rnd()-.5)*7,-9-rnd()*9,(rnd()-.5)*7],1.4);
  }
  for(const s of [-1,1]) for(let k=0;k<7;k++){
    const col=new THREE.Group(),shaft=new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.46,6.6,40),M.glass),core=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,6.7,16),M.ceramic);
    shaft.position.y=3.3;core.position.y=3.3;
    const lo=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.6,0.18,40),M.chrome),hi=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.5,0.18,40),M.chrome);lo.position.y=.09;hi.position.y=6.55;col.add(shaft,core,lo,hi);
    add(col,[s*8,0,3-k*5.4],[0.28+k*.016,0.38+k*.016],[0,11,0],.4);
  }
  for(const s of [-1,1]) add(bx(.7,.5,37,M.ceramic),[s*8,6.95,-14.5],[.4,.5],[0,12,0],.2);
  for(let k=0;k<7;k++) add(bx(16.8,.32,.55,M.ceramic),[0,7.3,3-k*5.4],[.41+k*.01,.49+k*.01],[0,12,0],.2);
  for(const s of [-1,1]) add(bx(.14,6.6,36,M.frost),[s*9.6,3.3,-14.5],[.43,.51],[s*5,0,0],.1);
  add(bx(27,10,.5,M.ceramic),[0,5,WALL_Z-.7],[.44,.52],[0,-10,0],.1);
  add(bx(26,9,.3,M.frost),[0,4.6,WALL_Z],[.46,.54],[0,0,-8],.2);

  const loader = new THREE.TextureLoader(); loader.setCrossOrigin('anonymous');
  const frames = PROJECTS.map((p,i)=>{
    const side = i%2===0 ? -1 : 1, row=Math.floor(i/2), z=10-row*4.7;
    const frame = new THREE.Group();
    const width=3.55,height=2.65;
    const backing=bx(width+.28,height+.28,.16,M.chrome); backing.position.z=-.08; frame.add(backing);
    const mat=new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false});
    const art=new THREE.Mesh(new THREE.PlaneGeometry(width,height),mat); art.position.z=.02; frame.add(art);
    const railMat=M.chrome;
    for(const [w,h,x,y] of [[width+.18,.055,0,height/2+.09],[width+.18,.055,0,-height/2-.09],[.055,height+.18,width/2+.09,0],[.055,height+.18,-width/2-.09,0]]){
      const edge=bx(w,h,.11,railMat);edge.position.set(x,y,.04);frame.add(edge);
    }
    frame.position.set(side*9.52,4.55,z);
    frame.rotation.y=side===-1?Math.PI/2:-Math.PI/2;
    const a=p.at[0];
    add(frame,[side*9.52,4.55,z],[a,a+.075],[(side*-5),3,12],.75);
    p.image=p.image||'';
    const imageUrl=p.image;
    if(imageUrl){
      loader.load(imageUrl,tex=>{tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;mat.map=tex;mat.needsUpdate=true;},undefined,()=>{});
    } else if(p.source.includes('/objects/')) {
      fetch(p.source).then(r=>r.ok?r.json():Promise.reject()).then(data=>{
        const url=data.primaryImageSmall||data.primaryImage;
        if(url){p.image=url;loader.load(url,tex=>{tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;mat.map=tex;mat.needsUpdate=true;},undefined,()=>{});}
      }).catch(()=>{});
    }
    return {mat,x:side*9.52,z,y:4.55,side};
  });
  const lights=[-8,0,8].map(x=>{const l=new THREE.PointLight(0xfff4e8,0,24,2);l.position.set(x,6.2,-12);group.add(l);return l;});
  const N=420,pp=new Float32Array(N*3);
  for(let i=0;i<N*3;i+=3){pp[i]=rnd()*36-18;pp[i+1]=rnd()*9;pp[i+2]=rnd()*50-30;}
  const dust=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(pp,3)),new THREE.PointsMaterial({color:0x0d0d0f,size:.045,transparent:true,opacity:.22,depthWrite:false}));group.add(dust);
  const ease=k=>1-Math.pow(1-k,3);
  return {
    group,frames,
    assemble(p){for(const o of parts){const u=o.userData,k=ease(clamp((p-u.a)/(u.b-u.a))),f=1-k;o.visible=k>0;o.position.set(u.t[0]+u.o[0]*f,u.t[1]+u.o[1]*f,u.t[2]+u.o[2]*f);o.rotation.set(u.r[0]*f*2.4*u.spin,u.r[1]*f*2.4*u.spin,u.r[2]*f*1.6*u.spin);}},
    light(focus,lamps){frames.forEach((f,i)=>f.mat.color.setScalar(focus<0?0.92:i===focus?1:0.84));M.lamp.color.setScalar(0.12+lamps*0.45);lights.forEach(l=>l.intensity=lamps*7);},
    drift(dt){const a=dust.geometry.attributes.position;for(let i=1;i<N*3;i+=3){a.array[i]+=dt*.1;if(a.array[i]>9)a.array[i]=0;}a.needsUpdate=true;},
  };
}
