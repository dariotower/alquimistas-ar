import * as THREE from 'three';
// All coordinates are relative to the printer-trimmed front, never the back panel.
export const HEIGHT = 1017 / 994;
const A = [.22222, .29100], B = [.77778, .29100], C = [.5, .76080];
export async function makeRelief() {
  const load = new THREE.TextureLoader();
  const [front, paper] = await Promise.all([
    load.loadAsync('frente.png'), load.loadAsync('base.png')
  ]);
  for (const t of [front, paper]) {t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;}
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.PlaneGeometry(1, HEIGHT), new THREE.MeshBasicMaterial({map:paper,side:THREE.DoubleSide}));
  group.add(base);
  const positions=[],uv=[],bump=[],indices=[],rows=[];
  const n=60;
  for(let i=0;i<=n;i++){
    rows[i]=[];
    for(let j=0;j<=n-i;j++){
      const a=i/n,b=j/n,c=1-a-b;
      const u=a*A[0]+b*B[0]+c*C[0],v=a*A[1]+b*B[1]+c*C[1];
      rows[i][j]=bump.length;positions.push(u-.5,(.5-v)*HEIGHT,0);
      uv.push(u,1-v);bump.push(Math.pow(Math.max(0,27*a*b*c),.7));
    }
  }
  for(let i=0;i<n;i++)for(let j=0;j<n-i;j++){
    indices.push(rows[i][j],rows[i+1][j],rows[i][j+1]);
    if(j<n-i-1)indices.push(rows[i+1][j],rows[i+1][j+1],rows[i][j+1]);
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.setIndex(indices);
  // Basic material preserves the exact printed artwork and color. The deformed mesh supplies parallax.
  const relief=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({map:front,side:THREE.DoubleSide}));
  group.add(relief);
  function setDepth(amount){
    const p=geometry.attributes.position;
    for(let k=0;k<p.count;k++)p.setZ(k,.001+amount*.20*bump[k]);
    p.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingSphere();
  }
  setDepth(.65);
  group.userData.setDepth=setDepth;
  return group;
}
