import * as THREE from 'three';

const standard = (color, roughness=.55, metalness=0) =>
  new THREE.MeshStandardMaterial({color, roughness, metalness});

function artworkTexture(title, palette, variant) {
  const canvas=document.createElement('canvas'); canvas.width=1000; canvas.height=760;
  const c=canvas.getContext('2d');
  const gradient=c.createLinearGradient(0,0,1000,760);
  gradient.addColorStop(0,palette[0]); gradient.addColorStop(1,palette[1]);
  c.fillStyle=gradient; c.fillRect(0,0,1000,760);
  c.globalAlpha=.35;
  for(let i=0;i<24;i++){
    c.beginPath(); c.ellipse(500+Math.sin(i*1.6)*(90+i*13),380+Math.cos(i*1.2)*(55+i*11),110+i*13,42+i*8,i*.16,0,Math.PI*2);
    c.strokeStyle=palette[i%2]; c.lineWidth=7+(i%4)*2; c.stroke();
  }
  c.globalAlpha=.9;
  if(variant===0){
    c.fillStyle='#c8b894';c.fillRect(140,80,720,600);c.fillStyle='#34372f';c.fillRect(170,110,660,540);
    c.strokeStyle='#d4c6a5';c.lineWidth=13;
    for(let i=0;i<7;i++){c.beginPath();c.arc(500,375,65+i*43,0,Math.PI*2);c.stroke();}
  }else if(variant===1){
    c.fillStyle='#d4c6a5';
    for(let i=0;i<6;i++){c.beginPath();c.moveTo(130+i*130,640);c.lineTo(300+i*85,130+(i%2)*95);c.lineTo(430+i*60,640);c.fill();}
    c.fillStyle='#292d29';c.fillRect(0,610,1000,150);
  }else{
    c.strokeStyle='#d8d0bd';c.lineWidth=24;
    for(let i=0;i<6;i++){c.beginPath();c.arc(500,380,80+i*83,.25,Math.PI*1.8);c.stroke();}
    c.fillStyle='#b9ad8e';c.fillRect(455,280,90,190);
  }
  c.globalAlpha=1;c.fillStyle='rgba(244,241,232,.85)';c.font='24px Georgia';c.fillText(title.toUpperCase(),45,715);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}

function addPortal(group,width,height,z,index){
  const material=standard(index===0?0x8b806a:0x5b5649,.42,.28), depth=.28;
  const pieces=[
    [width,.24,depth,0,height/2,z],[width,.24,depth,0,-height/2,z],
    [.24,height,depth,-width/2,0,z],[.24,height,depth,width/2,0,z]
  ];
  for(const [w,h,d,x,y,pz] of pieces){
    const beam=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
    beam.position.set(x,3.15+y,pz);group.add(beam);
  }
}

