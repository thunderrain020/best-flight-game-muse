// CALDERA COURIER — render/rings.js
// Target rings as real 3D hoops: glowing torus meshes strung along
// the leg, gold for the next ring, cyan for the rest; passed rings
// vanish. The next ring's label is drawn in 2D over its 3D position.
import * as THREE from '../../vendor/three.module.min.js';
import { nextRing } from '../entities/rings.js';
import { project3D } from './projection.js';

const geo = new THREE.TorusGeometry(26, 1.7, 10, 44);
const inner = new THREE.TorusGeometry(12, 0.9, 8, 32);
const haloGeo = new THREE.TorusGeometry(29, 2.6, 8, 44);
const matNext = new THREE.MeshBasicMaterial({ color: 0xffd94d });
const matFar = new THREE.MeshBasicMaterial({ color: 0x7ee0ff });
const matWhite = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
const matHalo = new THREE.MeshBasicMaterial({ color: 0xffd94d, transparent: true, opacity: 0.22, depthWrite: false });

export function buildRings(rings) {
  const group = new THREE.Group();
  const meshes = rings.map((r) => {
    const m = new THREE.Mesh(geo, matFar);
    m.position.set(r.x, r.y, r.z);
    const innerM = new THREE.Mesh(inner, matWhite);
    innerM.position.copy(m.position);
    const halo = new THREE.Mesh(haloGeo, matHalo);
    halo.position.copy(m.position);
    group.add(m); group.add(innerM); group.add(halo);
    return { ring: r, mesh: m, inner: innerM, halo };
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
    m.halo.visible = show;
    if (!show) continue;
    const isNext = m.ring === nxt;
    m.mesh.material = isNext ? matNext : matFar;
    m.mesh.scale.setScalar(isNext ? pulse : 1);
    m.halo.scale.setScalar(isNext ? pulse * 1.06 : 1);
  }
}

/** Crisp distance tags over the next two gates: "NEXT RING · 185 m". */
export function drawRingLabels(ctx, W, H, g, cam) {
  const nxt = nextRing(g.rings);
  if (!nxt) return;
  const p = g.plane;
  const tag = (ring, text, yOff, font, color) => {
    const s = project3D(cam, W, H, ring.x, ring.y + ring.r + yOff, ring.z);
    if (!s) return;
    ctx.font = font;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(8,6,12,0.9)';
    ctx.strokeText(text, s.x, s.y);
    ctx.fillStyle = color;
    ctx.fillText(text, s.x, s.y);
  };
  const d1 = Math.round(Math.hypot(nxt.x - p.x, nxt.y - p.y, nxt.z - p.z));
  tag(nxt, `NEXT RING · ${d1} m`, 16, 'bold 15px Georgia, serif', '#ffd94d');
  const after = g.rings.find((r) => !r.passed && r !== nxt) || null;
  if (after) {
    const d2 = Math.round(Math.hypot(after.x - p.x, after.y - p.y, after.z - p.z));
    tag(after, `${d2} m`, 16, 'bold 13px Georgia, serif', '#7ee0ff');
  }
}
