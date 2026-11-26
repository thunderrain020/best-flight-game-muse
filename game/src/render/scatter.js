// CALDERA COURIER — render/scatter.js
// The islands, made alive: deterministic scatter of low-poly pines,
// palms, coastal rocks and red-roofed village houses across the
// archipelago, so no hillside ever reads as one flat grey slope.
// Built once with the world; positions come from groundHeight, so
// every tree, rock and roof sits on real terrain.
import * as THREE from '../../vendor/three.module.min.js';
import { groundHeight, VOLCANO } from '../entities/terrain.js';
import { mulberry32 } from '../core/rng.js';

const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5a3a22 });
const pineMat = new THREE.MeshLambertMaterial({ color: 0x2f7d3c });
const palmMat = new THREE.MeshLambertMaterial({ color: 0x3f9e4d });
const rockMat = new THREE.MeshLambertMaterial({ color: 0x8a8578 });
const wallMat = new THREE.MeshLambertMaterial({ color: 0xd9c48f });
const roofMat = new THREE.MeshLambertMaterial({ color: 0xb83a2a });
const trunkGeo = new THREE.CylinderGeometry(0.9, 1.5, 7, 6);
const pineGeo = new THREE.ConeGeometry(6, 17, 7);
const palmGeo = new THREE.IcosahedronGeometry(6.5, 0);
const rockGeo = new THREE.DodecahedronGeometry(5, 0);

function pine(x, y, z, s) {
  const g = new THREE.Group();
  const t = new THREE.Mesh(trunkGeo, trunkMat);
  t.position.y = 3.5;
  const c = new THREE.Mesh(pineGeo, pineMat);
  c.position.y = 13;
  g.add(t); g.add(c);
  g.position.set(x, y, z);
  g.scale.setScalar(s);
  return g;
}
function palm(x, y, z, s) {
  const g = new THREE.Group();
  const t = new THREE.Mesh(trunkGeo, trunkMat);
  t.position.y = 4; t.rotation.z = 0.16;
  const c = new THREE.Mesh(palmGeo, palmMat);
  c.position.y = 10; c.scale.y = 0.55;
  g.add(t); g.add(c);
  g.position.set(x, y, z);
  g.scale.setScalar(s);
  return g;
}
function rock(x, y, z, s) {
  const m = new THREE.Mesh(rockGeo, rockMat);
  m.position.set(x, y + 1, z);
  m.rotation.set(s * 2.1, s * 3.7, s);
  m.scale.set(s, s * 0.7, s);
  return m;
}
function house(x, y, z, s, rot) {
  const g = new THREE.Group();
  const w = new THREE.Mesh(new THREE.BoxGeometry(16, 9, 13), wallMat);
  w.position.y = 4.5;
  const r = new THREE.Mesh(new THREE.ConeGeometry(11, 7, 4), roofMat);
  r.position.y = 12.5; r.rotation.y = Math.PI / 4;
  g.add(w); g.add(r);
  g.position.set(x, y, z);
  g.rotation.y = rot;
  g.scale.setScalar(s);
  return g;
}

/** Scatter ~100 props over the islands. Runway pads, the strip at
 * z 6520 and the volcano mouth stay clear. */
export function buildScatter(scene) {
  const group = new THREE.Group();
  const rng = mulberry32(4217);
  let trees = 0, rocks = 0, houses = 0;
  // Village clusters on low shores, so roofs read as settlements.
  const villages = [
    { x: -260, z: 1150 }, { x: 330, z: 1750 }, { x: -380, z: 2450 },
    { x: 190, z: 3150 }, { x: -160, z: 3850 }, { x: 440, z: 4550 },
  ];
  for (const v of villages) {
    for (let i = 0; i < 2; i++) {
      const hx = v.x + (rng() - 0.5) * 130, hz = v.z + (rng() - 0.5) * 110;
      const hy = groundHeight(hx, hz);
      if (hy < 9 || hy > 120) continue;
      group.add(house(hx, hy - 1, hz, 0.9 + rng() * 0.5, rng() * Math.PI));
      houses++;
    }
  }
  for (let i = 0; i < 160 && trees + rocks < 90; i++) {
    const x = (rng() - 0.5) * 1500, z = 500 + rng() * 6300;
    const h = groundHeight(x, z);
    if (h < 9 || h > 190) continue;
    if (Math.abs(z - 6520) < 190 && Math.abs(x) < 320) continue;
    const dv = Math.hypot(x - VOLCANO.x, z - VOLCANO.z);
    if (dv < 240) continue;
    if (rng() < 0.22) { group.add(rock(x, h - 1, z, 0.7 + rng() * 1.1)); rocks++; }
    else if (h < 26) { group.add(palm(x, h - 1, z, 0.9 + rng() * 0.6)); trees++; }
    else { group.add(pine(x, h - 1, z, 0.9 + rng() * 0.9)); trees++; }
  }
  scene.add(group);
  return { group, trees, rocks, houses };
}