export function createGallery(){
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0x171713);
  scene.fog=new THREE.FogExp2(0x171713,.019);
  const world=new THREE.Group();scene.add(world);
  scene.add(new THREE.HemisphereLight(0xe1d8c4,0x201e18,1.55));
  const key=new THREE.DirectionalLight(0xffe8c7,3.2);key.position.set(-4,8,5);scene.add(key);
  const fill=new THREE.PointLight(0xc7c4a8,38,28);fill.position.set(3,5,-8);scene.add(fill);
  const spot=new THREE.SpotLight(0xf4dfb7,75,24,Math.PI/5,.65,1.3);
  spot.position.set(0,7,1);spot.target.position.set(0,0,-2);scene.add(spot,spot.target);

  const floor=new THREE.Mesh(new THREE.PlaneGeometry(18,68),standard(0x34332b,.32,.24));
  floor.rotation.x=-Math.PI/2;floor.position.set(0,-.12,-15);world.add(floor);
  const ceiling=new THREE.Mesh(new THREE.PlaneGeometry(18,68),standard(0x24241f,.85));
  ceiling.rotation.x=Math.PI/2;ceiling.position.set(0,7,-15);world.add(ceiling);

  for(const side of [-1,1]){
    const wall=new THREE.Mesh(new THREE.BoxGeometry(.42,7.2,42),standard(0x292923,.9));
    wall.position.set(side*6.7,3.4,-14);world.add(wall);
    for(let z=2;z>-34;z-=6.5){
      const x=side*6.43;
      const column=new THREE.Group();column.position.set(x,0,z);world.add(column);
      const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.23,.29,5.65,24),standard(0xaaa087,.52,.22));shaft.position.y=3.15;column.add(shaft);
      const base=new THREE.Mesh(new THREE.BoxGeometry(.9,.28,1.05),standard(0x817965,.55,.25));base.position.y=.2;column.add(base);
      const capital=new THREE.Mesh(new THREE.BoxGeometry(.92,.25,1.05),standard(0xb1a487,.48,.3));capital.position.y=6.05;column.add(capital);
      const neck=new THREE.Mesh(new THREE.CylinderGeometry(.34,.3,.22,24),standard(0x968b73,.5,.25));neck.position.y=5.78;column.add(neck);
    }
  }
  for(let i=0;i<3;i++)addPortal(world,12-i*.48,6.5-i*.4,1.15-i*.3,i);

  // A custom S-shaped metal installation, designed as a spatial studio signature.
  const shape=new THREE.Shape();
  shape.moveTo(1.05,1.55);shape.bezierCurveTo(.45,2.05,-.55,1.95,-.98,1.25);
  shape.bezierCurveTo(-1.42,.55,-.82,.05,-.12,-.25);shape.bezierCurveTo(.62,-.55,1.12,-.82,.82,-1.42);
  shape.bezierCurveTo(.5,-2.02,-.58,-1.98,-1.12,-1.35);shape.lineTo(-.72,-.92);
  shape.bezierCurveTo(-.28,-1.35,.22,-1.48,.48,-1.12);shape.bezierCurveTo(.78,-.72,.28,-.42,-.42,-.12);
  shape.bezierCurveTo(-1.28,.28,-1.52,1.02,-.92,1.7);shape.bezierCurveTo(-.25,2.42,.85,2.22,1.38,1.68);shape.lineTo(1.05,1.55);
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:.42,bevelEnabled:true,bevelSegments:6,bevelSize:.09,bevelThickness:.09,curveSegments:36});
  geometry.computeVertexNormals();
  const sculpture=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color:0xbeb18e,metalness:.86,roughness:.2}));
  sculpture.position.set(0,3.2,-2.1);sculpture.scale.setScalar(1.05);world.add(sculpture);
  const halo=new THREE.Mesh(new THREE.TorusGeometry(2.45,.018,8,180),standard(0xc2b58f,.24,.8));
  halo.position.set(0,3.2,-2.3);halo.rotation.set(.6,.1,-.2);world.add(halo);
  const halo2=new THREE.Mesh(new THREE.TorusGeometry(2.75,.009,6,180),new THREE.MeshBasicMaterial({color:0xe0d1aa,transparent:true,opacity:.5}));
  halo2.position.copy(halo.position);halo2.rotation.set(-.4,.5,.3);world.add(halo2);
  const plinth=new THREE.Mesh(new THREE.CylinderGeometry(1.7,1.95,.55,80),standard(0x555044,.26,.58));
  plinth.position.set(0,.28,-2.1);world.add(plinth);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1.78,.025,8,120),standard(0xc0b28d,.25,.75));
  ring.rotation.x=Math.PI/2;ring.position.set(0,.57,-2.1);world.add(ring);

  const exhibits=[
    {z:-9,x:-6.4,title:'Form / 01',colors:['#6b6553','#252a25'],v:0,rot:Math.PI/2},
    {z:-16,x:6.4,title:'Structure / 02',colors:['#7a6047','#242720'],v:1,rot:-Math.PI/2},
    {z:-23,x:-6.4,title:'Intelligence / 03',colors:['#555b4e','#25251f'],v:2,rot:Math.PI/2}
  ];
  for(const exhibit of exhibits){
    const frame=new THREE.Mesh(new THREE.BoxGeometry(4.35,3.35,.24),standard(0x9b8965,.32,.62));
    frame.position.set(exhibit.x,3.5,exhibit.z);frame.rotation.y=exhibit.rot;world.add(frame);
    const art=new THREE.Mesh(new THREE.PlaneGeometry(4.05,3.05),new THREE.MeshStandardMaterial({map:artworkTexture(exhibit.title,exhibit.colors,exhibit.v),roughness:.82}));
    art.position.set(exhibit.x+(exhibit.x<0?.14:-.14),3.5,exhibit.z);art.rotation.y=exhibit.rot;world.add(art);
    const lamp=new THREE.PointLight(0xffdfad,16,7);lamp.position.set(exhibit.x*.82,5.8,exhibit.z+1);world.add(lamp);
  }
  for(let z=1;z>-32;z-=4){
    const fixture=new THREE.Mesh(new THREE.BoxGeometry(1.5,.05,.45),new THREE.MeshBasicMaterial({color:0xe4d4af}));
    fixture.position.set(0,6.92,z);world.add(fixture);
    const pool=new THREE.PointLight(0xcbb991,7,8);pool.position.set(0,5.8,z);world.add(pool);
  }
  for(const x of [-2.2,2.2]){
    const inlay=new THREE.Mesh(new THREE.BoxGeometry(.018,.018,38),standard(0x978a6b,.3,.6));
    inlay.position.set(x,-.105,-14);world.add(inlay);
  }
  const dustGeometry=new THREE.BufferGeometry(),positions=new Float32Array(650*3);
  for(let i=0;i<650;i++){positions[i*3]=(Math.random()-.5)*11;positions[i*3+1]=Math.random()*6;positions[i*3+2]=-Math.random()*36;}
  dustGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  world.add(new THREE.Points(dustGeometry,new THREE.PointsMaterial({color:0xd8c9a7,size:.025,transparent:true,opacity:.38,sizeAttenuation:true})));
  return {scene,world,sculpture,halo,halo2};
}
