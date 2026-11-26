// CALDERA COURIER — render/rings.js
// Target rings as real 3D hoops: glowing torus meshes strung along
// the leg, gold for the next ring, cyan for the rest; passed rings
// vanish. The next ring's label is drawn in 2D over its 3D position.
import * as THREE from '../../vendor/three.module.min.js';
import { nextRing } from '../entities/rings.js';
import { project3D } from './projection.js';

const geo = new THREE.TorusGeometry(26, 1.7, 10, 44);
const inner = new THREE.TorusGeometry(12, 0.9, 8, 32);
const matNext = new THREE.MeshBasicMaterial({ color: 0xffd94d });
const matFar = new THREE.MeshBasicMaterial({ color: 0x7ee0ff });
const matWhite = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });

export function buildRings(rings) {
  const group = new THREE.Group();
  const meshes = rings.map((r) => {
    const m = new THREE.Mesh(geo, matFar);
    m.position.set(r.x, r.y, r.z);
    const innerM = new THREE.Mesh(inner, matWhite);
    innerM.position.copy(m.position);
    group.add(m); group.add(innerM);
    return { ring: r, mesh: m, inner: innerM };
  });
  return { group, meshes };
}

/** Show unpassed rings; pulse and gild the next one. */
export function updateRings(handle, g) {
  const nxt = nextRing(g.rings);
  const pulse = 1 + Math.sin(g.time * 4) * 0.05;
  for (const m of handle.meshes) {
    const show = !m.ring.passed;
    m.mesh.visible = show;
    m.inner.visible = show;
    if (!show) continue;
    const isNext = m.ring === nxt;
    m.mesh.material = isNext ? matNext : matFar;
    m.mesh.scale.setScalar(isNext ? pulse : 1);
  }
}

export function drawRingLabels(ctx, W, H, g, cam) {
  const nxt = nextRing(g.rings);
  if (!nxt) return;
  const s = project3D(cam, W, H, nxt.x, nxt.y + nxt.r + 16, nxt.z);
  if (!s) return;
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 15px Georgia, serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('NEXT RING', s.x, s.y);
}
