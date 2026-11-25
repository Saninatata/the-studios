import * as THREE from 'three';
import { createGallery } from './experience/gallery.js';
import './styles.css';

const $=selector=>document.querySelector(selector);
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
$('#year').textContent=new Date().getFullYear();

const preloader=$('#preloader'),enter=$('#enter');
let load=0;
const loading=setInterval(()=>{
  load=Math.min(100,load+4);$('#count').textContent=String(load).padStart(3,'0');
  $('#preFrame').style.setProperty('--load',load+'%');
  if(load===100){clearInterval(loading);$('#status').textContent='The studio is ready';enter.classList.add('ready');}
},35);
enter.addEventListener('click',()=>{preloader.classList.add('done');$('#site').classList.add('entered');setTimeout(()=>preloader.remove(),1500);});

const canvas=$('#world');
let renderer, camera, clock, gallery, ready=false;
try{
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight);
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
  camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,100);
  camera.position.set(0,2.2,9.5);clock=new THREE.Clock();gallery=createGallery();ready=true;
}catch(error){console.error('3D gallery initialisation failed:',error);$('#status').textContent='Gallery unavailable — project sections remain available';}

const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
let targetScroll=0,scroll=0;
function readScroll(){const max=document.documentElement.scrollHeight-innerHeight;targetScroll=max>0?clamp(scrollY/max,0,1):0;}
addEventListener('scroll',readScroll,{passive:true});readScroll();
const chapterNames=['THE ENTRANCE','A POINT OF VIEW','SELECTED WORK','CONNECTED DISCIPLINES','THE APPROACH','THE STUDIO'];
function animate(){
  requestAnimationFrame(animate);if(!ready)return;
  const time=clock.getElapsedTime();scroll+=(targetScroll-scroll)*(reducedMotion?1:.055);
  const s=scroll;
  camera.position.x=Math.sin(s*Math.PI*2)*.42;
  camera.position.y=2.25+Math.sin(time*.22)*.025;
  camera.position.z=9.5-s*29;
  camera.lookAt(Math.sin(s*Math.PI*2)*.3,2.5,camera.position.z-7.5);
  gallery.sculpture.rotation.y=Math.sin(time*.2)*.12+s*.25;
  gallery.sculpture.position.y=3.2+Math.sin(time*.4)*.035;
  gallery.halo.rotation.z=time*.045;gallery.halo2.rotation.z=-time*.03;
  renderer.render(gallery.scene,camera);
  const chapter=Math.min(5,Math.floor(s*6));
  $('#chapterTag').innerHTML='<b>'+String(chapter+1).padStart(2,'0')+'</b> / '+chapterNames[chapter];
  $('#progressText').textContent=String(chapter+1).padStart(2,'0')+' / 06';
  $('#progressBar').style.width=(s*100)+'%';
  $('#heroCopy').style.opacity=clamp(1-s*8,0,1);
  $('#heroCopy').style.transform='translateY('+(-s*70)+'px)';
  $('#rightNote').style.opacity=clamp(1-s*7,0,1);
  $('#scrollHint').style.opacity=clamp(1-s*9,0,1);
}
animate();
addEventListener('resize',()=>{
  if(!renderer||!camera)return;
  camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
});

const projects={
 macd:['Hospitality / Digital ordering','Mac D & Shawarma','A digital menu experience connecting customers to the restaurant through a WhatsApp order draft.','https://saninatata.github.io/mac-d-menu/'],
 nassets:['Mobility / Energy / Web experience','Nassets Technology','A digital direction for a business connecting electric mobility and solar energy solutions with customers in Nigeria.','mailto:sanimansur24@gmail.com'],
 studiolink:['Independent product / Creative platform','StudioLink','A product concept for designers and architecture students to present ideas, connect and collaborate.','https://saninatata.github.io/studio-glow-hub/'],
 kaoku:['Real estate / Identity direction','Kaoku','A considered identity and digital direction for a real-estate venture.','mailto:sanimansur24@gmail.com']
};
const overlay=$('#overlay');
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
  const project=projects[button.dataset.project];
  $('#dialogEyebrow').textContent=project[0];$('#dialogTitle').textContent=project[1];$('#dialogBody').textContent=project[2];$('#dialogLink').href=project[3];overlay.classList.add('open');
}));
function closeDialog(){overlay.classList.remove('open');}
$('#close').addEventListener('click',closeDialog);
overlay.addEventListener('click',event=>{if(event.target===overlay)closeDialog();});
addEventListener('keydown',event=>{if(event.key==='Escape')closeDialog();});

let audioContext,gain,audioOn=false;
$('#sound').addEventListener('click',async()=>{
  if(!audioContext){
    audioContext=new AudioContext();gain=audioContext.createGain();gain.gain.value=0;gain.connect(audioContext.destination);
    const low=audioContext.createOscillator(),high=audioContext.createOscillator();
    const lowGain=audioContext.createGain(),highGain=audioContext.createGain();
    low.type='sine';low.frequency.value=55;high.type='triangle';high.frequency.value=82.4;
    lowGain.gain.value=.16;highGain.gain.value=.025;low.connect(lowGain).connect(gain);high.connect(highGain).connect(gain);low.start();high.start();
  }
  await audioContext.resume();audioOn=!audioOn;gain.gain.setTargetAtTime(audioOn?.09:0,audioContext.currentTime,.8);
  $('#sound').innerHTML='Sound <span>'+(audioOn?'on':'off')+'</span>';
});
