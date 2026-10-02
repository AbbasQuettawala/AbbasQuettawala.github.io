import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/** Original decorative robot. Not Waddle CAD, telemetry, or a physical simulation. */
export function mountRobot(root: HTMLElement): () => void {
  const host = root.querySelector<HTMLElement>('[data-canvas]')!;
  const fallback = root.querySelector<HTMLElement>('[data-fallback]')!;
  const controls = root.querySelector<HTMLElement>('[data-controls]')!;
  const hint = root.querySelector<HTMLElement>('[data-drag-hint]')!;
  const status = root.querySelector<HTMLElement>('[data-robot-status]')!;
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Interactive concept duck robot. Drag horizontally or use left and right arrow keys to rotate. Use the buttons below to change its pose.');

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-3.5, 3.5, 3.5, -3.5, .1, 60);
  camera.position.set(5, 3.5, 7);
  camera.lookAt(0, 1.4, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x6c765c, 3));
  const sun = new THREE.DirectionalLight(0xfff1dc, 4);
  sun.position.set(-4, 7, 5); sun.castShadow = true;
  sun.shadow.mapSize.set(1024,1024);
  Object.assign(sun.shadow.camera, { left:-5,right:5,top:6,bottom:-5,near:.1,far:25 });
  sun.shadow.normalBias = .03;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xd9e9f7, 2); fill.position.set(4,3,-3); scene.add(fill);
  const cream = new THREE.MeshStandardMaterial({ color:0xf0ede0,roughness:.48,metalness:.12 });
  const orange = new THREE.MeshStandardMaterial({ color:0xd16836,roughness:.4,metalness:.12 });
  const graphite = new THREE.MeshStandardMaterial({ color:0x354037,roughness:.55,metalness:.3 });
  const steel = new THREE.MeshStandardMaterial({ color:0x929b8b,roughness:.4,metalness:.65 });
  const eye = new THREE.MeshStandardMaterial({color:0xc1dcb2,emissive:0x678155,emissiveIntensity:.6});
  const robot = new THREE.Group(); scene.add(robot); robot.rotation.y = -.22;
  const upper = new THREE.Group(); robot.add(upper);
  function box(parent:THREE.Group,x:number,y:number,z:number,w:number,h:number,d:number,mat:THREE.Material,r=.08){
    const mesh=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,3,r),mat);
    mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  }
  function joint(parent:THREE.Group,x:number,y:number,z:number,r=.18){
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,.14,28),orange);
    mesh.rotation.z=Math.PI/2;mesh.position.set(x,y,z);mesh.castShadow=true;parent.add(mesh);
    const screw=new THREE.Mesh(new THREE.CylinderGeometry(r*.36,r*.36,.16,6),graphite);
    screw.rotation.z=Math.PI/2;screw.position.copy(mesh.position);parent.add(screw);
  }
  // Two exposed articulated legs, broad feet and a rounded shell.
  const knees:THREE.Group[]=[];
  for(const side of [-1,1]){
    const leg=new THREE.Group();leg.position.x=side*.49;robot.add(leg);knees.push(leg);
    box(leg,0,.19,.28,.52,.25,.97,orange,.1);
    box(leg,0,.61,.08,.17,.71,.18,graphite,.025);
    box(leg,0,1.05,0,.2,.43,.22,steel,.03);
    joint(leg,side*.1,.77,.09,.17);
    joint(upper,side*.76,1.28,0,.24);
  }
  box(upper,0,1.65,0,1.53,.95,1.13,cream,.23);
  box(upper,0,1.58,.574,.64,.4,.035,graphite,.08);
  for(const x of [-.15,0,.15]) box(upper,x,1.57,.601,.035,.18,.018,steel,.01);
  for(const side of [-1,1]){
    const wing=box(upper,side*.82,1.7,-.05,.14,.56,.7,cream,.065);
    wing.rotation.x=-.2;
    box(upper,side*.846,1.75,.07,.018,.08,.28,orange,.012);
  }
  const head = new THREE.Group(); head.position.set(0,2.19,.06); upper.add(head);
  box(head,0,.39,0,1.07,.99,.98,cream,.23);
  box(head,0,.49,.48,.87,.36,.11,graphite,.11);
  for(const x of [-.23,.23])box(head,x,.5,.549,.08,.13,.03,eye,.035);
  box(head,0,.14,.71,.8,.21,.64,orange,.085);
  box(head,0,.105,.94,.65,.023,.075,graphite,.009);
  box(head,-.41,.96,-.2,.035,.25,.035,graphite,.01);
  const antenna=new THREE.Mesh(new THREE.SphereGeometry(.07,16,12),orange);antenna.position.set(-.41,1.12,-.2);head.add(antenna);
  // Platform and shadow anchor the robot without importing any user CAD.
  const platform=new THREE.Mesh(new THREE.CylinderGeometry(1.85,1.85,.09,64),new THREE.MeshStandardMaterial({color:0xd7ddc9,roughness:.9}));
  platform.position.y=-.015;platform.receiveShadow=true;scene.add(platform);
  const rim=new THREE.Mesh(new THREE.TorusGeometry(1.72,.009,8,96),steel);rim.rotation.x=Math.PI/2;rim.position.y=.035;scene.add(rim);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.13}));
  ground.rotation.x=-Math.PI/2;ground.position.y=-.063;ground.receiveShadow=true;scene.add(ground);

  let targetY=-.22, targetCrouch=0, targetTilt=0, crouch=0;
  let frame=0, active=true, disposed=false, dragging=false, lastX=0;
  const abort=new AbortController();
  const opts={signal:abort.signal};
  function draw(){
    frame=0;if(disposed || !active || document.hidden)return;
    robot.rotation.y+=(targetY-robot.rotation.y)*.15;
    crouch+=(targetCrouch-crouch)*.14;
    head.rotation.z+=(targetTilt-head.rotation.z)*.14;
    upper.position.y=-crouch*.3;
    knees.forEach((leg)=>{leg.rotation.x=crouch*.12;});
    renderer.render(scene,camera);
    if(Math.abs(targetY-robot.rotation.y)>.001 || Math.abs(targetCrouch-crouch)>.001 || Math.abs(targetTilt-head.rotation.z)>.001)requestDraw();
  }
  function requestDraw(){if(!frame&&!disposed&&active&&!document.hidden)frame=requestAnimationFrame(draw);}
  function resize(){
    const {width,height}=host.getBoundingClientRect();
    if(!width||!height)return;
    const ratio=width/height;
    const halfH=ratio<1.05?2.4:2.1;
    camera.left=-halfH*ratio;camera.right=halfH*ratio;camera.top=halfH;camera.bottom=-halfH;
    camera.updateProjectionMatrix();renderer.setSize(width,height,false);requestDraw();
  }
  canvas.addEventListener('pointerdown',(e)=>{dragging=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId);},opts);
  canvas.addEventListener('pointermove',(e)=>{if(dragging){targetY+=(e.clientX-lastX)*.012;lastX=e.clientX;requestDraw();}},opts);
  for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>{dragging=false;},opts);
  canvas.addEventListener('keydown',(e)=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();targetY+=e.key==='ArrowLeft'?-.24:.24;requestDraw();}},opts);
  controls.addEventListener('click',(e)=>{
    const button=(e.target as HTMLElement).closest<HTMLButtonElement>('[data-pose]');if(!button)return;
    const pose=button.dataset.pose;
    targetTilt=pose==='tilt'?.3:0;targetCrouch=pose==='crouch'?1:0;
    if(pose==='reset')targetY=-.22;
    root.dataset.pose=pose;
    status.textContent=`${pose==='tilt'?'Head tilt':pose==='crouch'?'Crouch':'Neutral pose'} · illustrative motion only`;
    requestDraw();
  },opts);
  function dispose(){
    if(disposed)return;disposed=true;cancelAnimationFrame(frame);abort.abort();resizeObserver.disconnect();visibility.disconnect();
    scene.traverse((o)=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose());}});
    renderer.dispose();canvas.remove();fallback.hidden=false;controls.hidden=true;hint.hidden=true;
    root.dataset.ready='false';delete root.dataset.pose;status.textContent='Concept illustration · not actual robot CAD';
  }
  canvas.addEventListener('webglcontextlost',(e)=>{e.preventDefault();dispose();},opts);
  const resizeObserver=new ResizeObserver(resize);
  const visibility=new IntersectionObserver(([entry])=>{active=entry.isIntersecting;if(active)requestDraw();else{cancelAnimationFrame(frame);frame=0;}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else requestDraw();},opts);
  host.append(canvas);resize();renderer.render(scene,camera);
  fallback.hidden=true;controls.hidden=false;hint.hidden=false;root.dataset.ready='true';
  resizeObserver.observe(host);visibility.observe(root);
  return dispose;
}
