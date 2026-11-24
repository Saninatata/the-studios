import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

class DiamondCursor {
  constructor() {
    this.canvas = document.getElementById("diamond-cursor-canvas");
    if (!this.canvas) return;
    this.mouse = { x: innerWidth / 2, y: innerHeight / 2 };
    this.pos = { ...this.mouse };
    this.vel = { x: 0, y: 0 };
    this.isHovering = false;
    this.isPressed = false;
    this.scale = 1.15;
    this.visible = false;
    this.reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    this.finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    if (!this.finePointer.matches || this.reducedMotion.matches) {
      this.canvas.remove();
      return;
    }
    try {
      this.initThree();
      this.buildDiamondGeometry();
      this.createDiamondMaterial();
      this.assembleCursor();
      this.bindEvents();
      document.body.classList.add("diamond-cursor-active");
      this.animate();
    } catch (error) {
      console.warn("Diamond cursor unavailable; using native cursor.", error);
      this.canvas.remove();
    }
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-innerWidth/2, innerWidth/2, innerHeight/2, -innerHeight/2, 1, 1000);
    this.camera.position.z = 500;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
    this.renderer.setSize(innerWidth, innerHeight);
  }

  buildDiamondGeometry() {
    const vertices = [];
    const cTip=[0,0,5.5], cLeft=[2.2,-16.5,6.2], cMidL=[6.8,-14.2,6.2], cTailB=[10.2,-21.5,5.8], cTailT=[13.5,-20,5.8], cMidR=[10,-12.8,6.2], cRight=[15.2,-12.8,6.2];
    const gTip=[0,0,0], gLeft=[0,-23,0], gMidL=[5.4,-18.2,0], gTailB=[9.8,-27.5,0], gTailT=[14.2,-25.6,0], gMidR=[9.8,-16.2,0], gRight=[18,-16.2,0];
    const pKeelTop=[4.5,-9.5,-8.5], pKeelBot=[9.2,-19.5,-7.5];
    const tri=(a,b,c)=>vertices.push(...a,...b,...c);
    tri(cTip,cLeft,cMidL); tri(cTip,cMidL,cMidR); tri(cTip,cMidR,cRight); tri(cMidL,cTailB,cTailT); tri(cMidL,cTailT,cMidR);
    tri(gTip,gLeft,cLeft); tri(gTip,cLeft,cTip); tri(gLeft,gMidL,cMidL); tri(gLeft,cMidL,cLeft);
    tri(gMidL,gTailB,cTailB); tri(gMidL,cTailB,cMidL); tri(gTailB,gTailT,cTailT); tri(gTailB,cTailT,cTailB);
    tri(gTailT,gMidR,cMidR); tri(gTailT,cMidR,cTailT); tri(gMidR,gRight,cRight); tri(gMidR,cRight,cMidR); tri(gRight,gTip,cTip); tri(gRight,cTip,cRight);
    tri(gTip,pKeelTop,gLeft); tri(gLeft,pKeelTop,gMidL); tri(gMidL,pKeelTop,pKeelBot); tri(gMidL,pKeelBot,gTailB);
    tri(gTailB,pKeelBot,gTailT); tri(gTailT,pKeelBot,gMidR); tri(gMidR,pKeelBot,pKeelTop); tri(gMidR,pKeelTop,gRight); tri(gRight,pKeelTop,gTip);
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices,3));
    this.geometry.computeVertexNormals();
  }

  createDiamondMaterial() {
    this.material = new THREE.ShaderMaterial({
      transparent:true, side:THREE.DoubleSide,
      uniforms:{uTime:{value:0},uTilt:{value:new THREE.Vector2(0,0)}},
      vertexShader:`
        varying vec3 vNormal; varying vec3 vViewPos; varying vec3 vLocalPos;
        void main(){vLocalPos=position;vNormal=normalize(normalMatrix*normal);vec4 mvPosition=modelViewMatrix*vec4(position,1.0);vViewPos=-mvPosition.xyz;gl_Position=projectionMatrix*mvPosition;}
      `,
      fragmentShader:`
        uniform float uTime; uniform vec2 uTilt;
        varying vec3 vNormal; varying vec3 vViewPos; varying vec3 vLocalPos;
        float sampleStudioEnv(vec3 dir){
          float band1=smoothstep(0.55,0.96,dot(dir,normalize(vec3(-0.6,0.7,0.4))));
          float band2=smoothstep(0.65,0.98,dot(dir,normalize(vec3(0.8,-0.3,0.5))));
          float rim=smoothstep(0.40,0.92,dot(dir,normalize(vec3(0.1,0.9,-0.4))));
          float darkCut=smoothstep(0.2,0.85,abs(sin(dir.x*5.0+dir.y*4.0)));
          return clamp(0.14+band1*0.95+band2*0.75+rim*0.55-darkCut*0.22,0.06,1.0);
        }
        void main(){
          vec3 N=normalize(vNormal),V=normalize(vViewPos),R=reflect(-V,N),T=refract(-V,N,1.0/2.417);
          vec3 bounce=normalize(T+vec3(uTilt.x*0.35,uTilt.y*0.35,0.25));
          float reflected=sampleStudioEnv(R),refracted=sampleStudioEnv(bounce);
          float spark=step(0.72,fract(sin(dot(floor(vLocalPos.xy*1.4+N.xy*3.0),vec2(12.9898,78.233)))*43758.5453));
          float fresnel=pow(1.0-max(dot(N,V),0.0),2.6);
          vec3 light=normalize(vec3(-0.5+uTilt.x,0.8+uTilt.y,1.0)),H=normalize(light+V);
          float spec=pow(max(dot(N,H),0.0),96.0);
          float lum=mix(refracted,reflected,0.52+fresnel*0.45)+spec*1.35+fresnel*0.45+spark*0.14;
          vec3 color=vec3(lum)*vec3(0.97,0.99,1.0);
          float alpha=clamp(0.84+fresnel*0.16+spec*0.2,0.84,1.0);
          gl_FragColor=vec4(color,alpha);
        }
      `
    });
    this.edgeMaterial = new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:0.32});
  }

  assembleCursor() {
    this.cursorGroup = new THREE.Group();
    this.cursorGroup.add(new THREE.Mesh(this.geometry,this.material));
    this.cursorGroup.add(new THREE.LineSegments(new THREE.EdgesGeometry(this.geometry,12),this.edgeMaterial));
    this.cursorGroup.scale.setScalar(1.15);
    this.scene.add(this.cursorGroup);
  }

  bindEvents() {
    window.addEventListener("pointermove",e=>{
      if(e.pointerType!=="mouse") return;
      this.vel.x=e.clientX-this.mouse.x; this.vel.y=e.clientY-this.mouse.y;
      this.mouse.x=e.clientX; this.mouse.y=e.clientY; this.visible=true;
      this.isHovering=!!e.target.closest("a,button,input,select,textarea,[role='button'],[data-cursor='hover']");
    },{passive:true});
    window.addEventListener("pointerdown",e=>{if(e.pointerType==="mouse")this.isPressed=true;},{passive:true});
    window.addEventListener("pointerup",()=>this.isPressed=false,{passive:true});
    window.addEventListener("blur",()=>{this.visible=false;this.isPressed=false;},{passive:true});
    document.addEventListener("visibilitychange",()=>{if(document.hidden)this.visible=false;});
    this.reducedMotion.addEventListener?.("change",e=>{if(e.matches)location.reload();});
    window.addEventListener("resize",()=>{
      this.camera.left=-innerWidth/2;this.camera.right=innerWidth/2;this.camera.top=innerHeight/2;this.camera.bottom=-innerHeight/2;
      this.camera.updateProjectionMatrix();this.renderer.setSize(innerWidth,innerHeight);
    },{passive:true});
  }

  animate() {
    requestAnimationFrame(()=>this.animate());
    this.pos.x+=(this.mouse.x-this.pos.x)*0.45; this.pos.y+=(this.mouse.y-this.pos.y)*0.45;
    this.vel.x*=0.82;this.vel.y*=0.82;
    this.cursorGroup.position.set(this.pos.x-innerWidth/2,-(this.pos.y-innerHeight/2),0);
    const ry=THREE.MathUtils.clamp(this.vel.x*0.025,-0.45,0.45),rx=THREE.MathUtils.clamp(-this.vel.y*0.025,-0.45,0.45);
    this.cursorGroup.rotation.y+=(ry-this.cursorGroup.rotation.y)*0.18;
    this.cursorGroup.rotation.x+=(rx-this.cursorGroup.rotation.x)*0.18;
    const target=this.isPressed?0.96:(this.isHovering?1.28:1.15);
    this.scale+=(target-this.scale)*0.2;this.cursorGroup.scale.setScalar(this.scale);
    this.material.uniforms.uTime.value+=0.016;
    this.material.uniforms.uTilt.value.set(this.cursorGroup.rotation.y,this.cursorGroup.rotation.x);
    this.canvas.style.opacity=this.visible?"1":"0";
    this.renderer.render(this.scene,this.camera);
  }
}

new DiamondCursor();
