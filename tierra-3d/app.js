import * as THREE from 'three';
import {makeRelief, HEIGHT} from './relief.js';
const $=id=>document.getElementById(id);
const status=t=>$('status').textContent=t;
let mode=null, ar=null, renderer=null, scene=null, camera=null, model=null, busy=false, runId=0;
let angle=-.28, tilt=.08, dragging=false, lastX=0,lastY=0,fitPreview=null;
function notice(message){$('notice').querySelector('p').textContent=message;$('notice').hidden=false;}
$('dismiss').onclick=()=>$('notice').hidden=true;
function setBusy(value){busy=value;for(const id of ['start','preview'])$(id).disabled=value;}
function releaseAR(instance){
  if(!instance)return;
  instance.controller?.stopProcessVideo();
  instance.video?.srcObject?.getTracks().forEach(t=>t.stop());
  instance.video?.remove();
  if(instance._alquimistaResize)window.removeEventListener('resize',instance._alquimistaResize);
  instance.controller?.worker?.terminate();
}
function stop(){
  runId++;
  if(renderer)renderer.setAnimationLoop(null);
  // MindAR.stop() assumes startup finished; clean partially opened streams as well.
  releaseAR(ar);
  $('stage').querySelectorAll('video').forEach(v=>v.srcObject?.getTracks().forEach(t=>t.stop()));
  if(scene)scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material]){m.map?.dispose();m.dispose();}}});
  renderer?.dispose();$('stage').replaceChildren();
  ar=null;renderer=null;scene=null;camera=null;model=null;mode=null;fitPreview=null;
  document.body.classList.remove('experience');$('hud').hidden=true;$('guide').hidden=false;setBusy(false);
}
$('close').onclick=stop;
function enter(next){mode=next;document.body.classList.add('experience');$('hud').hidden=false;}
function updateDepth(){model?.userData.setDepth(Number($('depth').value)/100);}
$('depth').oninput=updateDepth;
async function startPreview(){
  if(busy||mode)return;setBusy(true);const run=++runId;enter('preview');$('guide').hidden=true;
  status('Preparando el relieve…');$('hint').textContent='Arrastrá para girar. Ajustá el relieve para comparar con el original.';
  try{
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setClearColor(0x171a18);renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    $('stage').appendChild(renderer.domElement);scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(35,innerWidth/innerHeight,.01,20);
    fitPreview=()=>{if(!renderer||!camera)return;renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.position.z=Math.max(2.1,1.35/(2*Math.tan(THREE.MathUtils.degToRad(17.5))*camera.aspect));camera.updateProjectionMatrix();};fitPreview();
    const built=await makeRelief();if(run!==runId){built.traverse(o=>{o.geometry?.dispose();o.material?.map?.dispose();o.material?.dispose();});return;}model=built;scene.add(model);updateDepth();
    status('La etiqueta, en relieve');
    renderer.setAnimationLoop(()=>{model.rotation.set(tilt,angle,0);renderer.render(scene,camera);});setBusy(false);
  }catch(e){if(run!==runId)return;console.error(e);stop();notice('No pudimos abrir el visor 3D. Probá con una versión reciente de Safari o Chrome.');}
}
async function startAR(){
  if(busy||mode)return;
  if(!isSecureContext||!navigator.mediaDevices?.getUserMedia){notice('La cámara necesita una dirección HTTPS. Abrí el enlace publicado en Safari o Chrome.');return;}
  setBusy(true);const run=++runId;let instance;enter('ar');status('Preparando cámara y reconocimiento…');$('hint').textContent='Mové el celular suavemente para ver la profundidad.';
  try{
    const {MindARThree}=await import('./mindar-image-three.prod.js');if(run!==runId)return;
    instance=ar=new MindARThree({container:$('stage'),imageTargetSrc:'frente.mind',maxTrack:1,uiLoading:'no',uiScanning:'no',uiError:'no',filterMinCF:.001,filterBeta:1000,warmupTolerance:5,missTolerance:5});
    ({renderer,scene,camera}=ar);renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    const anchor=ar.addAnchor(0);const built=await makeRelief();if(run!==runId){releaseAR(instance);return;}model=built;anchor.group.add(model);updateDepth();
    anchor.onTargetFound=()=>{status('Etiqueta reconocida · explorá el relieve');$('guide').hidden=true;};
    anchor.onTargetLost=()=>{status('Volvé a encuadrar el frente completo');$('guide').hidden=false;};
    // Stop a late camera grant even if the visitor has already closed the view.
    await instance.start();if(run!==runId){releaseAR(instance);instance.renderer.dispose();return;}
    status('Buscando tu etiqueta Tierra…');
    renderer.setAnimationLoop(()=>renderer.render(scene,camera));setBusy(false);
  }catch(e){if(run!==runId){releaseAR(instance);return;}console.error(e);const name=e?.name;stop();notice(name==='NotAllowedError'?'La cámara no tiene permiso. Habilitala para este sitio desde el navegador y volvé a intentar.':name==='NotFoundError'?'No encontramos una cámara disponible. Podés explorar el relieve sin cámara.':'No pudimos iniciar la cámara o el reconocimiento. Cerrá otras aplicaciones que usen la cámara y volvé a intentar en Safari o Chrome.');}
}
$('start').onclick=startAR;$('preview').onclick=startPreview;
$('stage').onpointerdown=e=>{if(mode!=='preview')return;dragging=true;lastX=e.clientX;lastY=e.clientY;$('stage').setPointerCapture(e.pointerId);};
$('stage').onpointermove=e=>{if(!dragging)return;angle=Math.max(-1.15,Math.min(1.15,angle+(e.clientX-lastX)*.006));tilt=Math.max(-.7,Math.min(.7,tilt+(e.clientY-lastY)*.004));lastX=e.clientX;lastY=e.clientY;};
$('stage').onpointerup=$('stage').onpointercancel=()=>dragging=false;
window.addEventListener('resize',()=>fitPreview?.());
window.addEventListener('pagehide',stop);
